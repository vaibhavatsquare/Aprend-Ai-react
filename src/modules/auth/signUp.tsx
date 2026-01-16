"use client";
import { useRedirect } from "@/src/hooks/router.hooks";
import { Button, Input, message } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import { signUpWithFirebase, signInWithGoogle } from "@/src/services/auth/auth.service";
import { setCookie } from "@/src/services/coockies/coockie.service";

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: SignUpFormData) => {
    try {

      const user = await signUpWithFirebase(
        data.email,
        data.password
      );

      const idToken = await user.getIdToken(true);
      setCookie("idToken", idToken, 7);

      message.success("Account created successfully");
      useRedirect("/home");
    } catch (error: any) {
      message.error(error?.message || "Signup failed");
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const result = await signInWithGoogle();
      if (!result) return;

      const { user, idToken } = result;
      setCookie("idToken", idToken, 7);

      message.success("Signed in with Google");
      router.replace("/home");
    } catch (error: any) {
      message.error(error.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtp = async () => {
    setIsOtpSent(false);
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

  return (
    <div className="w-full h-full bg-primary flex">
      <div className="h-full flex justify-end">
        <Image
          src="/images/auth/loginImg.svg"
          alt="Login background"
          width={800}
          height={600}
          className="object-contain w-auto max-h-screen"
        />
      </div>
      <form className="relative flex-1 h-screen bg-white rounded-tl-4xl rounded-bl-4xl flex items-center justify-center">
        <GoArrowLeft className="absolute top-5 left-5 cursor-pointer text-xl" onClick={() => useRedirect("/login")} />
        {isOtpSent ? (
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
          <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[50%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-8">
            <div className="flex flex-col gap-1 text-primary">
              <h1 className="text-2xl font-bold">Let's get started</h1>
              <p className="text-sm">
                Start your learning journey in just a few steps
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
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="font-medium">
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

              <div className="flex justify-center">
                <Button
                  onClick={handleSubmit(handleSignUp)}
                  className="mt-6 w-[90%] h-[40px]! bg-primary! text-white! border-none! py-2 px-4 rounded-xl! hover:bg-primary/90! transition-all"
                >
                  Sign Up
                </Button>
              </div>

              <div className="my-4 flex gap-2 items-center">
                <hr className="flex-1 border-gray-300" />
                <p className="text-gray-500 mx-2 text-sm">or</p>
                <hr className="flex-1 border-gray-300" />
              </div>

              <div className="flex justify-center">
                <div
                  onClick={handleGoogleSignIn}
                  className="w-[150px] border-r border-gray-300 flex gap-2 items-center justify-center cursor-pointer"
                >
                  <Image
                    src="/images/auth/googleLogo.svg"
                    alt="Google login"
                    width={28}
                    height={28}
                    className="w-[28px] h-[28px]"
                  />
                  <p className="text-secondary">Google</p>
                </div>
                <div className="w-[150px] border-gray-300 flex gap-2 items-center justify-center cursor-pointer">
                  <Image
                    src="/images/auth/logoApple.svg"
                    alt="Facebook login"
                    width={28}
                    height={28}
                    className="w-[28px] h-[28px]"
                  />
                  <p className="text-secondary">Apple</p>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUp;
