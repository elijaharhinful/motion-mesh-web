import Link from 'next/link';
import Image from 'next/image';
import { DanceVideo } from '@/types/api.types';
import { formatPrice, formatDuration } from '@/lib/utils';
import { Clock, Music } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { VideoStatus } from '@/types/enums';

interface VideoCardProps {
  video: DanceVideo;
  showStatus?: boolean;
}

export function VideoCard({ video, showStatus = false }: VideoCardProps) {
  const creator = video.creator?.user;

  return (
    <Link
      href={`/videos/${video.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-white/5 overflow-hidden">
        {video.thumbnailS3Key ? (
          <Image
            src={`/api/thumb/${video.thumbnailS3Key}`}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 to-purple-900/50 flex items-center justify-center">
            <Music size={40} className="text-violet-400/50" />
          </div>
        )}

        {/* Duration badge */}
        {video.durationSeconds !== null && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs text-white/80">
            <Clock size={10} />
            {formatDuration(video.durationSeconds)}
          </div>
        )}

        {/* Status badge (creator view) */}
        {showStatus && (
          <div className="absolute top-2 left-2">
            <StatusBadge status={video.status as VideoStatus} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors flex-1">
            {video.title}
          </h3>
          <span className="text-violet-400 font-bold text-sm whitespace-nowrap">
            {formatPrice(video.priceCents)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          {creator && (
            <span className="text-white/50 text-xs truncate">
              {creator.firstName} {creator.lastName}
            </span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 capitalize">
            {video.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
