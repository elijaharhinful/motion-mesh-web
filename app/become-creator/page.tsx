"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useToastStore } from '@/stores/toast.store';
import { apiClient } from '@/lib/api-client';
import type { CreatorProfile } from '@/types/api.types';
import { useEffect } from 'react';
import { UserRole } from '@/types/enums';

const becomeCreatorSchema = z.object({
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  socialLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof becomeCreatorSchema>;

export default function BecomeCreatorPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(becomeCreatorSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login?redirect=/become-creator');
    } else if (user?.creatorProfile) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.creatorProfile) return null;

  async function onSubmit(values: FormData) {
    try {
      const payload = {
        bio: values.bio || null,
        socialLink: values.socialLink || null,
      };
      
      const profile = await apiClient.post<CreatorProfile>('/creators/apply', payload);
      
      // Update the user role in local state directly
      updateUser({ role: UserRole.CREATOR, creatorProfile: profile });
      addToast({ type: 'success', title: 'Welcome! You are now a Creator.' });
      router.push('/dashboard');
    } catch (error: unknown) {
      const e = error as { message?: string };
      addToast({ type: 'error', title: e?.message || 'Failed to submit application' });
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Become a Creator</h1>
        <p className="mt-4 text-lg text-gray-400">
          Start monetizing your dance moves today. Keep complete ownership of your copyright.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0b0b12] p-6 shadow-xl sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-200">
              Creator Bio <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="mt-2">
              <textarea
                id="bio"
                rows={4}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                placeholder="Tell us a little about your dance background..."
                {...register('bio')}
              />
            </div>
            {errors.bio && <p className="mt-2 text-sm text-red-500">{errors.bio.message}</p>}
          </div>

          <div>
            <label htmlFor="socialLink" className="block text-sm font-medium text-gray-200">
              Social Link <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="mt-2">
              <input
                type="url"
                id="socialLink"
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                placeholder="https://instagram.com/yourhandle"
                {...register('socialLink')}
              />
            </div>
            {errors.socialLink && <p className="mt-2 text-sm text-red-500">{errors.socialLink.message}</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating Profile...' : 'Apply to Become a Creator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
