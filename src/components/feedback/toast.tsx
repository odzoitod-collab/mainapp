"use client";

import { useCallback, useId, useState } from "react";

export type ToastKind = "" | "ok" | "error" | "warn" | "info";

type ToastItem = {
  id: string;
  msg: string;
  kind: ToastKind;
  show: boolean;
};

const KIND_ICON: Record<ToastKind, string> = {
  "":      "ℹ",
  ok:      "✓",
  error:   "✕",
  warn:    "!",
  info:    "ℹ",
};

const KIND_LABEL: Record<ToastKind, string> = {
  "":      "Уведомление",
  ok:      "Успешно",
  error:   "Ошибка",
  warn:    "Внимание",
  info:    "Информация",
};

function ToastItem({ item }: { item: ToastItem }) {
  const id = useId();
  const kindClass = item.kind ? ` toast--${item.kind}` : "";
  return (
    <div
      className={`toast${kindClass}${item.show ? " show" : ""}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={`${KIND_LABEL[item.kind]}: ${item.msg}`}
      id={id}
    >
      <span className="toast-icon" aria-hidden>
        {KIND_ICON[item.kind]}
      </span>
      <span className="toast-msg">{item.msg}</span>
    </div>
  );
}

export function Toast({
  message,
  kind,
  visible,
}: {
  message: string;
  kind: ToastKind;
  visible: boolean;
}) {
  const item: ToastItem = {
    id: "single",
    msg: message,
    kind,
    show: visible,
  };
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      <ToastItem item={item} />
    </div>
  );
}

export function useToastState() {
  const [state, setState] = useState<{
    msg: string;
    kind: ToastKind;
    show: boolean;
  }>({ msg: "", kind: "", show: false });

  const showToast = useCallback(
    (msg: string, kind: ToastKind = "", dur = 2800) => {
      setState({ msg, kind, show: true });
      window.setTimeout(
        () => setState((s) => ({ ...s, show: false })),
        dur,
      );
    },
    [],
  );

  return { toast: state, showToast };
}
