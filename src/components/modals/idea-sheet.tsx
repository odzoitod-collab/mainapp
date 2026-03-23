"use client";

import { useState } from "react";
import { useAppData } from "@/contexts/app-data-context";

type Props = {
  open: boolean;
  onClose: () => void;
  showToast: (msg: string, kind?: "ok" | "error") => void;
};

export function IdeaSheet({ open, onClose, showToast }: Props) {
  const { submitIdea } = useAppData();
  const [cat, setCat] = useState("Идея");
  const [text, setText] = useState("");
  const [pollOpts, setPollOpts] = useState(["", ""]);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setCat("Идея");
    setText("");
    setPollOpts(["", ""]);
  };

  const addOpt = () => setPollOpts((o) => [...o, ""]);

  const onSubmit = async () => {
    setBusy(true);
    let content = text.trim();
    if (cat === "Опрос") {
      const opts = pollOpts.map((x) => x.trim()).filter(Boolean);
      if (opts.length < 2) {
        showToast("Минимум 2 варианта", "error");
        setBusy(false);
        return;
      }
      content = JSON.stringify({
        question: content,
        options: opts,
        votes: opts.map(() => 0),
        voters: opts.map(() => [] as string[]),
      });
    }
    if (!content) {
      setBusy(false);
      return;
    }
    const row = await submitIdea({ category: cat, content });
    setBusy(false);
    if (row) {
      reset();
      onClose();
    }
  };

  return (
    <div
      className={`ov${open ? " open" : ""}`.trim()}
      role="presentation"
      onClick={onClose}
    >
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag" aria-hidden />
        <div className="sheet-hdr">
          <span className="sheet-title">Новая запись</span>
          <button
            type="button"
            className="sheet-x"
            onClick={onClose}
            aria-label="Закрыть"
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
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="sheet-body">
          <select
            className="sel"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            aria-label="Тип записи"
          >
            <option value="Идея">Идея</option>
            <option value="Опрос">Опрос</option>
            <option value="Баг">Баг</option>
            <option value="Улучшение">Улучшение</option>
          </select>
          <textarea
            className="inp ta"
            rows={4}
            placeholder={cat === "Опрос" ? "Вопрос…" : "Опишите суть…"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {cat === "Опрос" ? (
            <div style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontFamily: "var(--fm)",
                  fontSize: 8,
                  color: "var(--t4)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Варианты ответа
              </div>
              {pollOpts.map((v, i) => (
                <input
                  key={i}
                  type="text"
                  className="inp poll-inp"
                  placeholder={`Вариант ${i + 1}`}
                  value={v}
                  onChange={(e) => {
                    const next = [...pollOpts];
                    next[i] = e.target.value;
                    setPollOpts(next);
                  }}
                />
              ))}
              <button
                type="button"
                className="btn btn--ghost"
                style={{ padding: 8, marginBottom: 8 }}
                onClick={addOpt}
              >
                + Вариант
              </button>
            </div>
          ) : null}
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={() => void onSubmit()}
          >
            {busy ? "Отправка…" : "Опубликовать"}
          </button>
        </div>
      </div>
    </div>
  );
}
