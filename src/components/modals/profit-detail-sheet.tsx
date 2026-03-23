"use client";

import { useMemo } from "react";
import { useAppData } from "@/contexts/app-data-context";
import { fmtAmt, fmtDT } from "@/lib/format";
import { SheetShell } from "./sheet-shell";

const SKIP = new Set([
  "id",
  "worker_id",
  "amount",
  "net_profit",
  "service_name",
  "status",
  "created_at",
  "paid_at",
]);

const LABELS: Record<string, string> = {
  branch_id: "Филиал",
  tag: "Тег",
  note: "Примечание",
  description: "Описание",
  withdrawal_id: "ID вывода",
};

type Props = {
  profitId: string | number | null;
  onClose: () => void;
  onOpenProfile: (userId: string) => void;
};

export function ProfitDetailSheet({
  profitId,
  onClose,
  onOpenProfile,
}: Props) {
  const { profits, users } = useAppData();

  const p = useMemo(
    () => profits.find((x) => String(x.id) === String(profitId)),
    [profits, profitId],
  );

  const u = p ? users[String(p.worker_id)] : undefined;
  const nm = u?.full_name || `Участник #${p?.worker_id}`;
  const un = u?.username ? `@${u.username}` : "";
  const isPaid = p?.status === "paid";

  if (!profitId || !p) return null;

  const extras: { k: string; v: string }[] = [];
  Object.keys(p)
    .sort()
    .forEach((k) => {
      if (SKIP.has(k)) return;
      const v = p[k];
      if (v === null || v === undefined || v === "") return;
      const vs = typeof v === "object" ? JSON.stringify(v) : String(v);
      const lk = LABELS[k] || k.replace(/_/g, " ");
      extras.push({ k: lk, v: vs });
    });

  return (
    <SheetShell
      open
      variant="immersive"
      title={p.service_name ?? "Профит"}
      onClose={onClose}
    >
      <div className="profit-sheet">
        <div className="profit-sheet__hero">
          <div className="profit-sheet__glow" aria-hidden />
          <div className="profit-sheet__sum">+{fmtAmt(p.amount)}</div>
          <div className="profit-sheet__svc">{p.service_name}</div>
          <div className="profit-sheet__badge-wrap">
            <span className={`badge ${isPaid ? "badge--paid" : "badge--hold"}`}>
              <span className="dot" aria-hidden />
              {isPaid ? "выплачено" : "холд"}
            </span>
          </div>
        </div>
        <div className="profit-sheet__kv">
          <div className="profit-kv">
            <span>Чистый профит</span>
            <span>{fmtAmt(p.net_profit)}</span>
          </div>
          <div className="profit-kv">
            <span>Дата начисления</span>
            <span>{fmtDT(p.created_at)}</span>
          </div>
          <div className="profit-kv">
            <span>Дата выплаты</span>
            <span>{p.paid_at ? fmtDT(p.paid_at) : "—"}</span>
          </div>
          <div className="profit-kv">
            <span>ID записи</span>
            <span>#{String(p.id)}</span>
          </div>
          <div className="profit-kv">
            <span>Участник</span>
            <span>
              {nm}
              {un ? (
                <>
                  <br />
                  <span className="profit-sheet__uname">{un}</span>
                </>
              ) : null}
            </span>
          </div>
          {extras.map((e, i) => (
            <div
              key={e.k}
              className="profit-kv profit-sheet__kv-row"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <span>{e.k}</span>
              <span>{e.v}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn--ghost profit-det-btn profit-sheet__profile-btn"
          onClick={() => {
            onClose();
            requestAnimationFrame(() =>
              onOpenProfile(String(p.worker_id)),
            );
          }}
        >
          Профиль участника
        </button>
      </div>
    </SheetShell>
  );
}
