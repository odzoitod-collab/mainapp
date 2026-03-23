"use client";

import { useCallback, useRef } from "react";

export function useTilt() {
  const ref = useRef<HTMLDivElement>(null);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const el = ref.current;
    if (!el) return;
    const t = e.touches[0];
    const r = el.getBoundingClientRect();
    const x = (t.clientX - r.left) / r.width - 0.5;
    const y = (t.clientY - r.top) / r.height - 0.5;
    el.classList.add("tilting");
    el.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.008)`;
  }, []);

  const onTouchEnd = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("tilting");
    el.style.transform = "";
  }, []);

  return { ref, onTouchMove, onTouchEnd };
}
