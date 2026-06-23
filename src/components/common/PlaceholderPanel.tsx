import React from "react";

interface PlaceholderPanelProps {
  /** Big heading inside the panel. */
  title: string;
  /** Supporting copy under the heading. */
  description: string;
  /** Optional icon rendered in the brand circle. */
  icon?: React.ReactNode;
  /** Optional pill noting which milestone delivers the real feature. */
  comingIn?: string;
  /** Optional CTA / action area rendered below the copy. */
  children?: React.ReactNode;
}

/**
 * A TailAdmin-styled empty-state panel used for M1 workspace shells. The real
 * content for each surface arrives in its own milestone; this keeps the mode
 * switch and navigation working end-to-end without dead routes.
 */
export default function PlaceholderPanel({
  title,
  description,
  icon,
  comingIn,
  children,
}: PlaceholderPanelProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-10 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-16">
      <div className="mx-auto w-full max-w-[560px] text-center">
        {icon && (
          <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/10">
            {icon}
          </span>
        )}
        <h3 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          {description}
        </p>
        {comingIn && (
          <span className="mt-5 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            {comingIn}
          </span>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
