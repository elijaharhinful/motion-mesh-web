'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateVideo } from '@/hooks/use-videos';
import { ProtectedPage } from '@/components/layout/protected-page';
import { VideoCategory, VideoDifficulty } from '@/types/enums';
import { useToastStore } from '@/stores/toast.store';
import { useRouter } from 'next/navigation';
import { Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  description: z.string().optional(),
  category: z.enum(Object.values(VideoCategory) as [string, ...string[]]),
  difficulty: z.enum(Object.values(VideoDifficulty) as [string, ...string[]]),
  priceCents: z.coerce.number().int().min(99, 'Minimum price is $0.99').max(9999, 'Maximum price is $99.99'),
});

type FormData = {
  title: string;
  description?: string;
  category: VideoCategory;
  difficulty: VideoDifficulty;
  priceCents: number;
};

export default function NewVideoPage() {
  return (
    <ProtectedPage requireCreator>
      <NewVideoForm />
    </ProtectedPage>
  );
}

// Shared input/label classes (light+dark compatible)
const inputCls = [
  'w-full px-4 py-2.5 rounded-xl text-sm transition-colors',
  'bg-white dark:bg-gray-900',
  'border border-gray-300 dark:border-gray-700',
  'text-gray-900 dark:text-white',
  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
  'focus:outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10',
].join(' ');

const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

function NewVideoForm() {
  const { mutate: createVideo, isPending } = useCreateVideo();
  const { addToast } = useToastStore();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { category: VideoCategory.HIP_HOP, difficulty: VideoDifficulty.BEGINNER, priceCents: 499 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    createVideo(data as FormData, {
      onSuccess: (video) => {
        addToast({ type: 'success', title: 'Video created!', message: 'Now upload your video files.' });
        router.push(`/dashboard/videos/${video.id}/edit`);
      },
      onError: (err: unknown) => {
        const e = err as { message?: string };
        addToast({ type: 'error', title: 'Failed to create video', message: e?.message });
      },
    });
  };

  return (
    <div className="p-5 sm:p-6 max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard/videos" className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={16} />
          My Videos
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-900 dark:text-white font-medium">New Move</span>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
        {/* Title row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-600/30 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center">
            <Upload size={20} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Upload New Move</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Fill in the details, then upload your files.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className={labelCls}>Title</label>
            <input {...register('title')} placeholder="e.g. Afrobeats Flow — Advanced Combo" className={inputCls} />
            {errors.title && <p className="mt-1 text-red-500 dark:text-red-400 text-xs">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea {...register('description')} rows={3} placeholder="Describe the choreography, style, and what makes it unique…" className={`${inputCls} resize-none`} />
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select {...register('category')} className={inputCls}>
                {Object.values(VideoCategory).map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-gray-900 capitalize">{c.replace('-', ' ')}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-red-500 text-xs">{errors.category.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Difficulty</label>
              <select {...register('difficulty')} className={inputCls}>
                {Object.values(VideoDifficulty).map((d) => (
                  <option key={d} value={d} className="bg-white dark:bg-gray-900 capitalize">{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className={labelCls}>Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¢</span>
              <input {...register('priceCents')} type="number" min={99} max={9999} className={`${inputCls} pl-8`} />
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Enter in cents: 499 = $4.99. Range: 99–9999.</p>
            {errors.priceCents && <p className="mt-1 text-red-500 dark:text-red-400 text-xs">{errors.priceCents.message}</p>}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              {isPending ? 'Creating…' : 'Create & Continue to Upload Files →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
