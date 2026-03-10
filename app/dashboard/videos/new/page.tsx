'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateVideo } from '@/hooks/use-videos';
import { ProtectedPage } from '@/components/layout/protected-page';
import { UserRole, VideoCategory, VideoDifficulty } from '@/types/enums';
import { useToastStore } from '@/stores/toast.store';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  description: z.string().optional(),
  category: z.enum(Object.values(VideoCategory) as [string, ...string[]]),
  difficulty: z.enum(Object.values(VideoDifficulty) as [string, ...string[]]),
  priceCents: z.coerce
    .number()
    .int()
    .min(99, 'Minimum price is $0.99')
    .max(9999, 'Maximum price is $99.99'),
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
    const d = data as FormData;
    createVideo(d, {
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


  const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all';
  const labelClass = 'block text-white/70 text-sm mb-1.5';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/videos" className="text-white/40 hover:text-white text-sm transition-colors">← My Videos</Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60 text-sm">New Move</span>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/20 flex items-center justify-center">
            <Upload size={20} className="text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Upload New Move</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className={labelClass}>Title</label>
            <input {...register('title')} placeholder="e.g. Afrobeats Flow — Advanced Combo" className={inputClass} />
            {errors.title && <p className="mt-1 text-red-400 text-xs">{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Description <span className="text-white/30">(optional)</span></label>
            <textarea {...register('description')} rows={3} placeholder="Describe the choreography, style, and what makes it unique…" className={`${inputClass} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select {...register('category')} className={inputClass}>
                {Object.values(VideoCategory).map((c) => (
                  <option key={c} value={c} className="bg-gray-900 capitalize">{c.replace('-', ' ')}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-red-400 text-xs">{errors.category.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Difficulty</label>
              <select {...register('difficulty')} className={inputClass}>
                {Object.values(VideoDifficulty).map((d) => (
                  <option key={d} value={d} className="bg-gray-900 capitalize">{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Price (in cents)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">¢</span>
              <input {...register('priceCents')} type="number" min={99} max={9999} className={`${inputClass} pl-8`} />
            </div>
            <p className="text-white/30 text-xs mt-1">Enter in cents: 499 = $4.99. Range: 99–9999.</p>
            {errors.priceCents && <p className="mt-1 text-red-400 text-xs">{errors.priceCents.message}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold text-sm transition-all"
            >
              {isPending ? 'Creating…' : 'Create & Continue to Upload Files'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
