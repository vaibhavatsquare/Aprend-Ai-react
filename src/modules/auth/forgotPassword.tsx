"use client";
import { useRedirect } from "@/src/hooks/router.hooks";
import { Button, Input, message } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import Image from "next/image";
import { useState, useEffect } from "react";
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

// Helper function to get user-friendly error messages
const getErrorMessage = (error: any): string => {
  // Check if error has a response with data
  if (error?.response?.data?.message) {
    const message = error.response.data.message.toLowerCase();
    
    // Check for user not found / email not registered errors
    if (message.includes("not found") || 
        message.includes("no account") || 
        message.includes("not registered") ||
        message.includes("user does not exist") ||
        message.includes("invalid email") ||
        message.includes("email not exist")) {
      return "No account exists with this email address. Please check and try again.";
    }
    
    // Check for OTP-related errors
    if (message.includes("too many attempts")) {
      return "Too many attempts. Please try again later.";
    }
    
    if (message.includes("invalid otp")) {
      return "The verification code you entered is incorrect. Please try again.";
    }
    
    // Return the actual message if it's user-friendly
    return error.response.data.message;
  }
  
  // Check if error message directly contains our keywords
  if (error?.message) {
    const msg = error.message.toLowerCase();
    if (msg.includes("not found") || msg.includes("no account")) {
      return "No account exists with this email address. Please check and try again.";
    }
    return error.message;
  }
  
  return "An error occurred. Please try again.";
};

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
  const [resendTimer, setResendTimer] = useState(0);

  // 1) SEND OTP (BE)
  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await sendOtp(data.email!, true);
      setEmailValue(data.email!);
      setIsOtpSent(true);
      message.success("Verification code sent to your email");
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

// RESEND
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      setIsLoading(true);
      await resendOtp(emailValue);
      setResendTimer(60);
      message.success("Verification code resent");
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
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
      message.success("Verification successful");
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

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
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-primary flex">
      {isLoading && <MiniLoader />}
      {/* <div className="h-full flex justify-end"> */}
     <div className="h-full w-[37%] -mr-6 flex-shrink-0 relative overflow-hidden z-0">
        <Image
          src="/images/auth/loginImg.svg"
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <form className="relative z-10 flex-1 h-full bg-white rounded-tl-4xl rounded-bl-4xl flex items-center justify-center">
        <GoArrowLeft
          className="absolute top-5 left-5 cursor-pointer text-xl"
          onClick={() => useRedirect("/login")}
        />

        {isOtpSent ? (
          !isResetOpen ? (
            /* OTP SCREEN */
            // <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[40%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-10">
            <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[40%] h-full overflow-y-auto scrollbar-hide py-20 px-4 flex flex-col justify-center gap-10">
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
                <div style={{ padding: '0 12px', marginTop: '24px' }} className="flex justify-center">
                  <button
                    onClick={handleOtp}
                    disabled={isLoading}
                    className="w-full h-[40px] rounded-xl text-white font-semibold disabled:opacity-50"
                    style={{
                      backgroundImage: "url('/images/buttonBg.svg')",
                      backgroundSize: '350% 700%',
                      backgroundPosition: 'center',
                      boxShadow: '0px 0px 50px 0px #1953CB40',
                      border: '1px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    Verify Code
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">Didn't you receive any code?</p>
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-400 mt-2">Resend in {resendTimer}s</p>
                  ) : (
                    <p
                      className="text-primary cursor-pointer hover:underline mt-2 text-sm font-medium"
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* RESET PASSWORD SCREEN */
            // <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[40%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-10">
            <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[40%] h-full overflow-y-auto scrollbar-hide py-20 px-4 flex flex-col justify-center gap-10">
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

              <div style={{ padding: '0 8px', marginTop: '24px' }} className="flex justify-center">
                <button
                  onClick={handleSubmit(handleResetPassword)}
                  disabled={isLoading}
                  className="w-[500px] h-[40px] rounded-xl text-white font-semibold disabled:opacity-50"
                  style={{
                    backgroundImage: "url('/images/buttonBg.svg')",
                    backgroundSize: '350% 700%',
                    backgroundPosition: 'center',
                    boxShadow: '0px 0px 20px 0px #1953CB40',
                    border: '1px solid rgba(255,255,255,0.35)',
                  }}
                >
                  Create New Password
                </button>
              </div>
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

            <div style={{ padding: '0 14px', marginTop: '24px' }} className="flex justify-center">
              <button
                onClick={handleSubmit(handleForgotPassword)}
                disabled={isLoading}
                className="w-[80%] h-[40px] rounded-xl text-white font-semibold disabled:opacity-50"
                style={{
                  backgroundImage: "url('/images/buttonBg.svg')",
                  backgroundSize: '350% 900%',
                  backgroundPosition: 'center',
                  boxShadow: '0px 0px 50px 0px #1953CB40',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}
              >
                Send Verification Code
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;