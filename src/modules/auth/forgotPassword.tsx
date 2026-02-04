"use client";
import { useRedirect } from "@/src/hooks/router.hooks";
import { Button, Input, message } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import { sendOtp, verifyOtp, resendOtp, changePassword } from "@/src/services/api/auth.api";
import { encryptAES } from "@/src/utils/crypto";
import MiniLoader from "@/src/components/loaders/MiniLoader";

interface ForgotPasswordFormData {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // 1) SEND OTP (BE)
  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await sendOtp(data.email!, true)
      setEmailValue(data.email!);
      setIsOtpSent(true);
      message.success("Verification code sent");
    } catch {
      message.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // RESEND
  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await resendOtp(emailValue);
      message.success("OTP resent");
    } catch {
      message.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // 2) VERIFY OTP (BE)
  const handleOtp = async () => {
    try {
      setIsLoading(true);
      const res = await verifyOtp(emailValue, otp);

      // SAVE verification id from backend
      setVerificationId(res.data.id);

      setIsResetOpen(true);
      message.success("OTP verified");
    } catch {
      message.error("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const sharedProps: OTPProps = {
    onChange: (v) => setOtp(v),
  };

  // 3) RESET PASSWORD (Firebase → BE)
  const handleResetPassword = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      const encrypted = encryptAES(data.password!);
      await changePassword({
        email: emailValue,
        password: encrypted,
        confirmPassword: encrypted,
        verificationId: verificationId,
      });

      message.success("Password updated successfully");
      useRedirect("/login");
    } catch {
      message.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-primary flex">
      {isLoading && <MiniLoader />}
      <div className="h-full flex justify-end">
        <Image
          src="/images/auth/loginImg.svg"
          alt="Login background"
          width={800}
          height={600}
          className="object-contain w-auto h-full"
        />
      </div>

      <form className="relative flex-1 h-full bg-white rounded-tl-4xl rounded-bl-4xl flex items-center justify-center">
        <GoArrowLeft
          className="absolute top-5 left-5 cursor-pointer text-xl"
          onClick={() => useRedirect("/login")}
        />

        {isOtpSent ? (
          !isResetOpen ? (
            /* OTP SCREEN */
            <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[40%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-10">
              <div className="flex flex-col gap-1 text-primary">
                <h1 className="text-2xl font-bold">Enter OTP</h1>
                <p className="text-sm">
                  A magic code sent to your email {emailValue}
                </p>
              </div>

              <div className="w-full flex justify-center">
                <Input.OTP
                  length={4}
                  formatter={(str) => str.toUpperCase()}
                  className="custom-otp"
                  {...sharedProps}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleOtp}
                  className="mt-6 w-full h-[40px]! bg-primary! text-white! border-none! rounded-xl!"
                >
                  Verify Code
                </Button>

                <div className="mt-8 text-center text-sm text-gray-600">
                  Didn’t receive?{" "}
                  <span
                    className="text-primary cursor-pointer"
                    onClick={handleResendOtp}
                  >
                    Resend
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* RESET PASSWORD SCREEN */
            <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[40%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-10">
              <h1 className="text-2xl font-bold text-primary">
                Create New Password
              </h1>

              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Password" />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  validate: (v) =>
                    v === watch("password") || "Passwords do not match",
                }}
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Confirm Password" />
                )}
              />

              <Button
                onClick={handleSubmit(handleResetPassword)}
                className="mt-6 w-full h-[40px]! bg-primary! text-white! border-none! rounded-xl!"
              >
                Create New Password
              </Button>
            </div>
          )
        ) : (
          /* EMAIL SCREEN */
          <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[50%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-8">
            <h1 className="text-2xl font-bold text-primary">
              Forgot Password
            </h1>

            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required" }}
              render={({ field }) => <Input {...field} placeholder="Email" />}
            />

            <Button
              onClick={handleSubmit(handleForgotPassword)}
              className="mt-6 w-full h-[40px]! bg-primary! text-white! border-none! rounded-xl!"
            >
              Send Verification Code
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
