'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useStartGeneration } from '@/hooks/use-generation';
import { useToastStore } from '@/stores/toast.store';
import { PresignedUrlData, ApiResponse } from '@/types/api.types';
import { UploadCloud, ImageIcon, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  params: Promise<{ purchaseId: string }>;
}

export default function GeneratePage({ params }: Props) {
  const [purchaseId, setPurchaseId] = React.useState<string | null>(null);
  React.useEffect(() => { params.then((p) => setPurchaseId(p.purchaseId)); }, [params]);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { mutate: startGeneration, isPending } = useStartGeneration();
  const { addToast } = useToastStore();
  const router = useRouter();

  const handleFileSelect = (f: File) => {
    if (!f.type.startsWith('image/')) {
      addToast({ type: 'error', title: 'Invalid file', message: 'Please upload an image (JPEG, PNG, WebP).' });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  }, []);

  const handleGenerate = async () => {
    if (!file || !purchaseId) return;
    setIsUploading(true);

    try {
      // Get presigned URL for the face photo
      const { data } = await apiClient.post<ApiResponse<PresignedUrlData>>('/ai/photo-upload-url', {
        contentType: file.type,
      });

      // Upload directly to S3
      await apiClient.uploadToS3(data.url, file);

      setIsUploading(false);

      // Start AI generation
      startGeneration(
        { purchaseId, facePhotoS3Key: data.key },
        {
          onSuccess: (job) => {
            addToast({ type: 'success', title: 'Generation started!', message: 'We\'ll notify you when it\'s ready.' });
            router.push(`/generate/${purchaseId}/status/${job.id}`);
          },
          onError: (err: unknown) => {
            const e = err as { message?: string };
            addToast({ type: 'error', title: 'Generation failed', message: e?.message });
          },
        },
      );
    } catch {
      setIsUploading(false);
      addToast({ type: 'error', title: 'Upload failed', message: 'Could not upload your photo. Please try again.' });
    }
  };

  const isProcessing = isUploading || isPending;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Upload Your Photo</h1>
        <p className="text-white/50 leading-relaxed">
          We&apos;ll generate a video of you performing the dance. Upload a clear, front-facing photo for best results.
        </p>
      </div>

      {/* Photo Guidelines */}
      <div className="mb-8 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 space-y-2">
        <p className="text-violet-300 text-sm font-semibold">📸 Photo Guidelines</p>
        <ul className="text-white/50 text-xs space-y-1">
          <li>✓ Clear, well-lit front-facing photo</li>
          <li>✓ Your full face must be visible</li>
          <li>✓ No sunglasses or heavy obstructions</li>
          <li>✓ JPEG, PNG, or WebP format</li>
          <li>✗ No photos of minors</li>
        </ul>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => document.getElementById('photo-input')?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center ${
          isDragging
            ? 'border-violet-500 bg-violet-500/10'
            : preview
            ? 'border-violet-500/40 bg-black/20'
            : 'border-white/20 hover:border-violet-500/50 hover:bg-white/3'
        }`}
      >
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
        />

        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-xl mx-auto border-2 border-violet-500/30" />
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
              <CheckCircle size={16} />
              Photo selected — {file?.name}
            </div>
            <p className="text-white/30 text-xs">Click to change</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
              <UploadCloud size={28} className="text-violet-400" />
            </div>
            <div>
              <p className="text-white font-medium">Drop your photo here</p>
              <p className="text-white/40 text-sm mt-1">or click to browse</p>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!file || isProcessing || !purchaseId}
        className="w-full mt-6 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-xl shadow-violet-500/20 text-base"
      >
        {isProcessing ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            {isUploading ? 'Uploading photo…' : 'Starting AI generation…'}
          </>
        ) : (
          <>
            <ImageIcon size={20} />
            Generate My Dance Video
          </>
        )}
      </button>

      <p className="text-center text-white/30 text-xs mt-4">
        Your photo is permanently deleted after the video is generated.
      </p>
    </div>
  );
}
