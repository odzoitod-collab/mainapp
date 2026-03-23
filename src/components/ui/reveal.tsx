"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
  type Ref,
  type TouchEvent,
} from "react";

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") ref(value);
  else (ref as MutableRefObject<T | null>).current = value;
}

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  outerRef?: Ref<HTMLDivElement | null>;
  onTouchMove?: (e: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (e: TouchEvent<HTMLDivElement>) => void;
};

export function Reveal({
  children,
  className = "",
  style,
  outerRef,
  onTouchMove,
  onTouchEnd,
}: Props) {
  const localRef = useRef<HTMLDivElement | null>(null);

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      localRef.current = el;
      assignRef(outerRef, el);
    },
    [outerRef],
  );

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.04 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={setRefs}
      className={`${className} rv`.trim()}
      style={style}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
}
