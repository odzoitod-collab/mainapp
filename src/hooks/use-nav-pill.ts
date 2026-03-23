"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

export function useNavPill(activeIndex: number) {
  const navRef = useRef<HTMLElement | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const align = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const btns = nav.querySelectorAll(".nav-btn");
    const btn = btns[activeIndex] as HTMLElement | undefined;
    if (!btn) return;
    const navR = nav.getBoundingClientRect();
    const btnR = btn.getBoundingClientRect();
    setPill({ left: btnR.left - navR.left, width: btnR.width });
  }, [activeIndex]);

  useLayoutEffect(() => {
    align();
    const raf = requestAnimationFrame(() => {
      align();
      requestAnimationFrame(align);
    });
    return () => cancelAnimationFrame(raf);
  }, [align]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => align());
    ro.observe(nav);
    const onOri = () => setTimeout(align, 120);
    window.addEventListener("orientationchange", onOri);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", onOri);
    };
  }, [align]);

  return { navRef, pill };
}
