'use client';

import { useMyCreatorProfile } from '@/hooks/use-creators';
import { useVideos } from '@/hooks/use-videos';
import { usePurchaseHistory } from '@/hooks/use-payments';
import { ProtectedPage } from '@/components/layout/protected-page';
import { formatPrice } from '@/lib/utils';
import { UserRole } from '@/types/enums';
import { DollarSign, PlaySquare, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

export default function DashboardPage() {
  return (
    <ProtectedPage requiredRole={UserRole.CREATOR}>
      <DashboardContent />
    </ProtectedPage>
  );
}

function DashboardContent() {
  const { user } = useAuthStore();
  const { data: creatorProfile } = useMyCreatorProfile();
  const { data: allVideos } = useVideos();
  const { data: purchases } = usePurchaseHistory();

  // Filter to only creator's videos
  const myVideos = allVideos?.filter((v) => v.creatorId === creatorProfile?.id) ?? [];
  const activeVideos = myVideos.filter((v) => v.status === 'published').length;

  // Earnings from purchases of creator's videos (approximation via creatorPayoutCents)
  const totalEarningsCents = purchases?.reduce((sum, p) => sum + p.creatorPayoutCents, 0) ?? 0;
  const totalSales = purchases?.length ?? 0;

  // Build chart data: last 7 days
  const chartData = buildChartData(purchases ?? []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Creator Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">
            Welcome back, {user?.firstName}
            {creatorProfile?.isVerified && ' ✓'}
          </p>
        </div>
        <Link
          href="/dashboard/videos/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Upload Move
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          {
            icon: DollarSign,
            label: 'Total Earnings',
            value: formatPrice(totalEarningsCents),
            sub: '70% revenue share',
            color: 'from-green-500/20 to-emerald-600/10 border-green-500/20',
            iconColor: 'text-green-400',
          },
          {
            icon: TrendingUp,
            label: 'Total Sales',
            value: String(totalSales),
            sub: 'Purchases completed',
            color: 'from-blue-500/20 to-cyan-600/10 border-blue-500/20',
            iconColor: 'text-blue-400',
          },
          {
            icon: PlaySquare,
            label: 'Active Videos',
            value: String(activeVideos),
            sub: `${myVideos.length} total uploaded`,
            color: 'from-violet-500/20 to-purple-600/10 border-violet-500/20',
            iconColor: 'text-violet-400',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} border rounded-2xl p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <stat.icon size={20} className={stat.iconColor} />
              <span className="text-white/60 text-sm">{stat.label}</span>
            </div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
            <div className="text-white/40 text-xs mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white/3 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-6">Revenue (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip contentStyle={{ background: '#0f0f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} formatter={(v: number | undefined) => [`$${(v ?? 0).toFixed(2)}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#purple-grad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick links */}
      <div className="flex gap-4">
        <Link href="/dashboard/videos" className="px-5 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm transition-all">
          Manage Videos →
        </Link>
      </div>
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
