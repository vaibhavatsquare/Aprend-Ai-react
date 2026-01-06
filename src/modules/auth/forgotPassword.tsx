"use client";
import { useRedirect } from "@/src/hooks/router.hooks";
import { Button, Input } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";

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

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsOtpSent(true);
  };

  const handleOtp = async () => {
    setIsResetOpen(true);
  };

  const handleResendOtp = async () => {
    setIsOtpSent(true);
  };

  const onChange: OTPProps["onChange"] = (text) => {
    console.log("onChange:", text);
  };

  const onInput: OTPProps["onInput"] = (value) => {
    console.log("onInput:", value);
  };

  const sharedProps: OTPProps = {
    onChange,
    onInput,
  };

  const handleResetPassword = async (data: ForgotPasswordFormData) => {
    setIsResetOpen(true);
  };

  return (
    <div className="w-full h-full bg-primary flex">
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
            <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[40%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-10">
              <div className="flex flex-col gap-1 text-primary">
                <h1 className="text-2xl font-bold">Enter OTP</h1>
                <p className="text-sm">
                  A magic code sent to your email mattwitting@yahoo.com
                </p>
              </div>

              <div className="w-full flex justify-center">
                <span>
                  <Input.OTP
                    length={4}
                    formatter={(str) => str.toUpperCase()}
                    className="custom-otp"
                    {...sharedProps}
                  />
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <Button
                    onClick={handleOtp}
                    className="mt-6 w-full h-[40px]! bg-primary! text-white! border-none! py-2 px-4 rounded-xl! hover:bg-primary/90! transition-all"
                  >
                    Continue
                  </Button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-600 flex flex-col gap-2 justify-center">
                  Didn't you receive any code?{" "}
                  <span
                    className="text-primary hover:underline cursor-pointer"
                    onClick={handleResendOtp}
                  >
                    Resend
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[40%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-10">
              <div className="flex flex-col gap-1 text-primary">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-medium">
                    Password
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                    }}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Enter your password"
                        className="bg-[#F5F5F5]! border-none! h-[40px] rounded-xl! px-3 py-2 focus:border-none! focus:outline-none! shadow-none!"
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-medium">
                    Confirm Password
                  </label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    }}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Enter your password"
                        className="bg-[#F5F5F5]! border-none! h-[40px] rounded-xl! px-3 py-2 focus:border-none! focus:outline-none! shadow-none!"
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <Button
                    onClick={handleSubmit(handleResetPassword)}
                    className="mt-6 w-full h-[40px]! bg-primary! text-white! border-none! py-2 px-4 rounded-xl! hover:bg-primary/90! transition-all"
                  >
                    Create New Password
                  </Button>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[50%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-8">
            <div className="flex flex-col gap-1 text-primary">
              <h1 className="text-2xl font-bold">Forgot Password</h1>
              <p className="text-sm">
                No worries! Just enter your email, and we'll help you reset your
                password.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-medium">
                  Email Address
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter your email address"
                      className="bg-[#F5F5F5]! border-none! h-[40px] rounded-xl! px-3 py-2 focus:border-none! focus:outline-none! shadow-none!"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleSubmit(handleForgotPassword)}
                  className="mt-6 w-[90%] h-[40px]! bg-primary! text-white! border-none! py-2 px-4 rounded-xl! hover:bg-primary/90! transition-all"
                >
                  Send Verification Code
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
