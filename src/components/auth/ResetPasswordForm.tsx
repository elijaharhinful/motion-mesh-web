"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useResetPassword } from "@/hooks/use-auth";
import { useToastStore } from "@/stores/toast.store";
import type { ApiError } from "@/types/api.types";

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();
  const { addToast } = useToastStore();
  const { mutate: reset, isPending } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      addToast({
        type: "error",
        title: "Password must be at least 8 characters.",
      });
      return;
    }
    if (password !== confirm) {
      addToast({ type: "error", title: "Passwords do not match." });
      return;
    }
    reset(
      { token, password },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Password reset. Please sign in.",
          });
          router.push("/login");
        },
        onError: (err) => {
          const e2 = err as unknown as ApiError;
          addToast({ type: "error", title: e2.message || "Reset failed" });
        },
      },
    );
  };

  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose a new password for your account.
          </p>
        </div>

        {!token ? (
          <p className="text-sm text-error-500">
            This reset link is missing its token. Please request a new one from{" "}
            <Link href="/forgot-password" className="underline">
              Forgot Password
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="space-y-5">
              <div>
                <Label>
                  New Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
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
              <div>
                <Label>
                  Confirm Password <span className="text-error-500">*</span>
                </Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="sm"
                disabled={isPending}
              >
                {isPending ? "Resetting…" : "Reset password"}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-5">
          <p className="text-sm text-center text-gray-700 dark:text-gray-400 sm:text-start">
            <Link
              href="/login"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
