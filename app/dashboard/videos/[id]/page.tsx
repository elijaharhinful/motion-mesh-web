'use client';

import React from 'react';
import { useVideo } from '@/hooks/use-videos';
import { ProtectedPage } from '@/components/layout/protected-page';
import { formatPrice } from '@/lib/utils';
import { VideoStatus, VideoCategory, VideoDifficulty } from '@/types/enums';
import { StatusBadge } from '@/components/shared/status-badge';
import { Edit2, ArrowLeft, Video, Tag, BarChart2, Info } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default function VideoDetailPage({ params }: Props) {
  return (
    <ProtectedPage requireCreator>
      <VideoDetail params={params} />
    </ProtectedPage>
  );
}

function VideoDetail({ params }: Props) {
  const [videoId, setVideoId] = React.useState<string | null>(null);
  React.useEffect(() => { params.then((p) => setVideoId(p.id)); }, [params]);

  const { data: video, isLoading } = useVideo(videoId ?? '');

  if (isLoading || !videoId) {
    return (
      <div className="p-6 max-w-3xl space-y-4 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Video not found.</p>
        <Link href="/dashboard/videos" className="text-violet-600 dark:text-violet-400 text-sm mt-2 inline-block hover:underline">
          ← Back to My Videos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard/videos" className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={16} />
          My Videos
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-gray-900 dark:text-white font-medium truncate">{video.title}</span>
      </div>

      {/* Header card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-violet-100 dark:bg-violet-600/20 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center shrink-0">
            <Video size={28} className="text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{video.title}</h1>
                {video.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{video.description}</p>
                )}
              </div>
              <Link
                href={`/dashboard/videos/${video.id}/edit`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0"
              >
                <Edit2 size={14} />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* Info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Details</h2>
          </div>
          <dl className="space-y-3">
            {[
              { label: 'Status', value: <StatusBadge status={video.status as VideoStatus} /> },
              { label: 'Category', value: <span className="text-sm text-gray-900 dark:text-white capitalize">{video.category.replace('-', ' ')}</span> },
              { label: 'Difficulty', value: <span className="text-sm text-gray-900 dark:text-white capitalize">{video.difficulty}</span> },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Pricing + stats */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pricing & Stats</h2>
          </div>
          <dl className="space-y-3">
            {[
              { label: 'Price', value: <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(video.priceCents)}</span> },
              { label: 'Your cut (70%)', value: <span className="text-sm font-semibold text-green-600 dark:text-green-400">{formatPrice(Math.floor(video.priceCents * 0.7))}</span> },
              { label: 'Platform fee', value: <span className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(Math.ceil(video.priceCents * 0.3))}</span> },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Tags / marketplace label */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Marketplace Listing</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          This video is {video.status === VideoStatus.PUBLISHED ? 'live on the marketplace' : 'not yet published'}.
        </p>
        {video.status === VideoStatus.PUBLISHED ? (
          <Link
            href={`/videos/${video.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            target="_blank"
          >
            View Public Listing →
          </Link>
        ) : (
          <Link
            href={`/dashboard/videos/${video.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Edit2 size={14} />
            Finish & Publish
          </Link>
        )}
      </div>
    </div>
  );
}
