"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useForgotPassword } from "@/hooks/use-auth";

export default function ForgotPasswordForm() {
  const { mutate: forgot, isPending } = useForgotPassword();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always resolves uniformly (no account enumeration).
    forgot(email, { onSettled: () => setSent(true) });
  };

  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto mb-5 text-success-500" size={44} />
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Check your email
            </h1>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              If an account exists for {email}, we&apos;ve sent a link to reset
              your password.
            </p>
            <Link href="/login" className="text-brand-500 hover:text-brand-600">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Forgot Password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and we&apos;ll send you a link to reset your
                password.
              </p>
            </div>
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
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={isPending}
                >
                  {isPending ? "Sending…" : "Send reset link"}
                </Button>
              </div>
            </form>
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
          </>
        )}
      </div>
    </div>
  );
}
