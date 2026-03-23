"use client";

import { IcoGridApps } from "@/components/icons/app-icons";

type Props = {
  icon?: string | null;
  accent: string;
  className?: string;
};

/** Поле services.icon: URL, emoji или пусто — дефолтная сетка. */
export function ServiceIcon({ icon, accent, className }: Props) {
  const raw = (icon ?? "").trim();
  if (!raw) {
    return (
      <span
        className={`service-icon service-icon--svg ${className ?? ""}`.trim()}
        style={{ color: accent }}
      >
        <IcoGridApps size={22} />
      </span>
    );
  }
  if (/^https?:\/\//i.test(raw) || raw.startsWith("//")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={raw}
        alt=""
        className={`service-icon service-icon--img ${className ?? ""}`.trim()}
        loading="lazy"
      />
    );
  }
  return (
    <span
      className={`service-icon service-icon--emoji ${className ?? ""}`.trim()}
      style={{ color: accent }}
      aria-hidden
    >
      {raw}
    </span>
  );
}
