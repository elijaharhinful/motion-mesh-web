"use client";

import Link from "next/link";
import { Music4 } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { formatPrice } from "@/lib/utils";
import type { PublicVideoView } from "@/types/api.types";
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from "./video-meta";

/** Marketplace catalogue card. Links to the video detail page. */
export default function VideoCard({ video }: { video: PublicVideoView }) {
  return (
    <Link
      href={`/browse/${video.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {video.thumbnailUrl ? (
          // Signed, time-limited URL on a dynamic storage host — plain img.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
            <Music4 size={36} />
          </div>
        )}
        <span className="absolute left-3 top-3">
          <Badge variant="solid" color="dark" size="sm">
            {CATEGORY_LABELS[video.category]}
          </Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 font-semibold text-gray-800 dark:text-white/90">
          {video.title}
        </h3>
        {video.creator && (
          <p className="line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
            {video.creator.displayName}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <Badge variant="light" color="light" size="sm">
            {DIFFICULTY_LABELS[video.difficulty]}
          </Badge>
          <span className="font-semibold text-gray-800 dark:text-white/90">
            {formatPrice(video.priceCents)}
          </span>
        </div>
      </div>
    </Link>
  );
}
