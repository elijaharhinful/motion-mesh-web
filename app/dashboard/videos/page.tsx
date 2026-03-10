'use client';

import { useVideos, useDeleteVideo, usePublishVideo } from '@/hooks/use-videos';
import { useMyCreatorProfile } from '@/hooks/use-creators';
import { ProtectedPage } from '@/components/layout/protected-page';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { formatPrice } from '@/lib/utils';
import { UserRole, VideoStatus } from '@/types/enums';
import { Plus, Edit2, Trash2, Eye, EyeOff, Music } from 'lucide-react';
import Link from 'next/link';
import { useToastStore } from '@/stores/toast.store';
import { useAuthStore } from '@/stores/auth.store';

export default function DashboardVideosPage() {
  return (
    <ProtectedPage requireCreator>
      <VideoManagement />
    </ProtectedPage>
  );
}

function VideoManagement() {
  const { user } = useAuthStore();
  const { data: creator } = useMyCreatorProfile();
  const { data: allVideos, isLoading } = useVideos();
  const { mutate: deleteVideo } = useDeleteVideo();
  const { mutate: publishVideo } = usePublishVideo();
  const { addToast } = useToastStore();

  // Show all videos for this creator (including drafts stored in their own query)
  // Since GET /videos only returns published, we show what we know
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
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">My Videos</h1>
        <Link
          href="/dashboard/videos/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Upload New Move
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
        </div>
      ) : myVideos.length === 0 ? (
        <EmptyState
          icon={Music}
          title="No videos yet"
          description="Upload your first dance move and start earning."
          ctaLabel="Upload Your First Move"
          ctaHref="/dashboard/videos/new"
        />
      ) : (
        <div className="space-y-3">
          {myVideos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-14 h-14 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0 border border-violet-500/20">
                <Music size={20} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{video.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={video.status as VideoStatus} />
                  <span className="text-white/40 text-xs capitalize">{video.category} · {video.difficulty}</span>
                </div>
              </div>
              <span className="text-white/60 text-sm font-medium shrink-0">{formatPrice(video.priceCents)}</span>
              <div className="flex items-center gap-2 shrink-0">
                {video.status === VideoStatus.DRAFT && (
                  <button
                    onClick={() => handlePublish(video.id)}
                    title="Publish"
                    className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                )}
                <Link
                  href={`/dashboard/videos/${video.id}/edit`}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
                >
                  <Edit2 size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(video.id, video.title)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
