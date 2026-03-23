"use client";
import { useRedirect } from "@/src/hooks/router.hooks";
import { Button, Input, message } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import { signUpWithFirebase, signInWithGoogle } from "@/src/services/auth/auth.firebase.service";
import { setCookie } from "@/src/services/coockies/coockie.service";
import { authenticateWithAPI, resendOtp, sendOtp, verifyOtp } from "@/src/services/api/auth.api";
import { getFCMToken } from "@/src/configs/firebase.config";
import MiniLoader from "@/src/components/loaders/MiniLoader";

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

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [fcmToken, setFcmToken] = useState("");
  const isInitialized = useRef(false);

  useEffect(() => {
    let interval: any;

    if (isOtpSent && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isOtpSent, canResend]);

  useEffect(() => {
    const registerServiceWorkerAndGetToken = async () => {
      try {
        if (Notification.permission !== "granted") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            localStorage.setItem("notificationToken", "");
            return;
          }
        }

        // 🔥 Unregister existing service workers to prevent duplicates
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          // console.warn("Multiple Service Workers found. Unregistering all...", registrations);
          await Promise.all(registrations.map((reg) => reg.unregister()));
          // console.log("Old Service Workers unregistered.");
        }

        // ✅ Register the service worker properly
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        // console.log("New Service Worker registered:", registration);

        // ✅ Ensure the registration is ready
        await navigator.serviceWorker.ready;

        // ✅ Get the FCM token
        const token = await getFCMToken(registration);

        if (token) {
          // console.log("FCM Token retrieved:", token);
          localStorage.setItem("notificationToken", token);
          setFcmToken(token);
        } else {
          console.error("No FCM Token available.");
        }
      } catch (error) {
        console.error("Error during Service Worker or FCM setup:", error);
      }
    };

    if (!isInitialized.current && "serviceWorker" in navigator) {
      isInitialized.current = true; // Mark as initialized
      registerServiceWorkerAndGetToken();
    }
  }, []);

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);

      const user = await signUpWithFirebase(data.email, data.password);
      const idToken = await user.getIdToken(true);
      setCookie("idToken", idToken, 7);

      await authenticateWithAPI(fcmToken);
      setUserEmail(data.email);
      await sendOtp(data.email, false)
      setIsOtpSent(true);
      startResendTimer();

      message.success("OTP sent to your email");
    } catch (error: any) {
      message.error(error?.message || "Signup failed");
    } finally {
      setIsLoading(false);
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
      await authenticateWithAPI(fcmToken);
      message.success("Signed in with Google");
      useRedirect("/home", true);
    } catch (error: any) {
      message.error(error.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtp = async () => {
    try {
      if (otpValue.length < 4) {
        return message.warning("Enter valid OTP");
      }

      setIsLoading(true);
      const res = await verifyOtp(userEmail, otpValue);

      message.success("OTP verified");
      useRedirect("/home", true);
    } catch (err: any) {
      message.error(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    setCanResend(false);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      setIsLoading(true);
      await resendOtp(userEmail)
      message.success("OTP resent");
      startResendTimer();
    } catch {
      message.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange: OTPProps["onChange"] = (text) => {
    setOtpValue(text);
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
      {isLoading && <MiniLoader />}
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
                A magic code sent to your email{" "}
                <span className="font-medium">{userEmail}</span>
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
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={handleOtp}
                  className="mt-6 w-full h-[40px]! bg-primary! text-white! border-none! py-2 px-4 rounded-xl! hover:bg-primary/90! transition-all"
                >
                  Continue
                </Button>
              </div>

              <div className="mt-8 text-center text-sm text-gray-600 flex flex-col gap-2 justify-center">
                Didn't you receive any code?{" "}
                {canResend ? (
                  <span
                    className="text-primary hover:underline cursor-pointer"
                    onClick={handleResendOtp}
                  >
                    Resend
                  </span>
                ) : (
                  <span className="text-gray-400">
                    Resend in {resendTimer}s
                  </span>
                )}
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
                  loading={isLoading}
                  disabled={isLoading}
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
