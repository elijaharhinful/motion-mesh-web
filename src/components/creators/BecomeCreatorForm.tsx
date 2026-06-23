"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useApplyCreator } from "@/hooks/use-creators";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth.store";
import { useModeStore } from "@/stores/mode.store";
import { useToastStore } from "@/stores/toast.store";
import { ActiveMode } from "@/types/enums";
import type { ApiError, ApiResponse, User } from "@/types/api.types";

const schema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(100, "Display name must be at most 100 characters."),
  bio: z.string().trim().max(1000, "Bio must be at most 1000 characters.").optional(),
  socialLink: z
    .union([z.string().trim().url("Enter a valid URL."), z.literal("")])
    .optional(),
});

type FormValues = z.infer<typeof schema>;

/**
 * Seller onboarding form. Creating a CreatorProfile grants the SELLER
 * capability (`isSeller`) without changing `role`. On success we refresh the
 * session so the header flips from the "Become a Seller" CTA to the
 * Buyer/Seller toggle, switch the active workspace to Seller, and land on the
 * seller dashboard. See M2 in the Milestone Roadmap.
 */
export function BecomeCreatorForm() {
  const router = useRouter();
  const { mutateAsync: apply, isPending } = useApplyCreator();
  const setMode = useModeStore((s) => s.setMode);
  const { addToast } = useToastStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", bio: "", socialLink: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await apply({
        displayName: values.displayName,
        bio: values.bio ? values.bio : undefined,
        socialLink: values.socialLink ? values.socialLink : undefined,
      });

      // Refresh the session so `isSeller` flips and the header shows the toggle.
      const me = await apiClient.get<ApiResponse<User>>("/users/me");
      const token = useAuthStore.getState().accessToken;
      if (token) useAuthStore.getState().setAuth(me.data, token);

      setMode(ActiveMode.SELLER);
      addToast({ type: "success", title: "You're now a seller on MotionMesh." });
      router.push("/dashboard");
    } catch (err) {
      const e = err as ApiError;
      addToast({
        type: "error",
        title: e?.message || "Could not complete onboarding. Please try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-8 xl:py-8"
    >
      <div className="mb-6">
        <h3 className="mb-1 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
          Set up your seller profile
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This unlocks the seller workspace. Your role stays the same, and you
          can switch between buying and selling anytime.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label>
            Display name <span className="text-error-500">*</span>
          </Label>
          <Controller
            control={control}
            name="displayName"
            render={({ field }) => (
              <Input
                placeholder="e.g. Jordan Rivera"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.displayName}
                hint={errors.displayName?.message}
              />
            )}
          />
        </div>

        <div>
          <Label>Bio</Label>
          <Controller
            control={control}
            name="bio"
            render={({ field }) => (
              <TextArea
                placeholder="Tell buyers about your dance style and experience."
                rows={4}
                value={field.value}
                onChange={field.onChange}
                error={!!errors.bio}
                hint={errors.bio?.message}
              />
            )}
          />
        </div>

        <div>
          <Label>Social link</Label>
          <Controller
            control={control}
            name="socialLink"
            render={({ field }) => (
              <Input
                type="url"
                placeholder="https://instagram.com/yourhandle"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.socialLink}
                hint={errors.socialLink?.message}
              />
            )}
          />
        </div>

        <Button type="submit" className="w-full" size="sm" disabled={isPending}>
          {isPending ? "Setting up…" : "Become a seller"}
        </Button>
      </div>
    </form>
  );
}
