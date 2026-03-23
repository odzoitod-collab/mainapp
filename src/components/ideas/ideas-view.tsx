"use client";

import { useMemo } from "react";
import { getTelegram } from "@/lib/telegram";
import { useAppData } from "@/contexts/app-data-context";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import type { IdeaRow } from "@/types/models";
import { IdeaCard } from "./idea-card";

const IDEA_IMG =
  "https://cdn-icons-png.flaticon.com/512/4151/4151213.png";

const IcoBulb = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18h6M10 22h4" />
    <path d="M12 2a7 7 0 0 1 4 12.7V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.3A7 7 0 0 1 12 2z" />
  </svg>
);

type Props = {
  onOpenNewIdea: () => void;
};

export function IdeasView({ onOpenNewIdea }: Props) {
  const { ideas, uid, likeIdea, votePoll } = useAppData();

  const sorted = useMemo(
    () =>
      [...ideas].sort(
        (a, b) =>
          (b.votes_count ?? 0) - (a.votes_count ?? 0) ||
          new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime(),
      ),
    [ideas],
  );

  const totalVotes = useMemo(
    () => ideas.reduce((a, b) => a + (b.votes_count ?? 0), 0),
    [ideas],
  );

  const hSel = () => getTelegram()?.HapticFeedback?.selectionChanged();

  return (
    <>
      <Reveal className="banner" style={{ marginTop: 12 }}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4-3 5.5V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.5C6.2 13 5 11.4 5 9a7 7 0 0 1 7-7z" />
          <path d="M9 21h6" />
        </svg>
        <p>
          <strong>IRL Ideas</strong> — предлагайте улучшения, голосуйте. Нажмите
          на карточку, чтобы читать полностью.
        </p>
      </Reveal>

      <Reveal className="card hero ideas-hero">
        <div className="ideas-hero__glow" aria-hidden />
        <div
          className="deco deco-idea ideas-hero__deco"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IDEA_IMG}
            alt=""
            width={104}
            height={104}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="ideas-hero__inner">
          <div className="ideas-hero__kicker">Сводка раздела</div>
          <div className="ideas-hero__stats">
            <div className="ideas-stat">
              <div className="ideas-stat__lbl">Голосов</div>
              <div className="ideas-stat__val ideas-stat__val--accent">
                {totalVotes}
              </div>
            </div>
            <div className="ideas-stat__sep" aria-hidden />
            <div className="ideas-stat">
              <div className="ideas-stat__lbl">Идей</div>
              <div className="ideas-stat__val">{ideas.length}</div>
            </div>
          </div>
          <button
            type="button"
            className="idea-add-btn"
            onClick={() => {
              hSel();
              onOpenNewIdea();
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Новая идея
          </button>
        </div>
      </Reveal>

      <div style={{ paddingBottom: 16 }}>
        {sorted.length === 0 ? (
          <EmptyState icon={IcoBulb} text="Нет идей — нажмите +" />
        ) : (
          sorted.map((idea: IdeaRow) => (
            <Reveal key={String(idea.id)}>
              <IdeaCard
                idea={idea}
                uid={uid}
                onLike={(id) => {
                  hSel();
                  void likeIdea(id);
                }}
                onVote={(ideaId, i) => {
                  hSel();
                  void votePoll(ideaId, i);
                }}
              />
            </Reveal>
          ))
        )}
      </div>
    </>
  );
}
