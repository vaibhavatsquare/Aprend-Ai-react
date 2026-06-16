
// "use client";
// import { useRedirect } from "@/src/hooks/router.hooks";
// import { Button, Input, message } from "antd";
// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect, useRef } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { GoArrowLeft } from "react-icons/go";
// import { signUpWithFirebase, signInWithGoogle, signInWithApple } from "@/src/services/auth/auth.firebase.service";
// import { setCookie } from "@/src/services/coockies/coockie.service";
// import { authenticateWithAPI } from "@/src/services/api/auth.api";
// import { getFCMToken } from "@/src/configs/firebase.config";
// import MiniLoader from "@/src/components/loaders/MiniLoader";
// import { signOut } from "firebase/auth";
// import { auth } from "@/src/configs/firebase.config";
// import { handlePostLoginRedirect } from "@/src/utils/redirect";


// interface SignUpFormData {
//   email: string;
//   password: string;
// }

// // ✅ Helper to clear all auth state before redirecting to login
// const clearAuthState = async () => {
//   await signOut(auth);
//   document.cookie = "idToken=; max-age=0";
//   localStorage.clear();
// };

// const SignUp = () => {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignUpFormData>();

//   const [isLoading, setIsLoading] = useState(false);
//   const [fcmToken, setFcmToken] = useState("");
//   const isInitialized = useRef(false);

//   useEffect(() => {
//     const registerServiceWorkerAndGetToken = async () => {
//       try {
//         if (Notification.permission !== "granted") {
//           const permission = await Notification.requestPermission();
//           if (permission !== "granted") {
//             localStorage.setItem("notificationToken", "");
//             return;
//           }
//         }

//         // 🔥 Unregister existing service workers to prevent duplicates
//         const registrations = await navigator.serviceWorker.getRegistrations();
//         if (registrations.length > 0) {
//           await Promise.all(registrations.map((reg) => reg.unregister()));
//         }

//         // ✅ Register the service worker properly
//         const registration = await navigator.serviceWorker.register(
//           "/firebase-messaging-sw.js"
//         );

//         // ✅ Ensure the registration is ready
//         await navigator.serviceWorker.ready;

//         // ✅ Get the FCM token
//         const token = await getFCMToken(registration);

//         if (token) {
//           localStorage.setItem("notificationToken", token);
//           setFcmToken(token);
//         } else {
//           console.error("No FCM Token available.");
//         }
//       } catch (error) {
//         console.error("Error during Service Worker or FCM setup:", error);
//       }
//     };

//     if (!isInitialized.current && "serviceWorker" in navigator) {
//       isInitialized.current = true;
//       registerServiceWorkerAndGetToken();
//     }
//   }, []);

//   // ✅ Fixed: removed OTP flow, clears auth, redirects to login
//   const handleSignUp = async (data: SignUpFormData) => {
//     try {
//       setIsLoading(true);
//       const user = await signUpWithFirebase(data.email, data.password);
//       const idToken = await user.getIdToken(true);
//       setCookie("idToken", idToken, 7);
//       const res = await authenticateWithAPI(fcmToken);
//       message.success("Account created successfully.");
//       handlePostLoginRedirect(res.user);
//     } catch (error: any) {
//       message.error(error?.message || "Signup failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ✅ Fixed: clears auth state before redirecting to login
//   const handleGoogleSignIn = async () => {
//     if (isLoading) return;
//     try {
//       setIsLoading(true);
//       const result = await signInWithGoogle();
//       if (!result) return;
//       const { idToken } = result;
//       setCookie("idToken", idToken, 7);
//       const res = await authenticateWithAPI(fcmToken);
//       message.success("Account created successfully.");
//       handlePostLoginRedirect(res.user);
//     } catch (error: any) {
//       message.error(error.message || "Google sign-in failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleAppleSignIn = async () => {
//     if (isLoading) return;
//     try {
//       setIsLoading(true);
//       const result = await signInWithApple();
//       if (!result) return;
//       const { idToken } = result;
//       setCookie("idToken", idToken, 7);
//       const res = await authenticateWithAPI(fcmToken);
//       message.success("Signed in with Apple.");
//       handlePostLoginRedirect(res.user);
//     } catch (error: any) {
//       message.error(error.message || "Apple sign-in failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };



//   //----------------------- ++ -------------------------------------------------------------
//   return (
//     <div className="w-full h-screen overflow-hidden bg-primary flex">
//       {/* {isLoading && <MiniLoader />} */}
//       {/* <div className="h-full flex justify-end">
//         <Image
//           src="/images/auth/loginImg.svg"
//           alt="Login background"
//           width={800}
//           height={600}
//           className="object-contain w-auto max-h-screen"
//         />
//       </div> */}

//       <div className="h-full w-[35%] flex-shrink-0 flex items-center justify-center overflow-hidden">
//         <Image
//           src="/images/auth/loginImg.svg"
//           alt="Login background"
//           width={390}
//           height={844}
//           className="object-cover w-full h-full "
//         />
//       </div>
//       <form className="relative flex-1 h-full bg-white rounded-tl-4xl rounded-bl-4xl flex items-center justify-center">
//         <GoArrowLeft
//           className="absolute top-5 left-5 cursor-pointer text-xl"
//           onClick={() => useRedirect("/login")}
//         />

//         <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[50%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-8">
//           <div className="flex flex-col gap-1 text-primary">
//             <h1 className="text-2xl font-bold">Let's get started</h1>
//             <p className="text-sm">
//               Start your learning journey in just a few steps
//             </p>
//           </div>

//           <div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-2">
//               <label htmlFor="email" className="font-medium">
//                 Email Address
//               </label>
//               <Controller
//                 name="email"
//                 control={control}
//                 rules={{
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: "Invalid email address",
//                   },
//                 }}
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     placeholder="Enter your email address"
//                     className="bg-[#F5F5F5]! border-none! h-[40px] rounded-xl! px-3 py-2 focus:border-none! focus:outline-none! shadow-none!"
//                   />
//                 )}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col gap-2">
//               <label htmlFor="password" className="font-medium">
//                 Password
//               </label>
//               <Controller
//                 name="password"
//                 control={control}
//                 rules={{
//                   required: "Password is required",
//                 }}
//                 render={({ field }) => (
//                   <Input.Password
//                     {...field}
//                     placeholder="Enter your password"
//                     className="bg-[#F5F5F5]! border-none! h-[40px] rounded-xl! px-3 py-2 focus:border-none! focus:outline-none! shadow-none!"
//                   />
//                 )}
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-xs">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-center">
//               <Button
//                 loading={isLoading}
//                 disabled={isLoading}
//                 onClick={handleSubmit(handleSignUp)}
//                 // className="mt-6 w-[90%] h-[40px]! bg-primary! text-white! border-none! py-2 px-4 rounded-xl! hover:bg-primary/90! transition-all"
//                 className="btn-primary mt-6 w-[90%] h-[40px]!"
//               >
//                 Sign Up
//               </Button>
//             </div>

//             <div className="my-4 flex gap-2 items-center">
//               <hr className="flex-1 border-gray-300" />
//               <p className="text-gray-500 mx-2 text-sm">or</p>
//               <hr className="flex-1 border-gray-300" />
//             </div>

//             <div className="flex justify-center">
//               <div
//                 onClick={handleGoogleSignIn}
//                 className="w-[150px] border-r border-gray-300 flex gap-2 items-center justify-center cursor-pointer"
//               >
//                 <Image
//                   src="/images/auth/googleLogo.svg"
//                   alt="Google login"
//                   width={28}
//                   height={28}
//                   className="w-[28px] h-[28px]"
//                 />
//                 <p className="text-secondary">Google</p>
//               </div>
//               <div
//                 onClick={handleAppleSignIn}
//                 className="w-[150px] border-gray-300 flex gap-2 items-center justify-center cursor-pointer"
//               >
//                 <Image
//                   src="/images/auth/logoApple.svg"
//                   alt="Apple login"
//                   width={28}
//                   height={28}
//                   className="w-[28px] h-[28px]"
//                 />
//                 <p className="text-secondary">Apple</p>
//               </div>
//             </div>

//             <p className="mt-8 text-center text-sm text-gray-600">
//               Already have an account?{" "}
//               <Link href="/login" className="text-primary hover:underline">
//                 Sign In
//               </Link>
//             </p>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignUp;



"use client";
import { useRedirect } from "@/src/hooks/router.hooks";
import { Button, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { GoArrowLeft } from "react-icons/go";
import { signUpWithFirebase, signInWithGoogle, signInWithApple } from "@/src/services/auth/auth.firebase.service";
import { setCookie } from "@/src/services/coockies/coockie.service";
import { authenticateWithAPI, sendOtp, verifyOtp, resendOtp } from "@/src/services/api/auth.api";
import { getFCMToken } from "@/src/configs/firebase.config";
import { signOut } from "firebase/auth";
import { auth } from "@/src/configs/firebase.config";
import { handlePostLoginRedirect } from "@/src/utils/redirect";

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

  const [step, setStep] = useState<"form" | "otp">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isInitialized = useRef(false);

  // ── FCM Token setup ────────────────────────────────────────────────────────
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
        const registrations = await navigator.serviceWorker.getRegistrations();
        if (registrations.length > 0) {
          await Promise.all(registrations.map((reg) => reg.unregister()));
        }
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        await navigator.serviceWorker.ready;
        const token = await getFCMToken(registration);
        if (token) {
          localStorage.setItem("notificationToken", token);
          setFcmToken(token);
        }
      } catch (error) {
        console.error("FCM setup error:", error);
      }
    };

    if (!isInitialized.current && "serviceWorker" in navigator) {
      isInitialized.current = true;
      registerServiceWorkerAndGetToken();
    }
  }, []);

  // ── Resend timer countdown ─────────────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // ── Step 1: Signup + send OTP ──────────────────────────────────────────────
  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      const user = await signUpWithFirebase(data.email, data.password);
      const idToken = await user.getIdToken(true);
      setCookie("idToken", idToken, 7);
      await sendOtp(data.email, true);
      setCurrentEmail(data.email);
      setStep("otp");
      setResendTimer(60);
      message.success("OTP sent to your email!");
    } catch (error: any) {
      // Clean up Firebase user if something fails
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch {
          // delete() requires recent login — if it fails, sign out anyway
        }
        await signOut(auth);
        document.cookie = "idToken=; max-age=0";
      }
      message.error(error?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify OTP + authenticate ─────────────────────────────────────
  const handleVerifyOtp = async () => {
    const otp = otpValues.join("");
    if (otp.length < 4) {
      message.error("Please enter the complete 4-digit OTP");
      return;
    }

    try {
      setVerifyLoading(true);
      await verifyOtp(currentEmail, otp);
      const res = await authenticateWithAPI(fcmToken);
      message.success("Account created successfully!");
      handlePostLoginRedirect(res.user);
    } catch (error: any) {
      message.error(error?.message || "Invalid OTP. Please try again.");
      // Clear OTP inputs on error
      setOtpValues(["", "", "", "",]);
      otpRefs.current[0]?.focus();
    } finally {
      setVerifyLoading(false);
    }
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      await resendOtp(currentEmail);
      setResendTimer(60);
      setOtpValues(["", "", "", "",]);
      otpRefs.current[0]?.focus();
      message.success("OTP resent!");
    } catch (error: any) {
      message.error(error?.message || "Failed to resend OTP");
    }
  };

  // ── OTP input handlers ─────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // numbers only

    const newValues = [...otpValues];
    newValues[index] = value.slice(-1); // only last digit
    setOtpValues(newValues);

    // Auto-advance to next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Go back on backspace if empty
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    // Submit on Enter
    if (e.key === "Enter") {
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const newValues = [...otpValues];
    pasted.split("").forEach((char, i) => {
      newValues[i] = char;
    });
    setOtpValues(newValues);
    otpRefs.current[Math.min(pasted.length, 3)]?.focus();
  };

  // ── Google / Apple (no OTP needed) ────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      if (!result) return;
      setCookie("idToken", result.idToken, 7);
      const res = await authenticateWithAPI(fcmToken);
      message.success("Account created successfully.");
      handlePostLoginRedirect(res.user);
    } catch (error: any) {
      message.error(error.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const result = await signInWithApple();
      if (!result) return;
      setCookie("idToken", result.idToken, 7);
      const res = await authenticateWithAPI(fcmToken);
      message.success("Signed in with Apple.");
      handlePostLoginRedirect(res.user);
    } catch (error: any) {
      message.error(error.message || "Apple sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP Screen ─────────────────────────────────────────────────────────────
  if (step === "otp") {
    return (
      <div className="w-full h-screen overflow-hidden bg-primary flex">
        <div className="h-full w-[35%] flex-shrink-0 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/auth/loginImg.svg"
            alt="Login background"
            width={390}
            height={844}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="relative flex-1 h-full bg-white rounded-tl-4xl rounded-bl-4xl flex items-center justify-center">
          <GoArrowLeft
            className="absolute top-5 left-5 cursor-pointer text-xl"
            onClick={() => {
              setStep("form");
              setOtpValues(["", "", "", "",]);
            }}
          />

          <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[50%] flex flex-col gap-8">
            <div className="flex flex-col gap-2 text-primary">
              <h1 className="text-2xl font-bold">Verify your email</h1>
              <p className="text-sm text-gray-500">
                We sent a 4-digit OTP to{" "}
                <span className="font-medium text-primary">{currentEmail}</span>
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex gap-3 justify-center">
              {otpValues.map((val, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="w-[52px] h-[56px] text-center text-[22px] font-semibold border-2 rounded-xl outline-none transition-all"
                  style={{
                    borderColor: val ? "#2563EB" : "#E5E7EB",
                    backgroundColor: val ? "#EFF6FF" : "#F9FAFB",
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              loading={verifyLoading}
              disabled={verifyLoading || otpValues.join("").length < 4}
              onClick={handleVerifyOtp}
              className="btn-primary w-full h-[40px]!"
            >
              Verify OTP
            </Button>

            {/* Resend */}
            <p className="text-center text-sm text-gray-500">
              Didn't receive it?{" "}
              {resendTimer > 0 ? (
                <span className="text-gray-400">Resend in {resendTimer}s</span>
              ) : (
                <span
                  onClick={handleResendOtp}
                  className="text-primary font-medium cursor-pointer hover:underline"
                >
                  Resend OTP
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Signup Form ────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-screen overflow-hidden bg-primary flex">
      <div className="h-full w-[37%] -mr-6 flex-shrink-0 flex items-center justify-center overflow-hidden relative z-0">
        <Image
          src="/images/auth/loginImg.svg"
          alt="Login background"
          width={390}
          height={844}
          className="object-cover w-full h-full"
        />
      </div>

      <form
        className="relative z-10 flex-1 h-full bg-white rounded-tl-4xl rounded-bl-4xl flex items-center justify-center"
        onSubmit={handleSubmit(handleSignUp)}
      >
        {/* <GoArrowLeft
          className="absolute top-5 left-5 cursor-pointer text-xl"
          onClick={() => useRedirect("/login")}
        /> */}

        <div className="w-[90%] sm:w-[80%] md:w-[60%] xl:w-[50%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-8">
          <div className="flex flex-col gap-1 text-primary">
            <h1 className="text-2xl font-bold">Let's get started</h1>
            <p className="text-sm">Start your learning journey in just a few steps</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Email Address</label>
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
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium">Password</label>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="Enter your password"
                    className="bg-[#F5F5F5]! border-none! h-[40px] rounded-xl! px-3 py-2 focus:border-none! focus:outline-none! shadow-none!"
                  />
                )}
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="flex justify-center">
              <Button
                loading={isLoading}
                disabled={isLoading}
                htmlType="submit"
                className="btn-primary mt-6 w-[90%] h-[40px]!"
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
                <Image src="/images/auth/googleLogo.svg" alt="Google" width={28} height={28} />
                <p className="text-secondary">Google</p>
              </div>
              <div
                onClick={handleAppleSignIn}
                className="w-[150px] flex gap-2 items-center justify-center cursor-pointer"
              >
                <Image src="/images/auth/logoApple.svg" alt="Apple" width={28} height={28} />
                <p className="text-secondary">Apple</p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;