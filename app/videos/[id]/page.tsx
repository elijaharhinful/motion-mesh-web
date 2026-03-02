'use client';

import { useVideo } from '@/hooks/use-videos';
import { useAuthStore } from '@/stores/auth.store';
import { formatPrice, formatDuration } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCreatePaymentIntent } from '@/hooks/use-payments';
import { useToastStore } from '@/stores/toast.store';
import Link from 'next/link';
import { Clock, BarChart2, Tag, ArrowRight, User } from 'lucide-react';
import { SkeletonCard } from '@/components/shared/skeleton-card';

interface Props {
  params: Promise<{ id: string }>;
}

export default function VideoDetailPage({ params }: Props) {
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null);

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) return <LoadingSkeleton />;
  return <VideoDetail videoId={resolvedParams.id} />;
}

import React from 'react';

function VideoDetail({ videoId }: { videoId: string }) {
  const { data: video, isLoading, isError } = useVideo(videoId);
  const { accessToken } = useAuthStore();
  const { mutate: createIntent, isPending } = useCreatePaymentIntent();
  const { addToast } = useToastStore();
  const router = useRouter();

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !video) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-white/50">Video not found.</p>
      <Link href="/browse" className="text-violet-400 hover:text-violet-300 mt-4 inline-block">← Browse all</Link>
    </div>
  );

  const creator = video.creator?.user;

  const handlePurchase = () => {
    if (!accessToken) {
      router.push(`/login?redirect=/videos/${videoId}`);
      return;
    }
    createIntent(videoId, {
      onSuccess: (data) => {
        router.push(`/checkout/${data.purchaseId}?clientSecret=${data.clientSecret}`);
      },
      onError: (err: unknown) => {
        const e = err as { message?: string; statusCode?: number };
        if (e?.statusCode === 409) {
          addToast({ type: 'info', title: 'Already purchased', message: 'Go to My Library to generate your video.' });
          router.push('/account/purchases');
        } else {
          addToast({ type: 'error', title: 'Purchase failed', message: e?.message });
        }
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/browse" className="inline-flex items-center gap-1 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors">
        ← Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: Video Preview */}
        <div className="lg:col-span-3">
          <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
            {video.previewS3Key ? (
              <video
                src={`/api/preview/${video.previewS3Key}`}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div className="text-white/20 text-sm">Preview not available</div>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-white font-semibold mb-3">About this move</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              {video.description ?? 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Right: Purchase Card */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{video.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 capitalize">
                  {video.category}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/60 capitalize">
                  {video.difficulty}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10">
              {video.durationSeconds !== null && (
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock size={14} className="text-violet-400" />
                  {formatDuration(video.durationSeconds)}
                </div>
              )}
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <BarChart2 size={14} className="text-violet-400" />
                {video.difficulty}
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Tag size={14} className="text-violet-400" />
                {video.category}
              </div>
            </div>

            {/* Price & CTA */}
            <div>
              <div className="text-3xl font-black text-white mb-4">{formatPrice(video.priceCents)}</div>
              <button
                onClick={handlePurchase}
                disabled={isPending}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/25 hover:scale-[1.02]"
              >
                {isPending ? 'Processing…' : 'Purchase & Generate'}
                {!isPending && <ArrowRight size={16} />}
              </button>
              <p className="text-white/30 text-xs text-center mt-3">
                Secure payment via Stripe · Your photo is deleted after generation
              </p>
            </div>

            {/* Creator */}
            {creator && (
              <Link
                href={`/creators/${video.creatorId}`}
                className="flex items-center gap-3 pt-4 border-t border-white/10 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-violet-600/30 flex items-center justify-center border border-violet-500/20">
                  <User size={18} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{creator.firstName} {creator.lastName}</p>
                  <p className="text-white/40 text-xs">Creator profile →</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10 animate-pulse">
      <div className="lg:col-span-3">
        <div className="aspect-video rounded-2xl bg-white/10" />
      </div>
      <div className="lg:col-span-2 space-y-4">
        <div className="h-6 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
        <div className="h-12 bg-white/10 rounded" />
      </div>
    </div>
  );
}
