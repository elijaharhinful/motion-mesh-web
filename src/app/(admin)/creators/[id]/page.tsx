"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, ExternalLink, UserRound } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import VideoCard from "@/components/videos/VideoCard";
import { useCreator } from "@/hooks/use-creators";
import { useVideos } from "@/hooks/use-videos";

/**
 * Public creator profile (M3): seller identity plus their published templates.
 * Videos come from the marketplace endpoint filtered by creator, so only
 * signed, published listings are shown.
 */
export default function CreatorProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const { data: creator, isLoading, isError } = useCreator(id);
  const { data: videos, isLoading: videosLoading } = useVideos({
    creatorId: id,
  });

  return (
    <div>
      <PageBreadcrumb pageTitle="Creator" />

      <Link
        href="/browse"
        className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} /> Back to browse
      </Link>

      {isLoading && (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
      )}

      {isError && (
        <p className="rounded-2xl border border-error-200 bg-error-50 p-6 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10">
          This creator profile is unavailable.
        </p>
      )}

      {!isLoading && !isError && creator && (
        <>
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              {creator.user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={creator.user.avatarUrl}
                  alt={creator.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={32} className="text-gray-300 dark:text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">
                  {creator.displayName}
                </h1>
                {creator.isVerified && (
                  <Badge variant="light" color="primary" size="sm">
                    <BadgeCheck size={13} /> Verified
                  </Badge>
                )}
              </div>
              {creator.bio && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {creator.bio}
                </p>
              )}
              {creator.socialLink && (
                <a
                  href={creator.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600"
                >
                  <ExternalLink size={14} /> Social
                </a>
              )}
            </div>
          </div>

          <h2 className="mb-4 mt-8 font-semibold text-gray-800 dark:text-white/90">
            Templates
          </h2>

          {videosLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          )}

          {!videosLoading && videos && videos.length === 0 && (
            <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
              This creator has no published templates yet.
            </p>
          )}

          {!videosLoading && videos && videos.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
