'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/use-auth';
import { useToastStore } from '@/stores/toast.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

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

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();
  const { addToast } = useToastStore();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = ({ confirmPassword: _cp, ...body }: FormData) => {
    register(body, {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">Motion<span className="text-violet-400">Mesh</span></span>
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white text-center mb-1">Create your account</h1>
          <p className="text-white/50 text-sm text-center mb-8">Join the dance revolution</p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs text-white/40"><span className="bg-[#0d0d18] px-3">or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 text-xs mb-1.5">First Name</label>
                <input {...rhfRegister('firstName')} placeholder="Jane" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
                {errors.firstName && <p className="mt-1 text-red-400 text-xs">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-white/70 text-xs mb-1.5">Last Name</label>
                <input {...rhfRegister('lastName')} placeholder="Doe" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
                {errors.lastName && <p className="mt-1 text-red-400 text-xs">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1.5">Email</label>
              <input {...rhfRegister('email')} type="email" placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
              {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1.5">Password</label>
              <div className="relative">
                <input {...rhfRegister('password')} type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 transition-all pr-10" />
                <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-red-400 text-xs">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1.5">Confirm Password</label>
              <input {...rhfRegister('confirmPassword')} type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
              {errors.confirmPassword && <p className="mt-1 text-red-400 text-xs">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isPending} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-500/20 mt-2">
              {isPending ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
