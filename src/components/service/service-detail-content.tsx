"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  IcoClock,
  IcoMentor,
  IcoStatProfit,
  IcoTrendUp,
} from "@/components/icons/app-icons";
import { ServiceIcon } from "@/components/service/service-icon";
import { fmtShortDate, fmtUsd } from "@/lib/format";
import {
  computeServiceStats,
  mentorsForService,
  type ServiceStats,
} from "@/lib/service-stats";
import type { MentorCatalogRow, ProfitRow, ServiceRow } from "@/types/models";

const HUB_COLS = ["#3b5bdb", "#7048e8", "#0ca678", "#e67700", "#c92a2a"];

function StatCard({
  label,
  value,
  sub,
  icon,
  compact,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`service-stat-card${compact ? " service-stat-card--compact" : ""}`.trim()}
    >
      <div className="service-stat-card__ico" aria-hidden>
        {icon}
      </div>
      <div className="service-stat-card__body">
        <div className="service-stat-card__val">{value}</div>
        <div className="service-stat-card__lbl">{label}</div>
        {sub ? <div className="service-stat-card__sub">{sub}</div> : null}
      </div>
    </div>
  );
}

function ServiceDescription({ text }: { text: string }) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const descId = useId();

  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el) return;
    if (!open) {
      setCanExpand(el.scrollHeight > el.clientHeight + 2);
    }
  }, [text, open]);

  return (
    <div className="service-detail-desc-wrap">
      <p
        ref={pRef}
        id={descId}
        className={`service-detail-head__desc${open ? " service-detail-head__desc--open" : ""}`.trim()}
      >
        {text}
      </p>
      {canExpand ? (
        <button
          type="button"
          className="service-detail-desc-more"
          aria-expanded={open}
          aria-controls={descId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Свернуть" : "Показать полностью"}
        </button>
      ) : null}
    </div>
  );
}

function mentorLabel(m: MentorCatalogRow): string {
  const n = m.mu?.full_name?.trim() || m.mu?.username?.trim();
  if (n) return n;
  return `ID ${m.user_id}`;
}

type Props = {
  service: ServiceRow;
  profits: ProfitRow[];
  mentorsCatalog: MentorCatalogRow[];
  colorIndex?: number;
};

export function ServiceDetailContent({
  service,
  profits,
  mentorsCatalog,
  colorIndex = 0,
}: Props) {
  const name = service.name ?? "Сервис";
  const stats: ServiceStats = computeServiceStats(name, profits);
  const mentors = mentorsForService(name, mentorsCatalog);
  const col = HUB_COLS[colorIndex % HUB_COLS.length];

  return (
    <>
      <div className="service-detail-head">
        <div
          className="service-detail-head__ico"
          style={{
            background: `${col}18`,
            borderColor: `${col}35`,
          }}
        >
          <ServiceIcon icon={service.icon} accent={col} />
        </div>
        <div className="service-detail-head__text">
          <h2 className="service-detail-head__title">{name}</h2>
          {service.description ? (
            <ServiceDescription text={service.description} />
          ) : null}
        </div>
      </div>

      <div className="service-detail-section">
        <div className="service-detail-section__title">
          Статистика по базе
        </div>
        <div className="service-stat-grid">
          <StatCard
            label="Всего профитов"
            value={String(stats.profitCount)}
            icon={<IcoTrendUp size={20} />}
          />
          <StatCard
            label="Сумма профитов"
            value={fmtUsd(stats.totalAmount)}
            sub="по всем статусам"
            icon={<IcoStatProfit size={20} />}
          />
        </div>
        {stats.lastProfitAt && (
          <div className="service-detail-lastdate">
            <IcoClock size={12} />
            <span>Последний профит: {fmtShortDate(stats.lastProfitAt)}</span>
          </div>
        )}
      </div>

      <div className="service-detail-section">
        <div className="service-detail-section__title">
          Наставники
          <span className="service-detail-section__badge">{mentors.length}</span>
        </div>
        {mentors.length === 0 ? (
          <p className="service-detail-empty">
            В каталоге наставников нет активных записей для этого сервиса.
          </p>
        ) : (
          <ul className="mentor-list">
            {mentors.map((m) => (
              <li key={String(m.id)} className="mentor-list__item">
                <div className="mentor-list__ico" aria-hidden>
                  <IcoMentor size={18} />
                </div>
                <div className="mentor-list__body">
                  <div className="mentor-list__name">{mentorLabel(m)}</div>
                  <div className="mentor-list__meta">
                    {m.percent != null ? `${m.percent}% · ` : null}
                    {m.students_count != null
                      ? `${m.students_count} учеников`
                      : "ученики — н/д"}
                    {m.rating != null && Number(m.rating) > 0
                      ? ` · ★ ${Number(m.rating).toFixed(1)}`
                      : null}
                  </div>
                  {m.total_earned != null && Number(m.total_earned) > 0 ? (
                    <div className="mentor-list__earn">
                      Заработано: {fmtUsd(m.total_earned)}
                    </div>
                  ) : null}
                </div>
                {m.channel_invite_link ? (
                  <a
                    href={m.channel_invite_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mentor-list__link"
                  >
                    Канал
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="service-detail-actions">
        {service.bot_link ? (
          <a
            href={service.bot_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Открыть бота
          </a>
        ) : null}
        {service.manual_link ? (
          <a
            href={service.manual_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            Мануал
          </a>
        ) : null}
      </div>
    </>
  );
}
