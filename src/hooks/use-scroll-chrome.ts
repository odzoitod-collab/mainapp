"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollChrome() {
  const lastY = useRef(0);
  const hiddenRef = useRef(false);
  const [hdrHidden, setHdrHidden] = useState(false);
  const [hdrScrolled, setHdrScrolled] = useState(false);
  const [searchHidden, setSearchHidden] = useState(false);

  const resetChrome = useCallback(() => {
    hiddenRef.current = false;
    setHdrHidden(false);
    setSearchHidden(false);
  }, []);

  useEffect(() => {
    let ticking = false;

    const processScroll = () => {
      const y = window.scrollY;
      setHdrScrolled(y > 50);
      if (y > lastY.current + 8 && !hiddenRef.current && y > 80) {
        hiddenRef.current = true;
        setHdrHidden(true);
        setSearchHidden(true);
      } else if (y < lastY.current - 6 && hiddenRef.current) {
        hiddenRef.current = false;
        setHdrHidden(false);
        setSearchHidden(false);
      }
      lastY.current = Math.max(0, y);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(processScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { hdrHidden, hdrScrolled, searchHidden, resetChrome };
}
