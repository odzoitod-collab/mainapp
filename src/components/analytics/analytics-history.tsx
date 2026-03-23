"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { fmtRub, fmtShortDate } from "@/lib/format";
import type { AppUser, ProfitRow } from "@/types/models";

const IcoList = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 6h13M8 12h13M8 18h13" />
    <path d="M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

const IcoRub = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M6 11h8a4 4 0 0 0 0-8H6v8zM6 15h9" />
    <path d="M6 19V5" />
  </svg>
);

type HistFilter = "all" | "mine";

type Props = {
  profits: ProfitRow[];
  users: Record<string, AppUser>;
  uid: number;
  onOpenProfit: (id: string | number) => void;
};

export function AnalyticsHistory({
  profits,
  users,
  uid,
  onOpenProfit,
}: Props) {
  const [histF, setHistF] = useState<HistFilter>("all");

  const list = useMemo(() => {
    const base =
      histF === "mine"
        ? profits.filter((p) => String(p.worker_id) === String(uid))
        : profits;
    return base.slice(0, 60);
  }, [profits, histF, uid]);

  return (
    <>
      <div style={{ display: "flex", gap: 6, padding: "10px 0 12px" }}>
        <button
          type="button"
          className={`tab${histF === "all" ? " on" : ""}`}
          onClick={() => setHistF("all")}
        >
          Все
        </button>
        <button
          type="button"
          className={`tab${histF === "mine" ? " on" : ""}`}
          onClick={() => setHistF("mine")}
        >
          Мои
        </button>
      </div>
      <div className="list">
        {list.length === 0 ? (
          <EmptyState icon={IcoList} text="Нет данных" />
        ) : (
          list.map((p) => {
            const u = users[String(p.worker_id)];
            const nm = u?.full_name || `ID:${p.worker_id}`;
            const isMe = String(p.worker_id) === String(uid);
            const paid = p.status === "paid";
            return (
              <Reveal key={String(p.id)}>
                <div
                  role="button"
                  tabIndex={0}
                  className="li li--click"
                  onClick={() => onOpenProfit(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenProfit(p.id);
                    }
                  }}
                >
                  <div
                    className="li-ico"
                    style={{
                      background: "var(--green-s)",
                      color: "var(--green)",
                    }}
                  >
                    {IcoRub}
                  </div>
                  <div className="li-body">
                    <div className="li-t">
                      {p.service_name}
                      {histF === "all" && !isMe ? (
                        <>
                          {" "}
                          ·{" "}
                          <span style={{ color: "var(--t4)", fontSize: 12 }}>
                            {nm}
                          </span>
                        </>
                      ) : null}
                    </div>
                    <div
                      className="li-s"
                      style={{
                        display: "flex",
                        gap: 5,
                        alignItems: "center",
                        marginTop: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      {paid ? (
                        <span className="badge badge--paid">выплачено</span>
                      ) : (
                        <span className="badge badge--hold">холд</span>
                      )}
                      <span>{fmtShortDate(p.created_at)}</span>
                      <span style={{ color: "var(--t4)", fontSize: 11 }}>
                        подробнее →
                      </span>
                    </div>
                  </div>
                  <div className="li-end" style={{ color: "var(--green)" }}>
                    +{fmtRub(p.amount)}
                  </div>
                </div>
              </Reveal>
            );
          })
        )}
      </div>
    </>
  );
}
