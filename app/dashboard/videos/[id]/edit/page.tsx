'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVideo, useUpdateVideo, usePresignedUrl } from '@/hooks/use-videos';
import { ProtectedPage } from '@/components/layout/protected-page';
import { UserRole, VideoCategory, VideoDifficulty } from '@/types/enums';
import { useToastStore } from '@/stores/toast.store';
import { useRouter } from 'next/navigation';
import { Save, UploadCloud, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useState, useEffect } from 'react';

const schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.enum(Object.values(VideoCategory) as [string, ...string[]]),
  difficulty: z.enum(Object.values(VideoDifficulty) as [string, ...string[]]),
  priceCents: z.coerce.number().int().min(99).max(9999),
});

type FormData = {
  title: string;
  description?: string;
  category: VideoCategory;
  difficulty: VideoDifficulty;
  priceCents: number;
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditVideoPage({ params }: Props) {
  return (
    <ProtectedPage requiredRole={UserRole.CREATOR}>
      <EditVideoForm params={params} />
    </ProtectedPage>
  );
}

function EditVideoForm({ params }: Props) {
  const [videoId, setVideoId] = React.useState<string | null>(null);
  React.useEffect(() => { params.then((p) => setVideoId(p.id)); }, [params]);

  const { data: video, isLoading } = useVideo(videoId ?? '');
  const { mutate: updateVideo, isPending } = useUpdateVideo(videoId ?? '');
  const { mutate: getPresignedUrl } = usePresignedUrl(videoId ?? '');
  const { addToast } = useToastStore();
  const router = useRouter();
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  });

  useEffect(() => {
    if (video) {
      reset({
        title: video.title,
        description: video.description ?? '',
        category: video.category,
        difficulty: video.difficulty,
        priceCents: video.priceCents,
      });
    }
  }, [video, reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    updateVideo(data as FormData, {
      onSuccess: () => addToast({ type: 'success', title: 'Video updated!' }),
      onError: () => addToast({ type: 'error', title: 'Update failed' }),
    });
  };

  const handleFileUpload = async (
    file: File,
    fileType: 'original' | 'preview' | 'thumbnail',
  ) => {
    setUploadingType(fileType);
    getPresignedUrl(
      { fileType, contentType: file.type },
      {
        onSuccess: async (data) => {
          try {
            await apiClient.uploadToS3(data.url, file);
            addToast({ type: 'success', title: `${fileType} uploaded!` });
          } catch {
            addToast({ type: 'error', title: 'Upload failed' });
          } finally {
            setUploadingType(null);
          }
        },
        onError: () => {
          addToast({ type: 'error', title: 'Could not get upload URL' });
          setUploadingType(null);
        },
      },
    );
  };

  if (isLoading || !videoId) {
    return <div className="max-w-2xl mx-auto px-4 py-20 animate-pulse"><div className="h-60 bg-white/10 rounded-2xl" /></div>;
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-all';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/videos" className="text-white/40 hover:text-white text-sm transition-colors">← My Videos</Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60 text-sm truncate">{video?.title ?? 'Edit'}</span>
      </div>

      <div className="space-y-6">
        {/* Metadata Edit */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-6">Edit Metadata</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Title</label>
              <input {...register('title')} className={inputClass} />
              {errors.title && <p className="mt-1 text-red-400 text-xs">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Description</label>
              <textarea {...register('description')} rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Category</label>
                <select {...register('category')} className={inputClass}>
                  {Object.values(VideoCategory).map((c) => (
                    <option key={c} value={c} className="bg-gray-900 capitalize">{c.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Difficulty</label>
                <select {...register('difficulty')} className={inputClass}>
                  {Object.values(VideoDifficulty).map((d) => (
                    <option key={d} value={d} className="bg-gray-900 capitalize">{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Price (cents)</label>
              <input {...register('priceCents')} type="number" min={99} max={9999} className={inputClass} />
              {errors.priceCents && <p className="mt-1 text-red-400 text-xs">{errors.priceCents.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-medium text-sm transition-all"
            >
              <Save size={16} />
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* File Uploads */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-white font-semibold mb-5">Video Files</h2>
          <div className="space-y-3">
            {(['original', 'preview', 'thumbnail'] as const).map((type) => (
              <div key={type} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/10">
                <div>
                  <p className="text-white text-sm font-medium capitalize">{type} {type === 'thumbnail' ? '(image)' : '(video)'}</p>
                  <p className="text-white/40 text-xs">
                    {type === 'original' ? 'Full 4K choreography video' : type === 'preview' ? 'Short watermarked preview clip' : 'Cover image for the marketplace'}
                  </p>
                </div>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-medium cursor-pointer border border-violet-500/20 transition-colors">
                  {uploadingType === type ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                  {uploadingType === type ? 'Uploading…' : 'Upload'}
                  <input
                    type="file"
                    className="hidden"
                    accept={type === 'thumbnail' ? 'image/*' : 'video/*'}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f, type);
                    }}
                    disabled={!!uploadingType}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
