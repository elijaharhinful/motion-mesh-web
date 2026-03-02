'use client';

import { useState, useCallback } from 'react';
import { useVideos } from '@/hooks/use-videos';
import { VideoCard } from '@/components/shared/video-card';
import { SkeletonGrid } from '@/components/shared/skeleton-card';
import { EmptyState } from '@/components/shared/empty-state';
import { VideoCategory, VideoDifficulty } from '@/types/enums';
import { Search, SlidersHorizontal, Music } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export default function BrowsePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<VideoCategory | ''>('');
  const [difficulty, setDifficulty] = useState<VideoDifficulty | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const { data: videos, isLoading, isError } = useVideos({
    category: category || undefined,
    difficulty: difficulty || undefined,
  });

  const filtered = useCallback(() => {
    if (!videos) return [];
    if (!debouncedSearch.trim()) return videos;
    const q = debouncedSearch.toLowerCase();
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q),
    );
  }, [videos, debouncedSearch])();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Browse Moves</h1>
        <p className="text-white/50">Discover choreography from professional dancers worldwide.</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search moves, styles, artists…"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              showFilters
                ? 'border-violet-500/50 bg-violet-500/10 text-violet-300'
                : 'border-white/15 bg-white/5 text-white/70 hover:text-white hover:border-white/30'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 p-4 bg-white/3 border border-white/10 rounded-xl">
            <div>
              <label className="block text-white/50 text-xs mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoCategory | '')}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                <option value="" className="bg-gray-900">All Categories</option>
                {Object.values(VideoCategory).map((c) => (
                  <option key={c} value={c} className="bg-gray-900 capitalize">{c.replace('-', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-xs mb-1.5">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as VideoDifficulty | '')}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                <option value="" className="bg-gray-900">All Levels</option>
                {Object.values(VideoDifficulty).map((d) => (
                  <option key={d} value={d} className="bg-gray-900 capitalize">{d}</option>
                ))}
              </select>
            </div>
            {(category || difficulty) && (
              <div className="flex items-end">
                <button
                  onClick={() => { setCategory(''); setDifficulty(''); }}
                  className="px-3 py-2 text-xs text-violet-400 hover:text-violet-300"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <SkeletonGrid count={12} />
      ) : isError ? (
        <EmptyState icon={Music} title="Failed to load videos" description="Please try again shortly." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No moves found"
          description="Try a different search term or adjust your filters."
          ctaLabel="Clear search"
          onCtaClick={() => { setSearch(''); setCategory(''); setDifficulty(''); }}
        />
      ) : (
        <>
          <p className="text-white/40 text-sm mb-6">{filtered.length} move{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
