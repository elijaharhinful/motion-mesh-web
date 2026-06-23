"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useLogin, useResendVerification } from "@/hooks/use-auth";
import { useToastStore } from "@/stores/toast.store";
import { GoogleButton } from "@/components/auth/GoogleButton";
import type { ApiError } from "@/types/api.types";

export default function LoginForm() {
  const router = useRouter();
  const { addToast } = useToastStore();
  const { mutate: login, isPending } = useLogin();
  const { mutate: resend, isPending: resending } = useResendVerification();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerify, setNeedsVerify] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNeedsVerify(false);
    setError(null);
    login(
      { email, password },
      {
        onSuccess: () => router.push("/"),
        onError: (err) => {
          const e2 = err as unknown as ApiError;
          if (e2.statusCode === 403) {
            setNeedsVerify(true);
          } else {
            setError(e2.message || "Invalid email or password.");
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in to MotionMesh.
          </p>
        </div>

        <GoogleButton label="Sign in with Google" />

        <div className="relative py-3 sm:py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
              Or
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-error-300 bg-error-50 p-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {error}
          </div>
        )}

        {needsVerify && (
          <div className="mb-5 rounded-lg border border-warning-300 bg-warning-50 p-4 text-sm text-warning-700 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-orange-400">
            Your email isn&apos;t verified yet. Check your inbox, or{" "}
            <button
              type="button"
              disabled={resending}
              onClick={() =>
                resend(email, {
                  onSuccess: () =>
                    addToast({
                      type: "success",
                      title: "Verification email sent.",
                    }),
                })
              }
              className="font-medium underline disabled:opacity-50"
            >
              resend the link
            </button>
            .
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="info@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" size="sm" disabled={isPending}>
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
