"use client";

import Link from "next/link";
import { Music4, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  useMyVideos,
  useDeleteVideo,
  usePublishVideo,
  useUnpublishVideo,
} from "@/hooks/use-videos";
import { useToastStore } from "@/stores/toast.store";
import { formatPrice } from "@/lib/utils";
import { VideoStatus } from "@/types/enums";
import { STATUS_BADGE } from "@/components/videos/video-meta";
import type { ApiError, SellerVideoView } from "@/types/api.types";

export default function SellerVideoList() {
  const { data: videos, isLoading, isError } = useMyVideos();
  const publish = usePublishVideo();
  const unpublish = useUnpublishVideo();
  const remove = useDeleteVideo();
  const { addToast } = useToastStore();

  const busy = publish.isPending || unpublish.isPending || remove.isPending;

  const onError = (err: unknown) =>
    addToast({
      type: "error",
      title: (err as ApiError)?.message ?? "Something went wrong.",
    });

  const handlePublish = async (v: SellerVideoView) => {
    try {
      await publish.mutateAsync(v.id);
      addToast({ type: "success", title: "Your video is now live." });
    } catch (err) {
      onError(err);
    }
  };

  const handleUnpublish = async (v: SellerVideoView) => {
    try {
      await unpublish.mutateAsync(v.id);
      addToast({ type: "success", title: "Video unpublished." });
    } catch (err) {
      onError(err);
    }
  };

  const handleDelete = async (v: SellerVideoView) => {
    if (!window.confirm(`Delete "${v.title}"? This cannot be undone.`)) return;
    try {
      await remove.mutateAsync(v.id);
      addToast({ type: "success", title: "Video deleted." });
    } catch (err) {
      onError(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your dance templates, upload assets, and publish to the
          marketplace.
        </p>
        <Link href="/dashboard/videos/new">
          <Button size="sm" startIcon={<Plus size={16} />}>
            Upload Video
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="h-48 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
      )}

      {isError && (
        <p className="rounded-2xl border border-error-200 bg-error-50 p-6 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10">
          We could not load your videos. Please try again.
        </p>
      )}

      {!isLoading && !isError && videos && videos.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="font-semibold text-gray-800 dark:text-white/90">
            No videos yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload your first dance template to start selling.
          </p>
          <Link href="/dashboard/videos/new">
            <Button size="sm" className="mt-4" startIcon={<Plus size={16} />}>
              Upload Video
            </Button>
          </Link>
        </div>
      )}

      {!isLoading && !isError && videos && videos.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-gray-800">
                <TableRow>
                  {["Template", "Status", "Price", "Assets", ""].map((h, i) => (
                    <TableCell
                      key={i}
                      isHeader
                      className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {videos.map((v) => {
                  const status = STATUS_BADGE[v.status];
                  const isPublished = v.status === VideoStatus.PUBLISHED;
                  return (
                    <TableRow key={v.id}>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            {v.thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={v.thumbnailUrl}
                                alt={v.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
                                <Music4 size={18} />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-white/90">
                            {v.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Badge variant="light" color={status.color} size="sm">
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {formatPrice(v.priceCents)}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <Badge
                            variant="light"
                            color={v.hasOriginal ? "success" : "light"}
                            size="sm"
                          >
                            Original
                          </Badge>
                          <Badge
                            variant="light"
                            color={v.hasPreview ? "success" : "light"}
                            size="sm"
                          >
                            Preview
                          </Badge>
                          <Badge
                            variant="light"
                            color={v.hasThumbnail ? "success" : "light"}
                            size="sm"
                          >
                            Thumb
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {isPublished ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busy}
                              onClick={() => handleUnpublish(v)}
                            >
                              Unpublish
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              disabled={busy || !v.hasOriginal}
                              onClick={() => handlePublish(v)}
                            >
                              Publish
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => handleDelete(v)}
                            startIcon={<Trash2 size={15} />}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
