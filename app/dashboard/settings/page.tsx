"use client";

import Link from 'next/link';
import { useMyCreatorProfile } from '@/hooks/use-creators';
import { useAuthStore } from '@/stores/auth.store';
import { ExternalLink, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { data: creatorProfile } = useMyCreatorProfile();

  return (
    <div className="p-5 sm:p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Creator Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your creator studio preferences.</p>
      </div>

      <div className="space-y-4">
        {/* Creator profile card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
              <User size={16} className="text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Creator Profile</h2>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400">Display name</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400">Verified status</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${creatorProfile?.isVerified ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                {creatorProfile?.isVerified ? '✓ Verified' : 'Not verified'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Revenue share</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">70%</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Your personal details, email, and password are managed in your main account profile.
          </p>
          <Link
            href="/account/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ExternalLink size={14} />
            Go to Account Profile
          </Link>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <Bell size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          {[
            { label: 'New sales', desc: 'Get notified when someone purchases your video', enabled: true },
            { label: 'Payout processed', desc: 'Receive alerts when a payout is sent', enabled: true },
            { label: 'Video approved', desc: 'Get notified when your video passes review', enabled: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{item.desc}</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm mt-0.5 transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <Shield size={16} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Danger Zone</h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Deleting your creator profile will remove all your videos and earnings history permanently.
          </p>
          <button
            className="px-4 py-2 rounded-xl border border-red-300 dark:border-red-500/30 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            onClick={() => alert('Contact support to delete your creator profile.')}
          >
            Delete Creator Profile
          </button>
        </div>
      </div>
    </div>
  );
}
