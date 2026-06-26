"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { registerUser } from "../../services/auth.service";
import GuestRoute from "@/components/GuestRoute";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/slices/authSlice";

interface RegisterFormData {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const dispatch = useDispatch()

  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
  });

  const [fieldError, setFieldError] = useState<{
    field: string;
    message: string;
  } | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldError?.field === name) {
      setFieldError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const res = await registerUser(formData);

      dispatch(
        setAuth({
          user: res.user,
          accessToken: res.accessToken,
        }),
      );

      router.push(
        `/verify-otp?email=${formData.email}`
      );
    } catch (error: any) {
      if (error?.field && error.field !== "server") {
        setFieldError({
          field: error.field,
          message: error.message,
        });
      } else {
        setError(error?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestRoute>
      <main className="flex min-h-screen items-center justify-center px-4">
        <Link
          href="/"
          className="
          absolute
          left-3
          top-3
          sm:left-6
          sm:top-6
        
          flex
          items-center
          gap-2
        
          rounded-xl
          border
          border-zinc-200
          bg-white
        
          px-3
          py-2
        
          sm:px-4
        
          text-xs
          sm:text-sm
        
          font-medium
          shadow-sm
        
          transition
          hover:bg-zinc-50
        
          dark:border-zinc-800
          dark:bg-zinc-900
          dark:hover:bg-zinc-800
        "
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:block">Back</span>
        </Link>
        <div className="w-full max-w-sm">
          <div
            className={`
            rounded-3xl
            border
            border-zinc-200
            bg-white
            p-6
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            dark:border-zinc-800
            dark:bg-zinc-900
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
          `}
          >
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Create Account</h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create your ProjectHub account
              </p>
            </div>

            {error && (
              <div className="rounded-lg p-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>

                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-3.5 h-4 w-4 text-gray-400  ${
                      fieldError?.field === "email" ? "text-red-500" : ""
                    }`}
                  />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`
                    h-11
                    w-full
                    rounded-xl
                    border
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:ring-2
                    ${
                      fieldError?.field === "email"
                        ? "border-red-500 focus:ring-red-500 text-red-500"
                        : "border-gray-200 focus:ring-blue-500"
                    }`}
                  />
                  {fieldError?.field === "email" && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldError.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`
                  h-11
                  w-full
                  rounded-xl
                  border
                  pl-4
                  pr-12
                  text-sm
                  outline-none
                  transition
                  focus:ring-2
                  ${
                    fieldError?.field === "password"
                      ? "border-red-500 focus:ring-red-500 text-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  />
                  {fieldError?.field === "password" && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldError.message}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                h-11
                w-full
                rounded-xl
                bg-blue-600
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700" />

              <span className="text-xs text-gray-500 dark:text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700" />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-zinc-50
                text-sm
                font-medium
                transition
                hover:bg-gray-50
                dark:border-zinc-700
                dark:bg-zinc-900
                dark:hover:bg-zinc-800
              "
              >
                Continue with Google
              </button>

              <button
                type="button"
                className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-zinc-50
                text-sm
                font-medium
                transition
                hover:bg-gray-50
                dark:border-zinc-700
                dark:bg-zinc-900
                dark:hover:bg-zinc-800
              "
              >
                Continue with GitHub
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </GuestRoute>
  );
}
