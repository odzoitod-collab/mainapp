"use client";

import { useState } from "react";
import { useTilt } from "@/hooks/use-tilt";
import type { AppUser, ProfitRow } from "@/types/models";
import { AnalyticsHistory } from "./analytics-history";
import { AnalyticsLeaderboard } from "./analytics-leaderboard";
import { AnalyticsOverview } from "./analytics-overview";

type Sub = "ov" | "lb" | "hist";

type Props = {
  profits: ProfitRow[];
  users: Record<string, AppUser>;
  uid: number;
  /** Скрытие «умной» шапки при скролле — поиск в топе прячется вместе с ней только на вкладке «Топ». */
  headerChromeHidden: boolean;
  onOpenProfile: (id: string) => void;
  onOpenProfit: (id: string | number) => void;
};

export function AnalyticsView({
  profits,
  users,
  uid,
  headerChromeHidden,
  onOpenProfile,
  onOpenProfit,
}: Props) {
  const [sub, setSub] = useState<Sub>("ov");
  const tilt = useTilt();

  return (
    <>
      <div className="tabs">
        <button
          type="button"
          className={`tab${sub === "ov" ? " on" : ""}`}
          onClick={() => setSub("ov")}
        >
          Обзор
        </button>
        <button
          type="button"
          className={`tab${sub === "lb" ? " on" : ""}`}
          onClick={() => setSub("lb")}
        >
          Топ
        </button>
        <button
          type="button"
          className={`tab${sub === "hist" ? " on" : ""}`}
          onClick={() => setSub("hist")}
        >
          История
        </button>
      </div>

      <div
        id="sv-analytics-ov"
        className={`subview${sub === "ov" ? " on" : ""}`.trim()}
      >
        <AnalyticsOverview profits={profits} tilt={tilt} />
      </div>
      <div
        id="sv-analytics-lb"
        className={`subview${sub === "lb" ? " on" : ""}`.trim()}
      >
        <AnalyticsLeaderboard
          profits={profits}
          users={users}
          uid={uid}
          searchHidden={headerChromeHidden && sub === "lb"}
          onOpenProfile={onOpenProfile}
        />
      </div>
      <div
        id="sv-analytics-hist"
        className={`subview${sub === "hist" ? " on" : ""}`.trim()}
      >
        <AnalyticsHistory
          profits={profits}
          users={users}
          uid={uid}
          onOpenProfit={onOpenProfit}
        />
      </div>
    </>
  );
}
