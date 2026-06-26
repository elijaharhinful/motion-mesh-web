"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";
import { useCreateVideo, usePublishVideo } from "@/hooks/use-videos";
import { apiClient } from "@/lib/api-client";
import { useToastStore } from "@/stores/toast.store";
import { VideoCategory, VideoDifficulty } from "@/types/enums";
import {
  CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "@/components/videos/video-meta";
import type {
  ApiError,
  ApiResponse,
  PresignedUrlData,
} from "@/types/api.types";

const schema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(200),
  description: z.string().trim().max(2000).optional(),
  difficulty: z.nativeEnum(VideoDifficulty),
  category: z.nativeEnum(VideoCategory),
  priceDollars: z
    .number()
    .min(0.99, "Minimum price is $0.99.")
    .max(99.99, "Maximum price is $99.99."),
});

type FormValues = z.infer<typeof schema>;
type AssetType = "original" | "preview" | "thumbnail";

/**
 * Seller upload flow (M3): create the listing, push each asset straight to
 * object storage via a presigned PUT (files never pass through the API), then
 * optionally publish. Publishing requires the original file.
 */
export default function UploadVideoForm() {
  const router = useRouter();
  const createVideo = useCreateVideo();
  const publishVideo = usePublishVideo();
  const { addToast } = useToastStore();

  const [original, setOriginal] = useState<File | null>(null);
  const [preview, setPreview] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [publishNow, setPublishNow] = useState(false);
  const [step, setStep] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: VideoDifficulty.BEGINNER,
      category: VideoCategory.HIP_HOP,
      priceDollars: 4.99,
    },
  });

  const uploadAsset = async (videoId: string, type: AssetType, file: File) => {
    const res = await apiClient.post<ApiResponse<PresignedUrlData>>(
      `/videos/${videoId}/presigned-url`,
      { fileType: type, contentType: file.type },
    );
    await apiClient.uploadToS3(res.data.url, file);
  };

  const onSubmit = async (values: FormValues) => {
    if (!original) {
      addToast({ type: "error", title: "Please choose the original video file." });
      return;
    }
    try {
      setStep("Creating listing…");
      const created = await createVideo.mutateAsync({
        title: values.title,
        description: values.description || undefined,
        difficulty: values.difficulty,
        category: values.category,
        priceCents: Math.round(values.priceDollars * 100),
      });

      setStep("Uploading original…");
      await uploadAsset(created.id, "original", original);

      if (thumbnail) {
        setStep("Uploading thumbnail…");
        await uploadAsset(created.id, "thumbnail", thumbnail);
      }
      if (preview) {
        setStep("Uploading preview…");
        await uploadAsset(created.id, "preview", preview);
      }

      if (publishNow) {
        setStep("Publishing…");
        await publishVideo.mutateAsync(created.id);
      }

      addToast({
        type: "success",
        title: publishNow
          ? "Your template is live on the marketplace."
          : "Draft saved. Publish it when you're ready.",
      });
      router.push("/dashboard/videos");
    } catch (err) {
      addToast({
        type: "error",
        title: (err as ApiError)?.message ?? "Upload failed. Please try again.",
      });
    } finally {
      setStep(null);
    }
  };

  const busy = step !== null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-8 xl:py-8"
    >
      <div className="mb-6">
        <h3 className="mb-1 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
          Upload a dance template
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add the details and your assets. Files upload directly to secure
          storage and never pass through our servers.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label>
            Title <span className="text-error-500">*</span>
          </Label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                placeholder="e.g. Afrobeats Groove Vol. 1"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.title}
                hint={errors.title?.message}
              />
            )}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextArea
                placeholder="Describe the routine, energy, and who it's for."
                rows={4}
                value={field.value}
                onChange={field.onChange}
                error={!!errors.description}
                hint={errors.description?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label>Style</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  options={CATEGORY_OPTIONS}
                  defaultValue={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div>
            <Label>Difficulty</Label>
            <Controller
              control={control}
              name="difficulty"
              render={({ field }) => (
                <Select
                  options={DIFFICULTY_OPTIONS}
                  defaultValue={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div>
            <Label>
              Price (USD) <span className="text-error-500">*</span>
            </Label>
            <Controller
              control={control}
              name="priceDollars"
              render={({ field }) => (
                <Input
                  type="number"
                  step={0.01}
                  min="0.99"
                  max="99.99"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  error={!!errors.priceDollars}
                  hint={errors.priceDollars?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label>
              Original video <span className="text-error-500">*</span>
            </Label>
            <FileInput
              onChange={(e) => setOriginal(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1.5 text-xs text-gray-400">Required to publish.</p>
          </div>
          <div>
            <Label>Preview (watermarked)</Label>
            <FileInput
              onChange={(e) => setPreview(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1.5 text-xs text-gray-400">Shown to buyers.</p>
          </div>
          <div>
            <Label>Thumbnail</Label>
            <FileInput
              onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1.5 text-xs text-gray-400">Catalogue image.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox checked={publishNow} onChange={setPublishNow} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Publish to the marketplace immediately
          </span>
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
          {step ?? "Save template"}
        </Button>
      </div>
    </form>
  );
}
