"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Clock, Music4 } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useVideo } from "@/hooks/use-videos";
import { formatDuration, formatPrice } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
} from "@/components/videos/video-meta";

/**
 * Buyer-facing template detail. Plays the watermarked, non-downloadable preview
 * via a signed, time-limited URL (the original is never exposed). Purchase wires
 * up in M4, so the CTA is present but disabled here.
 */
export default function VideoDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: video, isLoading, isError } = useVideo(id);

  return (
    <div>
      <PageBreadcrumb pageTitle="Template" />

      <Link
        href="/browse"
        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} /> Back to browse
      </Link>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="aspect-video animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800 lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        </div>
      )}

      {isError && (
        <p className="rounded-2xl border border-error-200 bg-error-50 p-6 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10">
          This template is unavailable. It may have been unpublished or removed.
        </p>
      )}

      {!isLoading && !isError && video && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black dark:border-gray-800">
              {video.previewUrl ? (
                <video
                  src={video.previewUrl}
                  controls
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  poster={video.thumbnailUrl ?? undefined}
                  className="aspect-video w-full bg-black"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600">
                  <Music4 size={40} />
                </div>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div>
              <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
                {video.title}
              </h1>
              {video.creator && (
                <Link
                  href={`/creators/${video.creator.id}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-500 dark:text-gray-400"
                >
                  {video.creator.displayName}
                  {video.creator.isVerified && (
                    <BadgeCheck size={15} className="text-brand-500" />
                  )}
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="light" color="primary" size="sm">
                {CATEGORY_LABELS[video.category]}
              </Badge>
              <Badge variant="light" color="light" size="sm">
                {DIFFICULTY_LABELS[video.difficulty]}
              </Badge>
              {video.durationSeconds != null && (
                <Badge variant="light" color="light" size="sm">
                  <Clock size={13} /> {formatDuration(video.durationSeconds)}
                </Badge>
              )}
            </div>

            {video.description && (
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {video.description}
              </p>
            )}

            <div className="mt-auto border-t border-gray-100 pt-5 dark:border-gray-800">
              <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {formatPrice(video.priceCents)}
              </p>
              <Button className="mt-3 w-full" disabled>
                Purchase (coming soon)
              </Button>
              <p className="mt-2 text-center text-xs text-gray-400">
                Buy this template, then upload a photo to generate your own video.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
