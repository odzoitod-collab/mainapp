"use client";

import { fmtUsd, initials } from "@/lib/format";

type Props = {
  name: string;
  subtitle: string;
  photoUrl: string;
  balanceUsd: number;
  onAvatarClick: () => void;
  hdrClassName: string;
};

export function AppHeader({
  name,
  subtitle,
  photoUrl,
  balanceUsd,
  onAvatarClick,
  hdrClassName,
}: Props) {
  const showBal = balanceUsd > 0;

  return (
    <header className={`hdr ${hdrClassName}`.trim()}>
      <div className="hdr-brand">IRL</div>
      <button
        type="button"
        className="hdr-av"
        onClick={onAvatarClick}
        aria-label="Профиль"
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" loading="lazy" />
        ) : (
          initials(name)
        )}
      </button>
      <div className="hdr-meta">
        <div className="hdr-name">{name}</div>
        <div className="hdr-sub">{subtitle}</div>
      </div>
      <div
        className={`hdr-bal${showBal ? " hdr-bal--visible" : ""}`.trim()}
        aria-hidden={!showBal}
      >
        {fmtUsd(balanceUsd)}
      </div>
    </header>
  );
}
