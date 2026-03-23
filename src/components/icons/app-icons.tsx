import type { SVGProps } from "react";

type IcoProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IcoNavAnalytics({ size = 20, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ico--nav ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M3 20h18" strokeOpacity="0.4" />
      <path d="M7 20V13" className="ico-path" />
      <path d="M11 20V8" className="ico-path" />
      <path d="M15 20V11" className="ico-path" />
      <path d="M19 20V5" className="ico-path" />
      <circle cx="7" cy="11" r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="11" cy="6" r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" strokeWidth="0" />
      <circle cx="19" cy="3" r="1.5" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

export function IcoNavProfile({ size = 20, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ico--nav ${className ?? ""}`.trim()} aria-hidden {...p}>
      <circle cx="12" cy="8.5" r="3.4" className="ico-path" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" className="ico-path" />
    </svg>
  );
}

export function IcoNavIdeas({ size = 20, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ico--nav ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M9.5 18h5M10.5 21h3" className="ico-path" />
      <path d="M12 3a5.5 5.5 0 0 1 3.2 10 1 1 0 0 0-.6.9V15H9.4v-1.1a1 1 0 0 0-.6-.9A5.5 5.5 0 0 1 12 3z" className="ico-path" />
      <path d="M9.5 12.5l2.5-3.5 2.5 3.5" className="ico-path" strokeOpacity="0.5" />
    </svg>
  );
}

export function IcoNavHub({ size = 20, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ico--nav ${className ?? ""}`.trim()} aria-hidden {...p}>
      <circle cx="12" cy="12" r="3" className="ico-path" />
      <circle cx="5" cy="5" r="1.8" className="ico-path" />
      <circle cx="19" cy="5" r="1.8" className="ico-path" />
      <circle cx="5" cy="19" r="1.8" className="ico-path" />
      <circle cx="19" cy="19" r="1.8" className="ico-path" />
      <path d="M7 7l3.2 3.2M16.8 10.8L14 8.5M7 17l3.2-3.2M14 15.5l2.8 2.3" className="ico-path" strokeOpacity="0.55" />
    </svg>
  );
}

export function IcoChevronRight({ size = 14, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M9 6l5 6-5 6" className="ico-path" />
    </svg>
  );
}

export function IcoExternalLink({ size = 18, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function IcoGridApps({ size = 20, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ico--hub-tile ${className ?? ""}`.trim()} aria-hidden {...p}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" fill="currentColor" fillOpacity="0.1" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" fill="currentColor" fillOpacity="0.14" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" fill="currentColor" fillOpacity="0.08" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" fill="currentColor" fillOpacity="0.12" />
      <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" />
    </svg>
  );
}

export function IcoWrench({ size = 20, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <circle cx="8.5" cy="8.5" r="3.5" fill="currentColor" fillOpacity="0.1" />
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function IcoFolder({ size = 20, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="currentColor" fillOpacity="0.08" />
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function IcoHubClock({ size = 22, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ico--pulse ${className ?? ""}`.trim()} aria-hidden {...p}>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.06" />
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7v6l3.5 1.8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

export function IcoTabServices({ size = 16, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" fillOpacity="0.1" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="currentColor" fillOpacity="0.15" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

export function IcoTabMaterials({ size = 16, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="currentColor" fillOpacity="0.07" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="13" y2="11" />
    </svg>
  );
}

export function IcoTabChats({ size = 16, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="currentColor" fillOpacity="0.08" />
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <circle cx="9" cy="11.5" r="1" fill="currentColor" strokeWidth="0" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" strokeWidth="0" />
      <circle cx="15" cy="11.5" r="1" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

export function IcoStatProfit({ size = 18, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.06" />
      <path d="M12 4v16M16 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
    </svg>
  );
}

export function IcoStatUsers({ size = 18, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" fill="currentColor" fillOpacity="0.1" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function IcoClose({ size = 14, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M18 6L6 18M6 6l12 12" strokeWidth={2} />
    </svg>
  );
}

export function IcoMentor({ size = 18, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 6.2 18l.9-5.4-3.9-3.8 5.4-.8L12 3z" fill="currentColor" fillOpacity="0.1" />
      <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 6.2 18l.9-5.4-3.9-3.8 5.4-.8L12 3z" />
    </svg>
  );
}

export function IcoTrendUp({ size = 18, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function IcoShield({ size = 18, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <path d="M12 2L4 6v6c0 6 4.5 11 8 12 3.5-1 8-6 8-12V6L12 2z" fill="currentColor" fillOpacity="0.1" />
      <path d="M12 2L4 6v6c0 6 4.5 11 8 12 3.5-1 8-6 8-12V6L12 2z" />
      <path d="M9 12l2 2 4-4" strokeWidth={2} />
    </svg>
  );
}

export function IcoClock({ size = 18, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.07" />
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7v5.5l3.5 2" />
    </svg>
  );
}

export function IcoStar({ size = 18, className, ...p }: IcoProps) {
  return (
    <svg {...base(size)} className={`ico ${className ?? ""}`.trim()} aria-hidden {...p}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" fillOpacity="0.12" />
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
