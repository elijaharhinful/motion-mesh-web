'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/use-auth';
import { useToastStore } from '@/stores/toast.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useTheme } from '@/components/context/ThemeContext';

// ─── Validation ──────────────────────────────────────────────────────────────

const schema = z
  .object({
    firstName: z.string().min(1, 'First name required'),
    lastName: z.string().min(1, 'Last name required'),
    email: z.string().email('Valid email required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

// ─── Icons ───────────────────────────────────────────────────────────────────

function EyeOpenIcon() {
  return (
    <svg className="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 4.5C5.86 4.5 2.37 7.16 1 11c1.37 3.84 4.86 6.5 9 6.5s7.63-2.66 9-6.5c-1.37-3.84-4.86-6.5-9-6.5zm0 11a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm0-7.2a2.7 2.7 0 100 5.4 2.7 2.7 0 000-5.4z" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg className="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M2.22 2.22a.75.75 0 011.06 0l14.5 14.5a.75.75 0 01-1.06 1.06l-1.76-1.76A9.07 9.07 0 0110 17.5C5.86 17.5 2.37 14.84 1 11c.6-1.68 1.62-3.17 2.92-4.35L2.22 5.06a.75.75 0 010-1.06L2.22 2.22zM10 6.5c-.45 0-.88.07-1.3.18L7.15 5.13A7.66 7.66 0 0110 4.5c4.14 0 7.63 2.66 9 6.5a9.14 9.14 0 01-2.48 3.6l-1.44-1.43A4.5 4.5 0 0010 6.5zm0 9a4.5 4.5 0 01-3.68-1.9l1.08-1.08A2.7 2.7 0 0010 13.7c1.49 0 2.7-1.21 2.7-2.7 0-.4-.09-.78-.24-1.12l1.37-1.37A4.5 4.5 0 0110 15.5z" />
    </svg>
  );
}

// ─── Floating theme toggle ────────────────────────────────────────────────────

function FloatingThemeToggle() {
  const { toggleTheme } = useTheme();
  return (
    <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="inline-flex size-14 items-center justify-center rounded-full bg-violet-600 text-white transition-colors hover:bg-violet-700"
      >
        <svg className="hidden dark:block" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M9.99998 1.5415C10.4142 1.5415 10.75 1.87729 10.75 2.2915V3.5415C10.75 3.95572 10.4142 4.2915 9.99998 4.2915C9.58577 4.2915 9.24998 3.95572 9.24998 3.5415V2.2915C9.24998 1.87729 9.58577 1.5415 9.99998 1.5415ZM10.0009 6.79327C8.22978 6.79327 6.79402 8.22904 6.79402 10.0001C6.79402 11.7712 8.22978 13.207 10.0009 13.207C11.772 13.207 13.2078 11.7712 13.2078 10.0001C13.2078 8.22904 11.772 6.79327 10.0009 6.79327ZM5.29402 10.0001C5.29402 7.40061 7.40135 5.29327 10.0009 5.29327C12.6004 5.29327 14.7078 7.40061 14.7078 10.0001C14.7078 12.5997 12.6004 14.707 10.0009 14.707C7.40135 14.707 5.29402 12.5997 5.29402 10.0001ZM15.9813 5.08035C16.2742 4.78746 16.2742 4.31258 15.9813 4.01969C15.6884 3.7268 15.2135 3.7268 14.9207 4.01969L14.0368 4.90357C13.7439 5.19647 13.7439 5.67134 14.0368 5.96423C14.3297 6.25713 14.8045 6.25713 15.0974 5.96423L15.9813 5.08035ZM18.4577 10.0001C18.4577 10.4143 18.1219 10.7501 17.7077 10.7501H16.4577C16.0435 10.7501 15.7077 10.4143 15.7077 10.0001C15.7077 9.58592 16.0435 9.25013 16.4577 9.25013H17.7077C18.1219 9.25013 18.4577 9.58592 18.4577 10.0001ZM14.9207 15.9806C15.2135 16.2735 15.6884 16.2735 15.9813 15.9806C16.2742 15.6877 16.2742 15.2128 15.9813 14.9199L15.0974 14.036C14.8045 13.7431 14.3297 13.7431 14.0368 14.036C13.7439 14.3289 13.7439 14.8038 14.0368 15.0967L14.9207 15.9806ZM9.99998 15.7088C10.4142 15.7088 10.75 16.0445 10.75 16.4588V17.7088C10.75 18.123 10.4142 18.4588 9.99998 18.4588C9.58577 18.4588 9.24998 18.123 9.24998 17.7088V16.4588C9.24998 16.0445 9.58577 15.7088 9.99998 15.7088ZM5.96356 15.0972C6.25646 14.8043 6.25646 14.3295 5.96356 14.0366C5.67067 13.7437 5.1958 13.7437 4.9029 14.0366L4.01902 14.9204C3.72613 15.2133 3.72613 15.6882 4.01902 15.9811C4.31191 16.274 4.78679 16.274 5.07968 15.9811L5.96356 15.0972ZM4.29224 10.0001C4.29224 10.4143 3.95645 10.7501 3.54224 10.7501H2.29224C1.87802 10.7501 1.54224 10.4143 1.54224 10.0001C1.54224 9.58592 1.87802 9.25013 2.29224 9.25013H3.54224C3.95645 9.25013 4.29224 9.58592 4.29224 10.0001ZM4.9029 5.9637C5.1958 6.25659 5.67067 6.25659 5.96356 5.9637C6.25646 5.6708 6.25646 5.19593 5.96356 4.90303L5.07968 4.01915C4.78679 3.72626 4.31191 3.72626 4.01902 4.01915C3.72613 4.31204 3.72613 4.78692 4.01902 5.07981L4.9029 5.9637Z" fill="currentColor" />
        </svg>
        <svg className="dark:hidden" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.4547 11.97L18.1799 12.1611C18.265 11.8383 18.1265 11.4982 17.8401 11.3266C17.5538 11.1551 17.1885 11.1934 16.944 11.4207L17.4547 11.97ZM8.0306 2.5459L8.57989 3.05657C8.80718 2.81209 8.84554 2.44682 8.67398 2.16046C8.50243 1.8741 8.16227 1.73559 7.83948 1.82066L8.0306 2.5459ZM12.9154 13.0035C9.64678 13.0035 6.99707 10.3538 6.99707 7.08524H5.49707C5.49707 11.1823 8.81835 14.5035 12.9154 14.5035V13.0035ZM16.944 11.4207C15.8869 12.4035 14.4721 13.0035 12.9154 13.0035V14.5035C14.8657 14.5035 16.6418 13.7499 17.9654 12.5193L16.944 11.4207ZM16.7295 11.7789C15.9437 14.7607 13.2277 16.9586 10.0003 16.9586V18.4586C13.9257 18.4586 17.2249 15.7853 18.1799 12.1611L16.7295 11.7789ZM10.0003 16.9586C6.15734 16.9586 3.04199 13.8433 3.04199 10.0003H1.54199C1.54199 14.6717 5.32892 18.4586 10.0003 18.4586V16.9586ZM3.04199 10.0003C3.04199 6.77289 5.23988 4.05695 8.22173 3.27114L7.83948 1.82066C4.21532 2.77574 1.54199 6.07486 1.54199 10.0003H3.04199ZM6.99707 7.08524C6.99707 5.52854 7.5971 4.11366 8.57989 3.05657L7.48132 2.03522C6.25073 3.35885 5.49707 5.13487 5.49707 7.08524H6.99707Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

// ─── Exact input class from dashboard-sample InputField.tsx ──────────────────
const inputCls =
  'h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800';

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister();
  const { addToast } = useToastStore();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = ({ confirmPassword: _cp, ...body }: FormData) => {
    registerUser(body, {
      onSuccess: () => {
        addToast({ type: 'success', title: 'Account created!', message: 'Welcome to MotionMesh.' });
        router.push('/browse');
      },
      onError: (err: unknown) => {
        const e = err as { message?: string };
        addToast({ type: 'error', title: 'Registration failed', message: e?.message });
      },
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">

        {/* ── LEFT — form panel ── */}
        <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
          {/* Back link */}
          <div className="w-full max-w-md sm:pt-10 mx-auto mb-5 px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" />
              </svg>
              Back to home
            </Link>
          </div>

          {/* Form centering wrapper */}
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6 pb-10">
            {/* Heading */}
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign Up
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your details to create your account!
              </p>
            </div>

            {/* Google button */}
            <div className="mb-0">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="inline-flex w-full items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.751 10.194c0-.721-.059-1.246-.188-1.791H10.18v3.248h4.921a4.209 4.209 0 01-1.726 2.807l-.016.107 2.651 2.012.184.018C17.778 14.979 18.75 12.733 18.75 10.194z" fill="#4285F4"/>
                  <path d="M10.179 18.75c2.41 0 4.434-.777 5.912-2.115l-2.818-2.137c-.754.516-1.724.876-3.094.876-2.361 0-4.365-1.527-5.079-3.634l-.105.01-2.756 2.09-.036.098C3.671 16.785 6.687 18.75 10.18 18.75z" fill="#34A853"/>
                  <path d="M5.1 11.74A5.41 5.41 0 014.818 10c0-.593.102-1.17.272-1.71l-.005-.115-2.79-2.022-.09.042A8.996 8.996 0 001.25 10c0 1.452.348 2.827.957 4.038L5.1 11.74z" fill="#FBBC05"/>
                  <path d="M10.179 4.633c1.676 0 2.807.711 3.452 1.304l2.52-2.41C14.603.892 12.589 0 10.179 0 6.687 0 3.671 1.963 2.207 4.822l2.882 2.193c.724-2.11 2.728-4.382 5.09-4.382z" fill="#EB4335"/>
                </svg>
                Sign up with Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">Or</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                {/* Name row */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      First Name <span className="text-error-500">*</span>
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      placeholder="Jane"
                      className={inputCls}
                    />
                    {errors.firstName && (
                      <p className="mt-1.5 text-xs text-error-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Last Name <span className="text-error-500">*</span>
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      placeholder="Doe"
                      className={inputCls}
                    />
                    {errors.lastName && (
                      <p className="mt-1.5 text-xs text-error-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Email <span className="text-error-500">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Password <span className="text-error-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPw ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      className={inputCls}
                    />
                    <span
                      onClick={() => setShowPw((p) => !p)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPw ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Confirm Password <span className="text-error-500">*</span>
                  </label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Re-enter your password"
                    className={inputCls}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-error-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By creating an account you agree to our{' '}
                  <span className="font-medium text-gray-800 dark:text-white/90">Terms and Conditions</span>
                  {' '}and{' '}
                  <span className="font-medium text-gray-800 dark:text-white/90">Privacy Policy</span>.
                </p>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? 'Creating account…' : 'Create Account'}
                  </button>
                </div>
              </div>
            </form>

            {/* Sign in link */}
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT — branded panel ── */}
        <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-20">
            <svg width="320" height="240" viewBox="0 0 320 240" fill="none">
              {Array.from({ length: 9 }).map((_, r) =>
                Array.from({ length: 13 }).map((_, c) => (
                  <circle key={`${r}-${c}`} cx={c * 26 + 13} cy={r * 26 + 13} r="1.5" fill="white" />
                ))
              )}
            </svg>
          </div>
          <div className="absolute left-0 bottom-0 rotate-180 opacity-20">
            <svg width="320" height="240" viewBox="0 0 320 240" fill="none">
              {Array.from({ length: 9 }).map((_, r) =>
                Array.from({ length: 13 }).map((_, c) => (
                  <circle key={`${r}-${c}`} cx={c * 26 + 13} cy={r * 26 + 13} r="1.5" fill="white" />
                ))
              )}
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center max-w-xs mx-auto text-center">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                <Zap size={22} className="text-white" />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">
                Motion<span className="text-violet-300">Mesh</span>
              </span>
            </Link>
            <p className="text-gray-400 dark:text-white/60 text-sm leading-relaxed">
              Join thousands of creators and fans on the AI dance video marketplace.
            </p>
          </div>
        </div>

      </div>

      {/* ── Floating theme toggle ── */}
      <FloatingThemeToggle />
    </div>
  );
}
