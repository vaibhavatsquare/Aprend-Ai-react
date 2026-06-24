
"use client";
import { Button, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  signInWithApple,
  signInWithFirebase,
  signInWithGoogle
} from "@/src/services/auth/auth.firebase.service";
import { setCookie } from "@/src/services/coockies/coockie.service";
import { authenticateWithAPI } from "@/src/services/api/auth.api";
import { getFCMToken } from "@/src/configs/firebase.config";
import { handlePostLoginRedirect } from "@/src/utils/redirect";
import MiniLoader from "@/src/components/loaders/MiniLoader";

interface LoginFormData {
  email: string;
  password: string;
}

// Helper function to get user-friendly Firebase error messages
const getFirebaseErrorMessage = (error: any): string => {
  const errorCode = error?.code || error?.message || "";
  const errorMessage = error?.message || "";

  // Invalid credentials (wrong email or password)
  if (errorCode.includes("invalid-credential") || 
      errorCode.includes("invalid-password") ||
      errorMessage.includes("Invalid password")) {
    return "Invalid email or password. Please try again.";
  }

  // User not found
  if (errorCode.includes("user-not-found")) {
    return "No account exists with this email. Please sign up first.";
  }

  // Wrong password
  if (errorCode.includes("wrong-password")) {
    return "Invalid email or password. Please try again.";
  }

  // Too many login attempts
  if (errorCode.includes("too-many-requests")) {
    return "Too many login attempts. Please try again later.";
  }

  // User account disabled
  if (errorCode.includes("user-disabled")) {
    return "This account has been disabled. Contact support for help.";
  }

  // Invalid email format
  if (errorCode.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }

  // Network error
  if (errorCode.includes("network-request-failed")) {
    return "Network error. Please check your connection and try again.";
  }

  // Operation not allowed
  if (errorCode.includes("operation-not-allowed")) {
    return "Login is not available at the moment. Please try again later.";
  }

  // Default error message (if not recognized)
  return "Login failed. Please try again.";
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const isInitialized = useRef(false);

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
          await Promise.all(registrations.map((reg) => reg.unregister()));
        }

        // ✅ Register the service worker properly
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        // ✅ Ensure the registration is ready
        await navigator.serviceWorker.ready;

        // ✅ Get the FCM token
        const token = await getFCMToken(registration);

        if (token) {
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
      isInitialized.current = true;
      registerServiceWorkerAndGetToken();
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // ✅ Fixed: removed duplicate authenticateWithAPI call
const handleGoogleSignIn = async () => {
  if (isLoading) return;
  try {
    setIsLoading(true);
    const result = await signInWithGoogle();
    if (!result) return;
    const { idToken } = result;
    setCookie("idToken", idToken, 7);
    const res = await authenticateWithAPI(fcmToken);
    message.success("Signed in with Google");
    handlePostLoginRedirect(res.user);
  } catch (error: any) {
    const errorMessage = getFirebaseErrorMessage(error);
    message.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  //-------------------------- ++ --------------------------------------------------------


const handleAppleSignIn = async () => {
  if (isLoading) return;
  try {
    setIsLoading(true);
    const result = await signInWithApple();
    if (!result) return;
    const { idToken } = result;
    setCookie("idToken", idToken, 7);
    const res = await authenticateWithAPI(fcmToken);
    message.success("Signed in with Apple.");
    handlePostLoginRedirect(res.user);
  } catch (error: any) {
    const errorMessage = getFirebaseErrorMessage(error);
    message.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const { idToken } = await signInWithFirebase(data.email, data.password);
      setCookie("idToken", idToken, 7);
      const res = await authenticateWithAPI(fcmToken);
      message.success("Login successful");
      handlePostLoginRedirect(res.user);
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-primary flex">
      {/* {isLoading && <MiniLoader />} */}



      
      {/* <div className="h-full flex justify-end">
        <Image
          src="/images/auth/loginImg.svg"
          alt="Login background"
          width={800}
          height={600}
          className="object-contain w-auto h-full"
        />
      </div> */}
      <div className="h-full w-[37%] -mr-6 flex-shrink-0 flex items-center justify-center overflow-hidden relative z-0">
              <Image
                src="/images/auth/loginImg.svg"
                alt="Login background"
                width={390}
                height={844}
                className="object-cover w-full h-full "
              />
            </div>
      <form className="relative z-10 flex-1 h-full bg-white rounded-tl-4xl rounded-bl-4xl flex items-center justify-center">
        <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[50%] h-full overflow-y-auto scrollbar-hide py-10 flex flex-col justify-center gap-8">
          <div className="flex flex-col gap-1 text-primary">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm">Log in to continue your learning</p>
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
              <div className="w-full flex gap-2 justify-between items-center">
                <p className="text-red-500 text-xs">
                  {errors?.password?.message || ""}
                </p>
                <Link href="/forgot-password" className="text-primary text-sm">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSubmit(handleLogin)}
                disabled={isLoading}
                loading={isLoading}
                // className="mt-6 w-[90%] h-[40px]! bg-primary! text-white! border-none! py-2 px-4 rounded-xl! hover:bg-primary/90! transition-all"
                className="btn-primary mt-6 w-[90%] h-[40px]!"
              >
                Sign In
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
              {/* <div className="w-[150px] border-gray-300 flex gap-2 items-center justify-center cursor-pointer"> */}
              <div onClick={handleAppleSignIn} className="w-[150px] border-gray-300 flex gap-2 items-center justify-center cursor-pointer">
                <Image
                  src="/images/auth/logoApple.svg"
                  alt="Apple login"
                  width={28}
                  height={28}
                  className="w-[28px] h-[28px]"
                />
                <p className="text-secondary">Apple</p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;

