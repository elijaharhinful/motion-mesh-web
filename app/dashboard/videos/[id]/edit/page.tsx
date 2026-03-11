'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVideo, useUpdateVideo, usePresignedUrl } from '@/hooks/use-videos';
import { ProtectedPage } from '@/components/layout/protected-page';
import { VideoCategory, VideoDifficulty } from '@/types/enums';
import { useToastStore } from '@/stores/toast.store';
import { Save, UploadCloud, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

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
    <ProtectedPage requireCreator>
      <EditVideoForm params={params} />
    </ProtectedPage>
  );
}

const inputCls = [
  'w-full px-4 py-2.5 rounded-xl text-sm transition-colors',
  'bg-white dark:bg-gray-900',
  'border border-gray-300 dark:border-gray-700',
  'text-gray-900 dark:text-white',
  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
  'focus:outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-500/10',
].join(' ');

const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

function EditVideoForm({ params }: Props) {
  const [videoId, setVideoId] = React.useState<string | null>(null);
  React.useEffect(() => { params.then((p) => setVideoId(p.id)); }, [params]);

  const { data: video, isLoading } = useVideo(videoId ?? '');
  const { mutate: updateVideo, isPending } = useUpdateVideo(videoId ?? '');
  const { mutate: getPresignedUrl } = usePresignedUrl(videoId ?? '');
  const { addToast } = useToastStore();
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});

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

  const handleFileUpload = async (file: File, fileType: 'original' | 'preview' | 'thumbnail') => {
    setUploadingType(fileType);
    getPresignedUrl(
      { fileType, contentType: file.type },
      {
        onSuccess: async (data) => {
          try {
            await apiClient.uploadToS3(data.url, file);
            setUploadedFiles((prev) => ({ ...prev, [fileType]: true }));
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
    return (
      <div className="p-6 max-w-2xl space-y-4 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    );
  }

  const fileTypes: { type: 'original' | 'preview' | 'thumbnail'; label: string; desc: string; accept: string }[] = [
    { type: 'original', label: 'Original Video', desc: 'Full 4K choreography video (.mp4)', accept: 'video/*' },
    { type: 'preview', label: 'Preview Clip', desc: 'Short watermarked preview clip (.mp4)', accept: 'video/*' },
    { type: 'thumbnail', label: 'Thumbnail', desc: 'Cover image for the marketplace (.jpg, .png)', accept: 'image/*' },
  ];

  return (
    <div className="p-5 sm:p-6 max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard/videos" className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={16} />
          My Videos
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-900 dark:text-white font-medium truncate">{video?.title ?? 'Edit'}</span>
      </div>

      <div className="space-y-5">
        {/* Metadata form */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-6">Edit Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={labelCls}>Title</label>
              <input {...register('title')} className={inputCls} />
              {errors.title && <p className="mt-1 text-red-500 dark:text-red-400 text-xs">{errors.title.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea {...register('description')} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Category</label>
                <select {...register('category')} className={inputCls}>
                  {Object.values(VideoCategory).map((c) => (
                    <option key={c} value={c} className="bg-white dark:bg-gray-900 capitalize">{c.replace('-', ' ')}</option>
                  ))}
                </select>
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
            <div>
              <label className={labelCls}>Price (cents)</label>
              <input {...register('priceCents')} type="number" min={99} max={9999} className={inputCls} />
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">499 = $4.99</p>
              {errors.priceCents && <p className="mt-1 text-red-500 dark:text-red-400 text-xs">{errors.priceCents.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-medium text-sm transition-colors"
            >
              <Save size={15} />
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* File uploads */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Video Files</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Upload or replace your video assets.</p>
          <div className="space-y-3">
            {fileTypes.map(({ type, label, desc, accept }) => (
              <div key={type} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    {uploadedFiles[type] && (
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
                </div>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50 hover:bg-violet-100 dark:bg-violet-500/10 dark:hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-medium cursor-pointer border border-violet-200 dark:border-violet-500/20 transition-colors shrink-0 ml-3">
                  {uploadingType === type ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
                  {uploadingType === type ? 'Uploading…' : 'Upload'}
                  <input
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, type); }}
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
