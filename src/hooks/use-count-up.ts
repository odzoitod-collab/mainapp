"use client";

import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates a numeric value from its previous value to `target`.
 * On first mount, animates from 0.
 */
export function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const prevTarget = useRef<number>(0);

  useEffect(() => {
    // Skip animation if motion is reduced
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      prevTarget.current = target;
      let raf: number | null = null;
      if (typeof window.requestAnimationFrame === "function") {
        raf = window.requestAnimationFrame(() => setValue(target));
      } else {
        window.setTimeout(() => setValue(target), 0);
      }
      return () => {
        if (raf != null) window.cancelAnimationFrame(raf);
      };
    }

    const from = prevTarget.current;
    const startTs = performance.now();

    const step = (ts: number) => {
      const elapsed = ts - startTs;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = from + (target - from) * eased;
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(target);
        prevTarget.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}
