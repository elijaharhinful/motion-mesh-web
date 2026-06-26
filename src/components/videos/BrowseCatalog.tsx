"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import VideoCard from "@/components/videos/VideoCard";
import { useVideos, type VideoFilters } from "@/hooks/use-videos";
import { VideoCategory, VideoDifficulty, VideoSort } from "@/types/enums";
import {
  CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "@/components/videos/video-meta";

const SORT_OPTIONS = [
  { value: VideoSort.NEWEST, label: "Newest" },
  { value: VideoSort.PRICE_ASC, label: "Price: low to high" },
  { value: VideoSort.PRICE_DESC, label: "Price: high to low" },
];

const ALL = "all";
const CATEGORY_FILTER_OPTIONS = [
  { value: ALL, label: "All styles" },
  ...CATEGORY_OPTIONS,
];
const DIFFICULTY_FILTER_OPTIONS = [
  { value: ALL, label: "All levels" },
  ...DIFFICULTY_OPTIONS,
];

/**
 * Buyer marketplace catalogue: search, filter by style/difficulty, sort, and a
 * responsive grid of cards that link into the video detail page (M3).
 */
export default function BrowseCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<VideoCategory | "">("");
  const [difficulty, setDifficulty] = useState<VideoDifficulty | "">("");
  const [sort, setSort] = useState<VideoSort>(VideoSort.NEWEST);

  const filters = useMemo<VideoFilters>(
    () => ({
      search: search.trim() || undefined,
      category: category || undefined,
      difficulty: difficulty || undefined,
      sort,
    }),
    [search, category, difficulty, sort],
  );

  const { data: videos, isLoading, isError } = useVideos(filters);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <Input
            placeholder="Search templates"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          options={CATEGORY_FILTER_OPTIONS}
          defaultValue={ALL}
          onChange={(v) =>
            setCategory(v === ALL ? "" : (v as VideoCategory))
          }
        />
        <Select
          options={DIFFICULTY_FILTER_OPTIONS}
          defaultValue={ALL}
          onChange={(v) =>
            setDifficulty(v === ALL ? "" : (v as VideoDifficulty))
          }
        />
        <Select
          placeholder="Sort by"
          options={SORT_OPTIONS}
          defaultValue={sort}
          onChange={(v) => setSort(v as VideoSort)}
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="rounded-2xl border border-error-200 bg-error-50 p-6 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10">
          We could not load the marketplace right now. Please try again.
        </p>
      )}

      {!isLoading && !isError && videos && videos.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="font-semibold text-gray-800 dark:text-white/90">
            No templates match your filters
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try a different style, level, or search term.
          </p>
        </div>
      )}

      {!isLoading && !isError && videos && videos.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
