'use client';

import { useVideos } from '@/hooks/use-videos';
import { VideoCard } from '@/components/shared/video-card';
import { SkeletonGrid } from '@/components/shared/skeleton-card';

export function FeaturedVideos() {
  const { data: videos, isLoading } = useVideos();

  if (isLoading) return <SkeletonGrid count={4} />;
  if (!videos?.length) return null;

  const featured = videos.slice(0, 8);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {featured.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
