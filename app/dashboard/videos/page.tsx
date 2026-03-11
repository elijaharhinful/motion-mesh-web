'use client';

import { useVideos, useDeleteVideo, usePublishVideo } from '@/hooks/use-videos';
import { useMyCreatorProfile } from '@/hooks/use-creators';
import { ProtectedPage } from '@/components/layout/protected-page';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatPrice } from '@/lib/utils';
import { VideoStatus } from '@/types/enums';
import { Plus, Edit2, Trash2, Eye, Video } from 'lucide-react';
import Link from 'next/link';
import { useToastStore } from '@/stores/toast.store';

export default function DashboardVideosPage() {
  return (
    <ProtectedPage requireCreator>
      <VideoManagement />
    </ProtectedPage>
  );
}

function VideoManagement() {
  const { data: creator } = useMyCreatorProfile();
  const { data: allVideos, isLoading } = useVideos();
  const { mutate: deleteVideo } = useDeleteVideo();
  const { mutate: publishVideo } = usePublishVideo();
  const { addToast } = useToastStore();

  const myVideos = allVideos?.filter((v) => v.creatorId === creator?.id) ?? [];

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteVideo(id, {
      onSuccess: () => addToast({ type: 'success', title: 'Video deleted' }),
      onError: () => addToast({ type: 'error', title: 'Delete failed' }),
    });
  };

  const handlePublish = (id: string) => {
    publishVideo(id, {
      onSuccess: () => addToast({ type: 'success', title: 'Video published!' }),
      onError: () => addToast({ type: 'error', title: 'Publish failed' }),
    });
  };

  return (
    <div className="p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Videos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage and publish your dance move library.
          </p>
        </div>
        <Link
          href="/dashboard/videos/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Upload New Move
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
      ) : myVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30 flex items-center justify-center mb-4">
            <Video size={28} className="text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No videos yet</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
            Upload your first dance move and start earning on the marketplace.
          </p>
          <Link
            href="/dashboard/videos/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Upload Your First Move
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Video</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {myVideos.map((video) => (
              <div
                key={video.id}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Video info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-600/20 flex items-center justify-center shrink-0 border border-violet-200 dark:border-violet-500/20">
                    <Video size={16} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{video.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{video.category} · {video.difficulty}</p>
                  </div>
                </div>

                {/* Status */}
                <StatusBadge status={video.status as VideoStatus} />

                {/* Price */}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatPrice(video.priceCents)}</span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  {video.status === VideoStatus.DRAFT && (
                    <button
                      onClick={() => handlePublish(video.id)}
                      title="Publish"
                      className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  )}
                  <Link
                    href={`/dashboard/videos/${video.id}/edit`}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 transition-colors"
                  >
                    <Edit2 size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(video.id, video.title)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
