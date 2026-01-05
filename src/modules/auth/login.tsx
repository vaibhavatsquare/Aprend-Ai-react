"use client";
import { Button, Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const handleLogin = async (data: LoginFormData) => {

  }

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
      <form className="flex-1 h-full bg-white rounded-tl-4xl rounded-bl-4xl flex items-center justify-center">
        <div className="w-[50%] h-full overflow-y-auto scrollbar-hide py-20 flex flex-col justify-center gap-8">
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
                        message: "Invalid email address"
                    }
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
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <Controller
                name="password"
                control={control}
                rules={{
                    required: "Password is required"
                }}
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
              <Button onClick={handleSubmit(handleLogin)} className="mt-6 w-[90%] h-[40px]! bg-primary! text-white! border-none! py-2 px-4 rounded-xl! hover:bg-primary/90! transition-all">
                Login
              </Button>
            </div>

            <div className="my-4 flex gap-2 items-center">
              <hr className="flex-1 border-gray-300" />
              <p className="text-gray-500 mx-2 text-sm">or</p>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="flex justify-center">
              <div className="w-[150px] border-r border-gray-300 flex gap-2 items-center justify-center cursor-pointer">
                <Image
                  src="/images/auth/googleLogo.svg"
                  alt="Google login"
                  width={28}
                  height={28}
                  className="w-[28px] h-[28px]"
                />
                <p className="text-[#555555]">Google</p>
              </div>
              <div className="w-[150px] border-gray-300 flex gap-2 items-center justify-center cursor-pointer">
                <Image
                  src="/images/auth/logoApple.svg"
                  alt="Facebook login"
                  width={28}
                  height={28}
                  className="w-[28px] h-[28px]"
                />
                <p className="text-[#555555]">Apple</p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
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
