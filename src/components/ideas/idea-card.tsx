"use client";

import { useMemo, useState } from "react";
import { excerpt, fmtShortDate, initials } from "@/lib/format";
import type { IdeaRow, PollPayload } from "@/types/models";

type Props = {
  idea: IdeaRow;
  uid: number;
  onLike: (id: string | number) => void;
  onVote: (ideaId: string | number, optionIndex: number) => void;
};

function parsePoll(content: string | null | undefined): PollPayload | null {
  if (!content) return null;
  try {
    return JSON.parse(content) as PollPayload;
  } catch {
    return null;
  }
}

export function IdeaCard({ idea, uid, onLike, onVote }: Props) {
  const [expanded, setExpanded] = useState(false);
  const uidStr = String(uid);
  const liked = idea.liked_by?.includes(uidStr) ?? false;

  const isPoll = idea.category === "Опрос";
  const poll = useMemo(
    () => (isPoll ? parsePoll(idea.content || "") : null),
    [isPoll, idea.content],
  );

  const excerptText = useMemo(() => {
    if (isPoll && poll) return excerpt(poll.question || "", 100);
    return excerpt(idea.content || "", 120);
  }, [isPoll, poll, idea.content]);

  if (isPoll && !poll) {
    return (
      <div className="card" style={{ padding: 15 }}>
        <div style={{ color: "var(--t4)", fontSize: 13 }}>Опрос повреждён</div>
      </div>
    );
  }

  const pollTotal =
    poll?.votes.reduce((a, b) => a + b, 0) ?? 0;

  return (
    <div className="card" style={{ padding: 15 }} data-poll={isPoll ? "1" : "0"}>
      <div className="idea-card-head">
        <div className="idea-card-user">
          <div className="idea-av">{initials(idea.user_name)}</div>
          <div className="idea-card-meta">
            <div className="idea-card-name">{idea.user_name}</div>
            <div className="idea-card-date">
              {fmtShortDate(idea.created_at)}
            </div>
          </div>
        </div>
        <span className="idea-cat">{idea.category}</span>
      </div>

      {isPoll && poll ? (
        <>
          {!expanded ? (
            <div className="idea-prev">
              {excerptText.s}
              <span
                style={{
                  display: "block",
                  fontSize: 10,
                  color: "var(--t4)",
                  marginTop: 5,
                }}
              >
                Опрос · {poll.options.length} вариантов
              </span>
            </div>
          ) : (
            <div className="poll">
              <div className="poll-q">{poll.question}</div>
              {poll.options.map((o, i) => {
                const vd = poll.voters[i]?.includes(uidStr);
                const pc =
                  pollTotal === 0 ? 0 : (poll.votes[i] / pollTotal) * 100;
                return (
                  <button
                    type="button"
                    key={i}
                    className={`poll-o${vd ? " vd" : ""}`.trim()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onVote(idea.id, i);
                    }}
                  >
                    <div className="poll-bar" style={{ width: `${pc}%` }} />
                    <div className="poll-row">
                      <span>{o}</span>
                      <span>{poll.votes[i]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <button
            type="button"
            className="idea-more"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Свернуть" : "Развернуть опрос"}
          </button>
        </>
      ) : (
        <>
          {!expanded ? (
            <div
              className="idea-prev"
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--t2)",
                wordBreak: "break-word",
              }}
            >
              {excerptText.s}
            </div>
          ) : (
            <div
              className="idea-full"
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                whiteSpace: "pre-wrap",
                color: "var(--t2)",
              }}
            >
              {idea.content}
            </div>
          )}
          {excerptText.more ? (
            <button
              type="button"
              className="idea-more"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Свернуть" : "Читать полностью"}
            </button>
          ) : null}
        </>
      )}

      <div className="idea-card-foot">
        <button
          type="button"
          className="like-btn"
          style={{ color: liked ? "var(--red)" : "var(--t4)" }}
          onClick={(e) => {
            e.stopPropagation();
            onLike(idea.id);
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{idea.votes_count ?? 0}</span>
        </button>
        <span
          style={{
            fontFamily: "var(--fm)",
            fontSize: 7,
            color: "var(--t4)",
            letterSpacing: "0.12em",
          }}
        >
          IRL
        </span>
      </div>
    </div>
  );
}
