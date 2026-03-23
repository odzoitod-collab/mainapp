import type { CSSProperties } from "react";

type SkeletonProps = {
  variant?: "text" | "title" | "avatar" | "hero-val" | "li" | "custom";
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  count?: number;
  gap?: number;
};

export function Skeleton({
  variant = "custom",
  width,
  height,
  className = "",
  style,
  count = 1,
}: SkeletonProps) {
  const cls = `skeleton${variant !== "custom" ? ` skeleton--${variant}` : ""} ${className}`.trim();
  const inlineStyle: CSSProperties = {
    ...(width != null ? { width } : {}),
    ...(height != null ? { height } : {}),
    ...style,
  };

  if (count === 1) {
    return <div className={cls} style={inlineStyle} aria-hidden />;
  }

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={cls} style={inlineStyle} aria-hidden />
      ))}
    </>
  );
}

export function SkeletonListItem() {
  return (
    <div
      className="li"
      style={{ pointerEvents: "none", cursor: "default" }}
      aria-hidden
    >
      <Skeleton variant="avatar" width={40} height={40} />
      <div className="li-body" style={{ gap: 6, display: "flex", flexDirection: "column" }}>
        <Skeleton variant="title" width="55%" />
        <Skeleton variant="text" width="38%" />
      </div>
      <Skeleton width={48} height={14} />
    </div>
  );
}

export function SkeletonBento() {
  return (
    <div className="bento bento-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bento-item" aria-hidden style={{ pointerEvents: "none" }}>
          <Skeleton variant="hero-val" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      ))}
    </div>
  );
}
