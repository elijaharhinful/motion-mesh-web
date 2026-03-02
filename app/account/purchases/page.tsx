'use client';

import { usePurchaseHistory } from '@/hooks/use-payments';
import { ProtectedPage } from '@/components/layout/protected-page';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Play } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/shared/empty-state';
import { PurchaseStatus } from '@/types/enums';

export default function PurchasesPage() {
  return (
    <ProtectedPage>
      <PurchasesList />
    </ProtectedPage>
  );
}

function PurchasesList() {
  const { data: purchases, isLoading } = usePurchaseHistory();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex gap-6 mb-8 border-b border-white/10 pb-6">
        <span className="text-violet-400 border-b-2 border-violet-500 pb-2 text-sm font-medium">Purchases</span>
        <Link href="/account/profile" className="text-white/50 hover:text-white text-sm pb-2 transition-colors">Profile</Link>
      </div>

      <h1 className="text-2xl font-bold text-white mb-8">My Library</h1>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
        </div>
      ) : !purchases?.length ? (
        <EmptyState
          icon={ShoppingBag}
          title="No purchases yet"
          description="Browse and buy a dance move to get started."
          ctaLabel="Browse Moves"
          ctaHref="/browse"
        />
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-14 h-14 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Play size={20} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{purchase.video?.title ?? 'Video'}</p>
                <p className="text-white/40 text-xs mt-0.5">{new Date(purchase.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-white/60 text-sm font-medium">{formatPrice(purchase.amountCents)}</span>
                <StatusBadge status={purchase.status as PurchaseStatus} />
                {purchase.status === 'succeeded' && (
                  <Link
                    href={`/generate/${purchase.id}`}
                    className="px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 text-xs font-medium transition-colors border border-violet-500/20"
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
  );
}
