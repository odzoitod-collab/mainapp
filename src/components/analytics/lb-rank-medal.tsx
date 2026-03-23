"use client";

import { useId } from "react";

export function LbRankMedal({ index }: { index: number }) {
  const id = useId().replace(/:/g, "");

  if (index === 0) {
    return (
      <svg
        className="lb-rank-ico"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        role="img"
        aria-label="1 место"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fde047" />
            <stop offset="1" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill={`url(#${id})`}
          stroke="rgba(0,0,0,.15)"
          strokeWidth="0.5"
        />
        <text
          x="12"
          y="16.2"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill="#422006"
          fontFamily="system-ui,sans-serif"
        >
          1
        </text>
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg
        className="lb-rank-ico"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        role="img"
        aria-label="2 место"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill={`url(#${id})`}
          stroke="rgba(0,0,0,.12)"
          strokeWidth="0.5"
        />
        <text
          x="12"
          y="16.2"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill="#334155"
          fontFamily="system-ui,sans-serif"
        >
          2
        </text>
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg
        className="lb-rank-ico"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        role="img"
        aria-label="3 место"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fdba74" />
            <stop offset="1" stopColor="#c2410c" />
          </linearGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill={`url(#${id})`}
          stroke="rgba(0,0,0,.12)"
          strokeWidth="0.5"
        />
        <text
          x="12"
          y="16.2"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill="#431407"
          fontFamily="system-ui,sans-serif"
        >
          3
        </text>
      </svg>
    );
  }
  return (
    <span style={{ opacity: 0.45, fontWeight: 700, fontSize: 12 }}>
      #{index + 1}
    </span>
  );
}
