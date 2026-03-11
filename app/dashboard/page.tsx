'use client';

import { useMyCreatorProfile } from '@/hooks/use-creators';
import { useVideos } from '@/hooks/use-videos';
import { usePurchaseHistory } from '@/hooks/use-payments';
import { ProtectedPage } from '@/components/layout/protected-page';
import { formatPrice } from '@/lib/utils';
import { DollarSign, PlaySquare, TrendingUp, Plus, ArrowRight, ShoppingBag, Play } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { StatusBadge } from '@/components/shared/status-badge';
import { PurchaseStatus } from '@/types/enums';

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <DashboardRouter />
    </ProtectedPage>
  );
}

function DashboardRouter() {
  const { user } = useAuthStore();
  const isCreator = !!user?.creatorProfile;

  if (!isCreator) return <UserDashboardContent />;

  return <DashboardContent />;
}

function UserDashboardContent() {
  const { user } = useAuthStore();
  const { data: purchases } = usePurchaseHistory();

  const totalPurchases = purchases?.length ?? 0;
  const completedGenerations = purchases?.filter(p => p.status === 'succeeded').length ?? 0;
  
  const recentPurchases = purchases?.slice(0, 5) ?? [];

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Purchased Moves',
      value: String(totalPurchases),
      sub: 'Total items in library',
      iconBg: 'bg-blue-100 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      border: 'border-gray-200 dark:border-gray-800',
    },
    {
      icon: PlaySquare,
      label: 'Completed Generations',
      value: String(completedGenerations),
      sub: 'Ready to download',
      iconBg: 'bg-green-100 dark:bg-green-500/20',
      iconColor: 'text-green-600 dark:text-green-400',
      border: 'border-gray-200 dark:border-gray-800',
    },
  ];

  return (
    <div className="p-5 sm:p-6 space-y-6">
      {/* Welcome & Become Creator Banner inline */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-500/20">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome to MotionMesh, {user?.firstName}!</h1>
          <p className="text-violet-200 text-sm max-w-lg">
            Ready to monetize your own dance moves? You can create a creator profile to upload videos, set your prices, and earn a 70% revenue share.
          </p>
        </div>
        <Link
          href="/become-creator"
          className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-violet-600 hover:bg-gray-50 font-medium transition-all shadow-sm"
        >
          <TrendingUp size={18} />
          Become a Creator
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white dark:bg-gray-900 border ${stat.border} rounded-2xl p-5`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.iconColor} />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Purchases */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Purchases</h2>
          <Link
            href="/account/purchases"
            className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
          >
            View all
          </Link>
        </div>
        
        {!recentPurchases.length ? (
          <div className="text-center py-8">
            <ShoppingBag size={32} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No purchases yet.</p>
            <Link href="/browse" className="text-violet-600 dark:text-violet-400 text-sm mt-2 inline-block hover:underline font-medium">
              Browse Moves
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <Play size={18} className="text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white font-medium text-sm truncate">{purchase.video?.title ?? 'Video'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{new Date(purchase.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{formatPrice(purchase.amountCents)}</span>
                  <StatusBadge status={purchase.status as PurchaseStatus} />
                  {purchase.status === 'succeeded' && (
                    <Link
                      href={`/generate/${purchase.id}`}
                      className="hidden sm:block px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors"
                    >
                      Generate
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuthStore();
  const { data: creatorProfile } = useMyCreatorProfile();
  const { data: allVideos } = useVideos();
  const { data: purchases } = usePurchaseHistory();

  const myVideos = allVideos?.filter((v) => v.creatorId === creatorProfile?.id) ?? [];
  const activeVideos = myVideos.filter((v) => v.status === 'published').length;
  const totalEarningsCents = purchases?.reduce((sum, p) => sum + p.creatorPayoutCents, 0) ?? 0;
  const totalSales = purchases?.length ?? 0;
  const chartData = buildChartData(purchases ?? []);

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Earnings',
      value: formatPrice(totalEarningsCents),
      sub: '70% revenue share',
      iconBg: 'bg-green-100 dark:bg-green-500/20',
      iconColor: 'text-green-600 dark:text-green-400',
      border: 'border-gray-200 dark:border-gray-800',
    },
    {
      icon: TrendingUp,
      label: 'Total Sales',
      value: String(totalSales),
      sub: 'Purchases completed',
      iconBg: 'bg-blue-100 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      border: 'border-gray-200 dark:border-gray-800',
    },
    {
      icon: PlaySquare,
      label: 'Active Videos',
      value: String(activeVideos),
      sub: `${myVideos.length} total uploaded`,
      iconBg: 'bg-violet-100 dark:bg-violet-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
      border: 'border-gray-200 dark:border-gray-800',
    },
  ];

  return (
    <div className="p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Creator Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Welcome back, {user?.firstName}{creatorProfile?.isVerified && ' ✓'}
          </p>
        </div>
        <Link
          href="/dashboard/videos/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Upload Move
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white dark:bg-gray-900 border ${stat.border} rounded-2xl p-5`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.iconColor} />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5">Revenue — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
            <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, color: '#111827', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              formatter={(v: number | undefined) => [`$${(v ?? 0).toFixed(2)}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#purple-grad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick link */}
      <Link
        href="/dashboard/videos"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        Manage Videos
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function buildChartData(purchases: { creatorPayoutCents: number; createdAt: string }[]) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
  }
  purchases.forEach((p) => {
    const d = new Date(p.createdAt);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (label in days) days[label] += p.creatorPayoutCents / 100;
  });
  return Object.entries(days).map(([day, revenue]) => ({ day, revenue: +revenue.toFixed(2) }));
}
