"use client";

import { usePurchaseHistory } from '@/hooks/use-payments';
import { formatPrice } from '@/lib/utils';
import { DollarSign, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PayoutsPage() {
  const { data: purchases, isLoading } = usePurchaseHistory();

  const totalEarnings = purchases?.reduce((sum, p) => sum + p.creatorPayoutCents, 0) ?? 0;
  const pendingAmount = 0; // Would come from a payouts API endpoint

  return (
    <div className="p-5 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Payouts</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          View your earnings history and pending transfers.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
              <DollarSign size={18} className="text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Earned</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{formatPrice(totalEarnings)}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">70% of gross revenue</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
              <Clock size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Pending Payout</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{formatPrice(pendingAmount)}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Processed end of month</div>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Earnings History</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500">{purchases?.length ?? 0} transactions</span>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-3 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg" />)}
          </div>
        ) : !purchases?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <DollarSign size={24} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No earnings yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mb-5">
              When you earn money from video sales, your history will appear here.
            </p>
            <Link
              href="/dashboard/videos/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Upload a Video
              <ArrowUpRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {purchases.map((p, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Sale</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  +{formatPrice(p.creatorPayoutCents)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
