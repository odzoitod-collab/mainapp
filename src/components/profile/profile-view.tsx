"use client";

import { useMemo } from "react";
import { TG_BOT } from "@/lib/constants";
import {
  avatarColor,
  caDate,
  fmtRub,
  fmtUsd,
  initials,
} from "@/lib/format";
import { getTelegram, openTgUrl } from "@/lib/telegram";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { useTilt } from "@/hooks/use-tilt";
import type {
  AppUser,
  MentorRow,
  ProfitRow,
  ReferralProfitRow,
  ReferralUser,
} from "@/types/models";

const WALLET_IMG =
  "https://foni.papik.pro/uploads/posts/2024-09/foni-papik-pro-31g9-p-kartinki-koshelek-na-prozrachnom-fone-2.png";

const IcoUsers = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IcoPersonEmpty = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
  </svg>
);

type Props = {
  me?: AppUser;
  uid: number;
  profits: ProfitRow[];
  allProfits: ProfitRow[];
  refs: ReferralUser[];
  refP: ReferralProfitRow[];
  myMentors: MentorRow[];
  showToast: (msg: string, kind?: "ok" | "error") => void;
};

function haptic(
  fn?: "selection" | "impact" | "success",
  impact?: "light" | "medium",
) {
  const h = getTelegram()?.HapticFeedback;
  if (!h) return;
  if (fn === "selection") h.selectionChanged();
  else if (fn === "impact") h.impactOccurred(impact || "light");
  else if (fn === "success") h.notificationOccurred("success");
}

export function ProfileView({
  me,
  uid,
  profits,
  allProfits,
  refs,
  refP,
  myMentors,
  showToast,
}: Props) {
  const tilt = useTilt();

  const myP = useMemo(
    () => profits.filter((p) => String(p.worker_id) === String(uid)),
    [profits, uid],
  );

  const stats = useMemo(() => {
    const td = new Date().toLocaleDateString("en-CA");
    const weekCutoff = new Date();
    weekCutoff.setDate(weekCutoff.getDate() - 7);
    const moSt = new Date();
    moSt.setDate(1);
    moSt.setHours(0, 0, 0, 0);
    const totP = myP.reduce((a, p) => a + Number(p.amount), 0);
    const todP = myP
      .filter((p) => caDate(p.created_at || "") === td)
      .reduce((a, p) => a + Number(p.amount), 0);
    const wkP = myP
      .filter((p) => new Date(p.created_at || 0) >= weekCutoff)
      .reduce((a, p) => a + Number(p.amount), 0);
    const moP = myP
      .filter((p) => new Date(p.created_at || 0) >= moSt)
      .reduce((a, p) => a + Number(p.amount), 0);
    return { totP, todP, wkP, moP };
  }, [myP]);

  const rank = useMemo(() => {
    const ag: Record<string, number> = {};
    allProfits.forEach(
      (p) =>
        (ag[String(p.worker_id)] =
          (ag[String(p.worker_id)] || 0) + Number(p.amount)),
    );
    const sorted = Object.entries(ag).sort((a, b) => b[1] - a[1]);
    const pos = sorted.findIndex(([id]) => String(id) === String(uid));
    if (pos < 0) return "";
    return `#${pos + 1} из ${sorted.length}`;
  }, [allProfits, uid]);

  const refUrl = `https://t.me/${TG_BOT}?start=ref_${uid}`;
  const refTxt = `t.me/${TG_BOT}?start=ref_${uid}`;

  const refEarned = useMemo(() => {
    const em: Record<string, number> = {};
    refP.forEach(
      (r) =>
        (em[String(r.referral_id)] =
          (em[String(r.referral_id)] || 0) + parseFloat(String(r.amount))),
    );
    return em;
  }, [refP]);

  const pct = parseFloat(String(me?.referral_percent ?? 1));
  const bal = parseFloat(String(me?.balance_usd ?? 0));
  const tag = me?.user_tag || "";
  const st = me?.status || "active";

  const copyRef = () => {
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(refUrl);
        showToast("Ссылка скопирована", "ok");
      } catch {
        const ta = document.createElement("textarea");
        ta.value = refUrl;
        ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          showToast("Ссылка скопирована", "ok");
        } catch {
          showToast("Не удалось скопировать", "error");
        }
        document.body.removeChild(ta);
      }
    };
    void copy();
    haptic("success");
  };

  const shareRef = () => {
    haptic("impact", "light");
    const tgShare = `https://t.me/share/url?url=${encodeURIComponent(refUrl)}&text=${encodeURIComponent("Присоединяйся к IRL — зарабатывай с нами!")}`;
    openTgUrl(tgShare);
  };

  return (
    <>
      <Reveal
        className="card hero tilt-wrap"
        style={{ marginTop: 12 }}
        outerRef={tilt.ref}
        onTouchMove={tilt.onTouchMove}
        onTouchEnd={tilt.onTouchEnd}
      >
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
        <div className="profile-hero-inner">
          <div className="profile-hero-kicker">Баланс</div>
          <div className="profile-hero-bal">{fmtUsd(bal)}</div>
          <div className="profile-hero-tag">{tag}</div>
          <div className="profile-hero-row">
            {st === "active" ? (
              <span className="badge badge--active">
                <span className="dot" />
                активен
              </span>
            ) : st === "pending" ? (
              <span className="badge badge--pend">
                <span className="dot" />
                ожидает
              </span>
            ) : (
              <span className="badge">{st}</span>
            )}
            {rank ? (
              <span
                style={{
                  fontFamily: "var(--fm)",
                  fontSize: 9,
                  color: "var(--t4)",
                }}
              >
                {rank}
              </span>
            ) : null}
          </div>
        </div>
      </Reveal>

      <Reveal className="bento bento-4 delay-1">
        <div className="bento-item">
          <div className="bento-val">{fmtRub(stats.totP)}</div>
          <div className="bento-lbl">Всего</div>
        </div>
        <div className="bento-item">
          <div className="bento-val">{fmtRub(stats.todP)}</div>
          <div className="bento-lbl">Сегодня</div>
        </div>
        <div className="bento-item">
          <div className="bento-val">{fmtRub(stats.wkP)}</div>
          <div className="bento-lbl">Неделя</div>
        </div>
        <div className="bento-item">
          <div className="bento-val">{fmtRub(stats.moP)}</div>
          <div className="bento-lbl">Месяц</div>
        </div>
      </Reveal>

      <Reveal className="sec delay-2">
        <span>Реферальная программа</span>
      </Reveal>
      <Reveal className="card card-2 delay-2">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--t2)" }}>
            Ваша ссылка
          </span>
          <span className="badge badge--blue">{pct}% с профитов рефов</span>
        </div>
        <div className="ref-link-box">
          <span className="ref-link-text">{refTxt}</span>
          <button type="button" className="ref-copy" onClick={copyRef}>
            Копировать
          </button>
        </div>
        <div className="ref-grid">
          <button
            type="button"
            className="btn btn--ghost"
            style={{ padding: 10, fontSize: 13 }}
            onClick={shareRef}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Поделиться в TG
          </button>
          <div className="ref-count-box">
            <div className="ref-count-val">{refs.length}</div>
            <div className="ref-count-lbl">рефов</div>
          </div>
        </div>
      </Reveal>

      <Reveal className="sec delay-3">
        <span>Рефералы</span>
      </Reveal>
      <div className="list">
        {refs.length === 0 ? (
          <EmptyState icon={IcoUsers} text="Нет рефералов" />
        ) : (
          refs.map((r) => {
            const e = refEarned[String(r.id)] || 0;
            const nm = r.full_name || `ID: ${r.id}`;
            const c = avatarColor(r.id);
            return (
              <Reveal key={String(r.id)}>
                <div className="li">
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
                    <div className="li-t">{nm}</div>
                    <div
                      className="li-s"
                      style={{
                        display: "flex",
                        gap: 5,
                        alignItems: "center",
                        marginTop: 3,
                      }}
                    >
                      {r.status === "active" ? (
                        <span className="badge badge--active">
                          <span className="dot" />
                          активен
                        </span>
                      ) : (
                        <span className="badge badge--pend">ожидает</span>
                      )}
                      {r.username ? ` · @${r.username}` : ""}
                    </div>
                  </div>
                  <div className="li-end" style={{ color: "var(--green)" }}>
                    +{fmtRub(e)}
                  </div>
                </div>
              </Reveal>
            );
          })
        )}
      </div>

      <Reveal className="sec" style={{ marginTop: 20 }}>
        <span>Наставники</span>
      </Reveal>
      <div id="mentorsList">
        {myMentors.length === 0 ? (
          <div className="empty">
            <div className="empty-icon" aria-hidden>
              {IcoPersonEmpty}
            </div>
            Наставник не назначен
          </div>
        ) : (
          myMentors.map((m) => {
            const mu = m.mu || {};
            const nm = mu.full_name || `ID:${m.user_id}`;
            const c = avatarColor(m.user_id);
            return (
              <Reveal key={String(m.id)}>
                <div className="mentor-li">
                  <div
                    className="mentor-av"
                    style={{
                      background: `${c}20`,
                      borderColor: `${c}40`,
                      color: c,
                    }}
                  >
                    {initials(nm)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "var(--t1)",
                      }}
                    >
                      {nm}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--t3)",
                        marginTop: 2,
                      }}
                    >
                      {mu.username ? `@${mu.username}` : ""}
                    </div>
                  </div>
                  <span className="badge badge--purple">
                    {m.service_name}
                  </span>
                </div>
              </Reveal>
            );
          })
        )}
      </div>
      <div style={{ height: 8 }} />
    </>
  );
}
