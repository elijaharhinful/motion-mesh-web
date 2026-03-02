'use client';

import React from 'react';
import { useCreator } from '@/hooks/use-creators';
import { useVideos } from '@/hooks/use-videos';
import { VideoCard } from '@/components/shared/video-card';
import { SkeletonGrid } from '@/components/shared/skeleton-card';
import { EmptyState } from '@/components/shared/empty-state';
import { ExternalLink, User, Music } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default function CreatorProfilePage({ params }: Props) {
  const [id, setId] = React.useState<string | null>(null);
  React.useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  const { data: creator, isLoading } = useCreator(id ?? '');
  const { data: allVideos } = useVideos();

  const creatorVideos = allVideos?.filter((v) => v.creatorId === id) ?? [];
  const creatorUser = creator?.user;

  if (isLoading || !id) {
    return <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse"><div className="h-32 bg-white/10 rounded-2xl mb-8" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Creator Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 p-8 rounded-2xl bg-white/3 border border-white/10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/30 to-purple-600/30 border border-violet-500/20 flex items-center justify-center shrink-0">
          <User size={36} className="text-violet-400" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">
            {creatorUser?.firstName} {creatorUser?.lastName}
          </h1>
          {creator?.bio && (
            <p className="text-white/60 text-sm mt-2 max-w-xl leading-relaxed">{creator.bio}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {creator?.isVerified && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                ✓ Verified Creator
              </span>
            )}
            {creator?.socialLink && (
              <a
                href={creator.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs transition-colors"
              >
                <ExternalLink size={12} />
                Social
              </a>
            )}
            <span className="text-white/40 text-sm">{creatorVideos.length} move{creatorVideos.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Creator's Videos */}
      <h2 className="text-xl font-semibold text-white mb-6">Moves by this creator</h2>
      {creatorVideos.length === 0 ? (
        <EmptyState
          icon={Music}
          title="No published moves yet"
          description="This creator hasn't published any moves yet."
          ctaLabel="Browse all moves"
          ctaHref="/browse"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creatorVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
