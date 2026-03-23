"use client";

import { useMemo } from "react";
import { useAppData } from "@/contexts/app-data-context";
import {
  avatarColor,
  fmtRub,
  fmtShortDate,
  initials,
} from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";
import { SheetShell } from "./sheet-shell";

const IcoMoney = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.06" />
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 6v12M9.5 9.5h5a2.5 2.5 0 0 1 0 5h-5a2.5 2.5 0 0 0 0 5H15" />
  </svg>
);

type Props = {
  userId: string | null;
  onClose: () => void;
};

export function ProfileDetailSheet({ userId, onClose }: Props) {
  const { profits, users } = useAppData();

  const up = useMemo(
    () =>
      profits.filter((p) => String(p.worker_id) === String(userId)),
    [profits, userId],
  );

  if (!userId) return null;

  const u = users[userId] || {
    id: userId,
    full_name: undefined as string | undefined,
    username: undefined as string | undefined,
  };
  const id = userId;
  const tot = up.reduce((a, p) => a + Number(p.amount), 0);
  const paid = up
    .filter((p) => p.status === "paid")
    .reduce((a, p) => a + Number(p.amount), 0);
  const hold = up
    .filter((p) => p.status === "hold")
    .reduce((a, p) => a + Number(p.amount), 0);
  const c = avatarColor(id);
  const nm = u.full_name || `ID: ${id}`;

  return (
    <SheetShell
      open
      variant="immersive"
      title="Участник"
      onClose={onClose}
    >
      <div className="profile-sheet">
        <div className="profile-sheet__hero">
          <div
            className="profile-sheet__avatar"
            style={{
              background: `${c}22`,
              borderColor: `${c}44`,
              color: c,
            }}
          >
            {initials(nm)}
          </div>
          <h2 className="profile-sheet__name">{nm}</h2>
          <p className="profile-sheet__handle">
            {u.username ? `@${u.username}` : `ID: ${id}`}
          </p>
          <div className="profile-sheet__total">{fmtRub(tot)}</div>
          <div className="profile-sheet__badges">
            <span className="badge badge--paid">
              <span className="dot" aria-hidden />
              {fmtRub(paid)}
            </span>
            <span className="badge badge--hold">
              <span className="dot" aria-hidden />
              холд {fmtRub(hold)}
            </span>
          </div>
          <p className="profile-sheet__meta">{up.length} транзакций</p>
        </div>

        <div className="profile-sheet__sec">
          <span className="profile-sheet__sec-lbl">Последние профиты</span>
        </div>
        <div className="profile-sheet__list list">
          {up.length === 0 ? (
            <EmptyState icon={IcoMoney} text="Нет выплат" />
          ) : (
            up.slice(0, 14).map((p, i) => (
              <div
                key={String(p.id)}
                className="li profile-sheet__row"
                style={{
                  animationDelay: `${Math.min(i, 10) * 0.04}s`,
                }}
              >
                <div className="li-body">
                  <div className="li-t">{p.service_name}</div>
                  <div className="li-s profile-sheet__row-meta">
                    {p.status === "paid" ? (
                      <span className="badge badge--paid">выплачено</span>
                    ) : (
                      <span className="badge badge--hold">холд</span>
                    )}
                    <span>{fmtShortDate(p.created_at)}</span>
                  </div>
                </div>
                <div className="li-end profile-sheet__row-amt">
                  +{fmtRub(p.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SheetShell>
  );
}
