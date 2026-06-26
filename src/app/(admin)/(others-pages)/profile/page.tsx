"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Pencil } from "lucide-react";
import {
  useMe,
  useUpdateProfile,
  useAvatarUploadUrl,
  useForgotPassword,
  useDeleteAccount,
} from "@/hooks/use-auth";
import { apiClient } from "@/lib/api-client";
import { useToastStore } from "@/stores/toast.store";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Badge from "@/components/ui/badge/Badge";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { UserRole } from "@/types/enums";

const NOT_SET = "Not set";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="text-sm font-medium text-gray-800 dark:text-white/90">
        {children}
      </div>
    </div>
  );
}

const SOCIAL_PATHS = [
  "M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z",
  "M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z",
  "M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z",
  "M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.99972L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z",
];

function SocialIcons() {
  return (
    <div className="flex items-center gap-2">
      {SOCIAL_PATHS.map((d, i) => (
        <span
          key={i}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 dark:border-gray-700"
        >
          <svg className="fill-current" width="16" height="16" viewBox="0 0 20 20">
            <path d={d} />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const { mutateAsync: update, isPending } = useUpdateProfile();
  const { mutateAsync: getAvatarUploadUrl } = useAvatarUploadUrl();
  const { mutate: forgot, isPending: sendingReset } = useForgotPassword();
  const { mutate: deleteAccount, isPending: deleting } = useDeleteAccount();
  const { addToast } = useToastStore();
  const edit = useModal();
  const del = useModal();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const onEdit = () => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setAvatarPreview(null);
      setAvatarFile(null);
    }
    edit.openModal();
  };

  const onPickAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSave = async () => {
    setSavingAvatar(true);
    try {
      let avatarS3Key: string | undefined;
      if (avatarFile) {
        // Mint a presigned URL, upload the bytes straight to storage, then
        // persist only the resulting object key.
        const { url, key } = await getAvatarUploadUrl({
          contentType: avatarFile.type,
        });
        await apiClient.uploadToS3(url, avatarFile);
        avatarS3Key = key;
      }
      await update({ firstName, lastName, avatarS3Key });
      addToast({ type: "success", title: "Profile updated." });
      edit.closeModal();
    } catch {
      addToast({ type: "error", title: "Update failed." });
    } finally {
      setSavingAvatar(false);
    }
  };

  const saving = isPending || savingAvatar;

  const onChangePassword = () => {
    if (!user) return;
    forgot(user.email, {
      onSettled: () =>
        addToast({
          type: "success",
          title: "Password reset link sent to your email.",
        }),
    });
  };

  const onDelete = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        del.closeModal();
        router.push("/login");
      },
      onError: () =>
        addToast({ type: "error", title: "Could not delete account." }),
    });
  };

  if (isLoading || !user) {
    return (
      <div className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]" />
    );
  }

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const isAdmin = user.role === UserRole.ADMIN;
  const modalAvatar = avatarPreview ?? user.avatarUrl;

  return (
    <div>
      <PageBreadcrumb pageTitle="Profile" />

      {/* Profile: summary + details in ONE card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col items-center gap-5 xl:flex-row xl:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-brand-500 text-xl font-semibold text-white dark:border-gray-800">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={initials}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="text-center xl:text-left">
              <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
                {user.firstName} {user.lastName}
              </h4>
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 xl:justify-start">
                <Badge color={isAdmin ? "warning" : "primary"} size="sm">
                  {isAdmin ? "Admin" : "Member"}
                </Badge>
                <Badge color={user.isSeller ? "info" : "light"} size="sm">
                  {user.isSeller ? "Seller" : "Buyer"}
                </Badge>
                <Badge
                  color={user.isEmailVerified ? "success" : "warning"}
                  size="sm"
                >
                  {user.isEmailVerified ? "Email verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            startIcon={<Pencil size={16} />}
          >
            Edit
          </Button>
        </div>

        {/* Details grid */}
        <div className="mt-7 grid grid-cols-1 gap-5 border-t border-gray-100 pt-7 dark:border-gray-800 sm:grid-cols-2">
          <Field label="First Name">{user.firstName}</Field>
          <Field label="Last Name">{user.lastName}</Field>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Email address">{user.email}</Field>
          <Field label="Phone">{NOT_SET}</Field>
          <Field label="Bio">{NOT_SET}</Field>
          <Field label="Social Links">
            <SocialIcons />
          </Field>
        </div>
      </div>

      {/* Address */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-start justify-between">
          <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            Address
          </h4>
          <Button variant="outline" size="sm" disabled startIcon={<Pencil size={16} />}>
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Country">{NOT_SET}</Field>
          <Field label="City / State">{NOT_SET}</Field>
          <Field label="Postal Code">{NOT_SET}</Field>
          <Field label="Tax ID">{NOT_SET}</Field>
        </div>
      </div>

      {/* Security */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Security
        </h4>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Change Password
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We will email you a secure link to set a new password.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onChangePassword}
              disabled={sendingReset}
            >
              {sendingReset ? "Sending…" : "Change Password"}
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Two-factor authentication (2FA)
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account.
              </p>
            </div>
            <span className="inline-flex items-center gap-2">
              <span className="text-xs text-gray-400">Coming soon</span>
              <span className="inline-flex h-6 w-11 cursor-not-allowed items-center rounded-full bg-gray-200 px-0.5 dark:bg-gray-700">
                <span className="h-5 w-5 rounded-full bg-white shadow" />
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 rounded-2xl border border-error-300 bg-error-50 p-5 dark:border-error-500/40 dark:bg-error-500/10 lg:p-6">
        <h4 className="mb-6 text-lg font-semibold text-error-600 dark:text-error-400">
          Danger Zone
        </h4>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Log out all devices
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign out from every active session.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled
              onClick={() => addToast({ type: "info", title: "Coming soon." })}
            >
              Log out all
            </Button>
          </div>

          <div className="flex flex-col gap-3 border-t border-error-200 pt-6 dark:border-error-500/20 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Delete account
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <button
              onClick={del.openModal}
              className="inline-flex items-center justify-center rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-error-600"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        isOpen={edit.isOpen}
        onClose={edit.closeModal}
        className="m-4 max-w-[700px]"
      >
        <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
            {/* Change profile picture */}
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
              Change Profile Picture
            </h5>
            <div className="mb-7 flex items-center gap-4">
              <div className="relative h-20 w-20">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-brand-500 text-xl font-semibold text-white dark:border-gray-800">
                  {modalAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={modalAvatar}
                      alt={initials}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <Camera size={15} />
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={onPickAvatar}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload a square image (200x200 px) in JPEG or PNG format.
              </p>
            </div>

            {/* Personal information */}
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
              Personal Information
            </h5>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  type="text"
                  defaultValue={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  defaultValue={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input type="text" defaultValue={user.email} disabled />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="text" placeholder="Not set" />
              </div>
              <div className="lg:col-span-2">
                <Label>Bio</Label>
                <Input type="text" placeholder="Tell us about yourself" />
              </div>
            </div>

            {/* Social links */}
            <h5 className="mb-5 mt-7 text-lg font-medium text-gray-800 dark:text-white/90">
              Social Links
            </h5>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Facebook</Label>
                <Input type="text" placeholder="https://facebook.com/…" />
              </div>
              <div>
                <Label>X.com</Label>
                <Input type="text" placeholder="https://x.com/…" />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input type="text" placeholder="https://linkedin.com/in/…" />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input type="text" placeholder="https://instagram.com/…" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={edit.closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={del.isOpen}
        onClose={del.closeModal}
        className="m-4 max-w-[500px]"
      >
        <div className="relative w-full rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-9">
          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Delete account
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            This permanently deletes your account and data. This action cannot
            be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button size="sm" variant="outline" onClick={del.closeModal}>
              Cancel
            </Button>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-lg bg-error-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-error-600 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete account"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
