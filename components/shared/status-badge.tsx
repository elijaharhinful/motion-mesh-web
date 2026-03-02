import { cn } from '@/lib/utils';
import { VideoStatus, PurchaseStatus, GenerationJobStatus } from '@/types/enums';

type AnyStatus = VideoStatus | PurchaseStatus | GenerationJobStatus;

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

const CONFIG: Record<string, { label: string; className: string }> = {
  // VideoStatus
  draft:       { label: 'Draft',      className: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  processing:  { label: 'Processing', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  published:   { label: 'Published',  className: 'bg-green-500/20 text-green-300 border-green-500/30' },
  archived:    { label: 'Archived',   className: 'bg-gray-600/20 text-gray-400 border-gray-600/30' },
  // PurchaseStatus
  pending:     { label: 'Pending',    className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  succeeded:   { label: 'Paid',       className: 'bg-green-500/20 text-green-300 border-green-500/30' },
  failed:      { label: 'Failed',     className: 'bg-red-500/20 text-red-300 border-red-500/30' },
  refunded:    { label: 'Refunded',   className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  // GenerationJobStatus
  completed:   { label: 'Completed',  className: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = CONFIG[status] ?? { label: status, className: 'bg-white/10 text-white/60 border-white/20' };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}
