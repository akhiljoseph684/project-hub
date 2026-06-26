"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { resendOtp, verifyOtp } from "@/services/auth.service";
import VerifyOtpRoute from "@/components/VerifyOtpRoute";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/slices/authSlice";
import { showInfoToast } from "@/lib/toast";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const inputs = useRef<HTMLInputElement[]>([]);

  const dispatch = useDispatch();

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split("");

    setOtp(newOtp);

    inputs.current[5]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");

      const code = otp.join("");

      const response = await verifyOtp({
        email,
        otp: code,
      });

      dispatch(
        setAuth({
          user: response.user,
          accessToken: response.accessToken,
        }),
      );

      router.push("/dashboard");
    } catch (error: any) {
      setError(error?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await resendOtp({
        email,
      });

      showInfoToast(response.message)
    } catch (error: any) {
      setError(error?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VerifyOtpRoute>
      <main className="flex min-h-screen items-center justify-center px-4">
        <Link
          href="/register"
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
            className="
            rounded-3xl
            border
            border-zinc-200
            bg-white
            p-6

            shadow-[0_20px_60px_rgba(0,0,0,0.08)]

            dark:border-zinc-800
            dark:bg-zinc-900
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
          "
          >
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Verify OTP</h1>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Enter the 6 digit code sent to
              </p>

              <p className="mt-1 text-sm font-medium">{email}</p>
            </div>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    if (el) inputs.current[index] = el;
                  }}
                  value={digit}
                  maxLength={1}
                  type="text"
                  onPaste={handlePaste}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="
                    h-12
                    w-12
                
                    rounded-xl
                    border
                    border-zinc-300
                
                    bg-white
                    dark:bg-zinc-950
                
                    text-center
                    text-lg
                    font-semibold
                
                    outline-none
                
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500
                
                    dark:border-zinc-700
                  "
                />
              ))}
            </div>

            {error && (
              <div className="mt-4 rounded-lg text-center text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading}
              className="
              mt-6
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
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the code?
              <button
                className="
                ml-1
                font-medium
                text-blue-600
                hover:underline
              "
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </main>
    </VerifyOtpRoute>
  );
}
