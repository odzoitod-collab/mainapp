import type { ReactNode } from "react";

type Variant = "money" | "services" | "leaderboard" | "ideas" | "default";

type Props = {
  icon?: ReactNode;
  text: string;
  variant?: Variant;
  action?: { label: string; onClick: () => void };
};

const ILLUSTRATIONS: Record<Variant, ReactNode> = {
  money: (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M40 26v28M33 32h9a5 5 0 0 1 0 10h-9a5 5 0 0 0 0 10h9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M26 18l4 4-4 4M54 18l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  services: (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden>
      <rect x="14" y="22" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="46" y="22" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="54" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <rect x="46" y="54" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M34 32h12M40 22v-6M40 64v6M14 44h6M60 44h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  leaderboard: (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden>
      <path d="M40 16l5 10.5 11.5 1.7-8.4 8 2 11.5L40 42.3 29.9 47.7l2-11.5-8.4-8 11.5-1.7L40 16z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M30 58h20M26 64h28" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="40" cy="32" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  ideas: (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden>
      <path d="M40 14a16 16 0 0 1 9.3 29 3 3 0 0 0-1.8 2.7V48H32.5v-2.3a3 3 0 0 0-1.8-2.7A16 16 0 0 1 40 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M33 54h14M35 58h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M34 30l6 8 6-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden>
      <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 28v16M40 50h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

export function EmptyState({ icon, text, variant = "default", action }: Props) {
  const illustration = icon ?? ILLUSTRATIONS[variant];

  return (
    <div className="empty">
      <div className="empty-icon" aria-hidden>
        {illustration}
      </div>
      <p className="empty-text">{text}</p>
      {action ? (
        <button
          type="button"
          className="btn btn--ghost empty-action"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
