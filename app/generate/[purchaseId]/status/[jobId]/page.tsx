'use client';

import React from 'react';
import { useJobStatus } from '@/hooks/use-generation';
import { GenerationJobStatus } from '@/types/enums';
import { CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ purchaseId: string; jobId: string }>;
}

export default function GenerationStatusPage({ params }: Props) {
  const [ids, setIds] = React.useState<{ purchaseId: string; jobId: string } | null>(null);
  React.useEffect(() => { params.then(setIds); }, [params]);

  const { data: job, isLoading } = useJobStatus(ids?.jobId ?? '');

  if (isLoading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-violet-400 mx-auto mb-4" size={40} />
          <p className="text-white/50">Loading job status…</p>
        </div>
      </div>
    );
  }

  const isPending = job.status === GenerationJobStatus.PENDING || job.status === GenerationJobStatus.PROCESSING;
  const isCompleted = job.status === GenerationJobStatus.COMPLETED;
  const isFailed = job.status === GenerationJobStatus.FAILED;

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      {isPending && (
        <>
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Generating Your Video</h1>
          <p className="text-white/50 mb-6">Our AI is working its magic. This usually takes 2–5 minutes.</p>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full animate-pulse w-3/4" />
          </div>
          <p className="text-white/30 text-xs mt-3">Status: {job.status}</p>
        </>
      )}

      {isCompleted && (
        <>
          <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Your Video is Ready! 🎉</h1>
          <p className="text-white/50 mb-8">Your personalized dance video has been generated. Download it and share!</p>

          {job.resultVideoUrl && (
            <div className="mb-8">
              <video
                src={job.resultVideoUrl}
                controls
                className="w-full rounded-2xl border border-white/10"
              />
            </div>
          )}

          {job.resultVideoUrl && (
            <a
              href={job.resultVideoUrl}
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all"
            >
              <Download size={18} />
              Download MP4
            </a>
          )}
          <div className="mt-6">
            <Link href="/account/purchases" className="text-violet-400 hover:text-violet-300 text-sm">
              View all purchases →
            </Link>
          </div>
        </>
      )}

      {isFailed && (
        <>
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <XCircle size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Generation Failed</h1>
          {job.errorMessage && (
            <p className="text-red-300/80 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              {job.errorMessage}
            </p>
          )}
          <p className="text-white/50 mb-8">If you were charged, you will receive a refund within 3–5 business days.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/browse" className="px-5 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm transition-colors">
              Back to Browse
            </Link>
            <Link href={`/generate/${ids?.purchaseId}`} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
              Try Again
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
