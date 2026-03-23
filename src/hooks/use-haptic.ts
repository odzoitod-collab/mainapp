"use client";

import { useCallback } from "react";

type HapticPattern = number | number[];

export function useHaptic() {
  const haptic = useCallback((pattern: HapticPattern = [8]) => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Silently degrade — vibration is non-critical
    }
  }, []);

  return haptic;
}

/** Predefined patterns for consistent tactile language */
export const HAPTIC = {
  nav:    [8],
  tap:    [6],
  paid:   [12, 40, 12],
  drag:   [4],
  error:  [20, 10, 20],
  success:[10],
} as const satisfies Record<string, number[]>;
