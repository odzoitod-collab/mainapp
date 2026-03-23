"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Reveal } from "@/components/ui/reveal";
import { useCountUp } from "@/hooks/use-count-up";
import { caDate, fmtRub } from "@/lib/format";
import type { ProfitRow } from "@/types/models";

const AnalyticsCharts = dynamic(
  () =>
    import("./analytics-charts").then((m) => ({ default: m.AnalyticsCharts })),
  { ssr: false, loading: () => <div className="chart-wrap" /> },
);

const WALLET_IMG =
  "https://foni.papik.pro/uploads/posts/2024-09/foni-papik-pro-31g9-p-kartinki-koshelek-na-prozrachnom-fone-2.png";

const BentoIcoBar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 20h18" strokeOpacity="0.5" />
    <rect x="5" y="13" width="4" height="7" rx="1.5" fill="currentColor" fillOpacity="0.15" />
    <rect x="10" y="9" width="4" height="11" rx="1.5" fill="currentColor" fillOpacity="0.2" />
    <rect x="15" y="6" width="4" height="14" rx="1.5" fill="currentColor" fillOpacity="0.25" />
    <path d="M5 13h4M10 9h4M15 6h4" strokeOpacity="0.7" />
  </svg>
);

const BentoIcoWrench = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="8.5" cy="8.5" r="3.5" fill="currentColor" fillOpacity="0.12" />
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const BentoIcoWave = () => (
  <svg viewBox="0 0 26 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M1 9c2.5-5 5-5 7.5 0s5 5 7.5 0 5-5 7.5 0" />
    <path d="M1 13c2.5-4 5-4 7.5 0s5 4 7.5 0 5-4 7.5 0" strokeOpacity="0.35" />
  </svg>
);

const BentoIcoCal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="3" fill="currentColor" fillOpacity="0.1" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1.5" fill="currentColor" />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    <circle cx="16" cy="15" r="1.5" fill="currentColor" />
  </svg>
);

const HeroDecorStars = () => (
  <svg viewBox="0 0 120 120" fill="none" aria-hidden style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.18 }}>
    <circle cx="100" cy="20" r="1.5" fill="#5b9aff" />
    <circle cx="108" cy="35" r="1" fill="#9d70ff" />
    <circle cx="94" cy="48" r="1.2" fill="#5b9aff" />
    <circle cx="115" cy="55" r="0.8" fill="#22d9ff" />
    <circle cx="88" cy="65" r="1.5" fill="#12c98b" />
    <path d="M102 12 l1.5 4 l4 1.5 l-4 1.5 L102 23 l-1.5-4 l-4-1.5 l4-1.5z" fill="#5b9aff" />
  </svg>
);

export function useAnalyticsTotals(profits: ProfitRow[]) {
  return useMemo(() => {
    const total = profits.reduce((a, p) => a + Number(p.amount), 0);
    const td = new Date().toLocaleDateString("en-CA");
    const today = profits
      .filter((p) => caDate(p.created_at || "") === td)
      .reduce((a, p) => a + Number(p.amount), 0);
    const record = profits.reduce(
      (a, p) => Math.max(a, Number(p.amount)),
      0,
    );
    const n = profits.length;
    const svc = new Set(
      profits.map((p) => p.service_name).filter(Boolean),
    ).size;
    const weekCutoff = new Date();
    weekCutoff.setDate(weekCutoff.getDate() - 7);
    const wk = profits
      .filter((p) => new Date(p.created_at || 0) >= weekCutoff)
      .reduce((a, p) => a + Number(p.amount), 0);
    return {
      total,
      today,
      record,
      n,
      svc,
      avg: n ? total / n : 0,
      wk,
    };
  }, [profits]);
}

type Tilt = {
  ref: React.RefObject<HTMLDivElement | null>;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
};

export function AnalyticsOverview({ profits, tilt }: { profits: ProfitRow[]; tilt: Tilt }) {
  const t = useAnalyticsTotals(profits);
  const animTotal = useCountUp(t.total, 900);
  const animToday = useCountUp(t.today, 700);
  const animRecord = useCountUp(t.record, 700);

  return (
    <>
      <Reveal
        className="card hero tilt-wrap hero-analytics"
        outerRef={tilt.ref}
        onTouchMove={tilt.onTouchMove}
        onTouchEnd={tilt.onTouchEnd}
      >
        <HeroDecorStars />
        <div
          className="deco deco-wallet"
          style={{
            right: 6,
            top: "calc(50% - 55px)",
            width: 110,
            height: 110,
          }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WALLET_IMG}
            alt=""
            width={110}
            height={110}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="ha-inner">
          <div className="ha-kicker">Профит команды</div>
          <div
            className="ha-total"
            aria-label={`Общий профит команды: ${fmtRub(t.total)}`}
          >
            {fmtRub(Math.round(animTotal))}
          </div>
          <div className="ha-stats">
            <div className="ha-stat">
              <div className="ha-stat-val">{fmtRub(Math.round(animToday))}</div>
              <div className="ha-stat-lbl">Сегодня</div>
            </div>
            <div className="ha-stat">
              <div className="ha-stat-val">{fmtRub(Math.round(animRecord))}</div>
              <div className="ha-stat-lbl">Рекорд</div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="bento bento-4 delay-1">
        <div className="bento-item">
          <div className="bento-ico">
            <BentoIcoBar />
          </div>
          <div className="bento-val">{String(t.n)}</div>
          <div className="bento-lbl">Выплат</div>
        </div>
        <div className="bento-item">
          <div className="bento-ico">
            <BentoIcoWrench />
          </div>
          <div className="bento-val">{String(t.svc)}</div>
          <div className="bento-lbl">Сервисов</div>
        </div>
        <div className="bento-item">
          <div className="bento-ico">
            <BentoIcoWave />
          </div>
          <div className="bento-val">{fmtRub(t.avg)}</div>
          <div className="bento-lbl">Средняя</div>
        </div>
        <div className="bento-item">
          <div className="bento-ico">
            <BentoIcoCal />
          </div>
          <div className="bento-val">{fmtRub(t.wk)}</div>
          <div className="bento-lbl">7 дней</div>
        </div>
      </Reveal>

      <Reveal className="sec delay-2">
        <span>Динамика · 7 дней</span>
      </Reveal>
      <Reveal className="card delay-2">
        <div className="chart-card-meta">
          <span>Тренд</span>
          <span style={{ textTransform: "none", letterSpacing: "normal" }}>
            IRL Team
          </span>
        </div>
        <AnalyticsCharts profits={profits} mode="line" />
      </Reveal>

      <Reveal className="sec delay-3">
        <span>Топ сервисов</span>
      </Reveal>
      <Reveal className="card delay-3">
        <div className="chart-card-meta">
          <span>Доля</span>
          <span style={{ textTransform: "none" }}>топ-5</span>
        </div>
        <AnalyticsCharts profits={profits} mode="pie" />
      </Reveal>
    </>
  );
}
