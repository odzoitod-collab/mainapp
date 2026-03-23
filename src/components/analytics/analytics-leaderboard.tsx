"use client";

import React, { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { avatarColor, fmtRub, initials } from "@/lib/format";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { AppUser, ProfitRow } from "@/types/models";
import { LbRankMedal } from "./lb-rank-medal";

type LbFilter = "all" | "month" | "day";

type Props = {
  profits: ProfitRow[];
  users: Record<string, AppUser>;
  uid: number;
  searchHidden: boolean;
  onOpenProfile: (id: string) => void;
};

export function AnalyticsLeaderboard({
  profits,
  users,
  uid,
  searchHidden,
  onOpenProfile,
}: Props) {
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 220);
  const [lbF, setLbF] = useState<LbFilter>("all");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _staggerKey = `${lbF}-${dq}`; // force re-stagger on filter change

  const rows = useMemo(() => {
    const td = new Date().toLocaleDateString("en-CA");
    const mo = td.slice(0, 7);
    const ag: Record<string, number> = {};
    profits.forEach((p) => {
      const d = new Date(p.created_at || "").toLocaleDateString("en-CA");
      let ok = true;
      if (lbF === "day" && d !== td) ok = false;
      if (lbF === "month" && d.slice(0, 7) !== mo) ok = false;
      if (ok)
        ag[String(p.worker_id)] =
          (ag[String(p.worker_id)] || 0) + Number(p.amount);
    });
    const ql = dq.toLowerCase().trim();
    return Object.keys(ag)
      .map((id) => ({
        id,
        t: ag[id],
        u: users[id],
      }))
      .filter(
        (i) =>
          !ql ||
          (i.u?.full_name || "").toLowerCase().includes(ql) ||
          (i.u?.username || "").toLowerCase().includes(ql),
      )
      .sort((a, b) => b.t - a.t)
      .slice(0, 100);
  }, [profits, users, lbF, dq]);

  return (
    <>
      <div className={`search-sticky${searchHidden ? " hide" : ""}`.trim()}>
        <div className="search-wrap">
          <svg
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="inp"
            placeholder="Поиск по имени или @нику…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ margin: 0 }}
            aria-label="Поиск в топе"
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, padding: "0 0 12px" }}>
        <button
          type="button"
          className={`tab${lbF === "all" ? " on" : ""}`}
          onClick={() => setLbF("all")}
        >
          Все
        </button>
        <button
          type="button"
          className={`tab${lbF === "month" ? " on" : ""}`}
          onClick={() => setLbF("month")}
        >
          Месяц
        </button>
        <button
          type="button"
          className={`tab${lbF === "day" ? " on" : ""}`}
          onClick={() => setLbF("day")}
        >
          Сегодня
        </button>
      </div>
      <div className="list list--stagger" role="list">
        {rows.length === 0 ? (
          <EmptyState variant="leaderboard" text="Ничего не найдено" />
        ) : (
          rows.map((it, i) => {
            const nm = it.u?.full_name || `ID: ${it.id}`;
            const tgn = it.u?.username ? `@${it.u.username}` : "";
            const isMe = String(it.id) === String(uid);
            const rank =
              !dq.trim() && lbF === "all" && i < 3 ? (
                <LbRankMedal index={i} />
              ) : (
                <span style={{ opacity: 0.45, fontWeight: 700, fontSize: 12 }}>
                  #{i + 1}
                </span>
              );
            const c = avatarColor(it.id);
            return (
              <Reveal
                key={it.id}
                style={{ "--stagger-i": i } as React.CSSProperties}
              >
                <div
                  role="button"
                  tabIndex={0}
                  className={`li${isMe ? " li--me" : ""}`.trim()}
                  onClick={() => onOpenProfile(it.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenProfile(it.id);
                    }
                  }}
                  aria-label={`${nm} — ${fmtRub(it.t)}, место ${i + 1}`}
                >
                  <div className="lb-rank-cell">{rank}</div>
                  <div
                    className="li-ico"
                    style={{
                      background: `${c}20`,
                      borderColor: `${c}40`,
                    }}
                  >
                    {initials(nm)}
                  </div>
                  <div className="li-body">
                    <div className="li-t">
                      {nm}
                      {isMe ? (
                        <span
                          style={{
                            fontFamily: "var(--fm)",
                            fontSize: 8,
                            color: "var(--blue)",
                          }}
                        >
                          {" "}
                          вы
                        </span>
                      ) : null}
                    </div>
                    <div className="li-s">{tgn}</div>
                  </div>
                  <div className="li-end">{fmtRub(it.t)}</div>
                </div>
              </Reveal>
            );
          })
        )}
      </div>
    </>
  );
}
