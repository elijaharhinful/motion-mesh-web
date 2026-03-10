'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateProfile, useMe } from '@/hooks/use-auth';
import { useToastStore } from '@/stores/toast.store';
import { ProtectedPage } from '@/components/layout/protected-page';
import { User, Save } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

const schema = z.object({
  firstName: z.string().min(1, 'First name required').max(100),
  lastName: z.string().min(1, 'Last name required').max(100),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  return (
    <ProtectedPage>
      <ProfileForm />
    </ProtectedPage>
  );
}

function ProfileForm() {
  const { data: user, isLoading } = useMe();
  const { mutate: update, isPending } = useUpdateProfile();
  const { addToast } = useToastStore();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName, avatarUrl: user.avatarUrl ?? '' });
    }
  }, [user, reset]);

  const onSubmit = (data: FormData) => {
    update(
      { ...data, avatarUrl: data.avatarUrl || undefined },
      {
        onSuccess: () => addToast({ type: 'success', title: 'Profile updated!' }),
        onError: () => addToast({ type: 'error', title: 'Update failed' }),
      },
    );
  };

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-20 animate-pulse"><div className="h-40 bg-white/10 rounded-2xl" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex gap-6 mb-8 border-b border-white/10 pb-6">
        <Link href="/account/purchases" className="text-white/50 hover:text-white text-sm pb-2 transition-colors">Purchases</Link>
        <span className="text-violet-400 border-b-2 border-violet-500 pb-2 text-sm font-medium">Profile</span>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/30 border border-violet-500/20 flex items-center justify-center">
            <User size={24} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">My Profile</h1>
            <p className="text-white/40 text-sm">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-1.5">First Name</label>
              <input {...register('firstName')} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
              {errors.firstName && <p className="mt-1 text-red-400 text-xs">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Last Name</label>
              <input {...register('lastName')} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
              {errors.lastName && <p className="mt-1 text-red-400 text-xs">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-1.5">Avatar URL <span className="text-white/30">(optional)</span></label>
            <input {...register('avatarUrl')} type="url" placeholder="https://…" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/60 transition-all" />
            {errors.avatarUrl && <p className="mt-1 text-red-400 text-xs">{errors.avatarUrl.message}</p>}
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/10 mb-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 capitalize">{user?.creatorProfile ? 'creator' : user?.role?.toLowerCase()}</span>
              <span className="text-white/40 text-xs">
                {user?.isEmailVerified ? '✓ Email verified' : '⚠ Email not verified'}
              </span>
            </div>
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-medium text-sm transition-all"
            >
              <Save size={16} />
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
