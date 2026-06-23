"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, MailCheck, MailWarning, Mail } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useVerifyEmail, useResendVerification } from "@/hooks/use-auth";
import { useToastStore } from "@/stores/toast.store";

type Status = "pending" | "verifying" | "success" | "error";

export default function VerifyEmailView() {
  const params = useSearchParams();
  const token = params.get("token");
  const email = params.get("email") ?? "";
  const { addToast } = useToastStore();
  const { mutate: verify } = useVerifyEmail();
  const { mutate: resend, isPending: resending } = useResendVerification();
  const [status, setStatus] = useState<Status>(token ? "verifying" : "pending");
  // Verification tokens are single-use. Guard against React StrictMode's
  // double-invoked effect, which would consume the token twice (the second
  // call would fail and wrongly show "expired").
  const fired = useRef(false);

  useEffect(() => {
    if (token && !fired.current) {
      fired.current = true;
      verify(token, {
        onSuccess: () => setStatus("success"),
        onError: () => setStatus("error"),
      });
    }
  }, [token, verify]);

  const doResend = () => {
    if (!email) return;
    resend(email, {
      onSuccess: () =>
        addToast({ type: "success", title: "Verification email sent." }),
    });
  };

  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto mb-5 animate-spin text-brand-500" size={40} />
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90">
              Verifying your email…
            </h1>
          </>
        )}

        {status === "success" && (
          <>
            <MailCheck className="mx-auto mb-5 text-success-500" size={44} />
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Email verified
            </h1>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Your email address is confirmed. You can now sign in.
            </p>
            <Link href="/login">
              <Button className="w-full" size="sm">
                Continue to Sign In
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <MailWarning className="mx-auto mb-5 text-error-500" size={44} />
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Link invalid or expired
            </h1>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              This verification link is no longer valid. Request a new one
              {email ? ` for ${email}` : ""}.
            </p>
            {email && (
              <Button
                className="w-full"
                size="sm"
                onClick={doResend}
                disabled={resending}
              >
                {resending ? "Sending…" : "Resend verification link"}
              </Button>
            )}
            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/login" className="text-brand-500 hover:text-brand-600">
                Back to Sign In
              </Link>
            </p>
          </>
        )}

        {status === "pending" && (
          <>
            <Mail className="mx-auto mb-5 text-brand-500" size={44} />
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Check your email
            </h1>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              We sent a verification link
              {email ? ` to ${email}` : ""}. Click it to activate your account,
              then sign in.
            </p>
            {email && (
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={doResend}
                disabled={resending}
              >
                {resending ? "Sending…" : "Resend link"}
              </Button>
            )}
            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/login" className="text-brand-500 hover:text-brand-600">
                Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
