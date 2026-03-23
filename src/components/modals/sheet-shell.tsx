"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { IcoClose } from "@/components/icons/app-icons";
import { HAPTIC, useHaptic } from "@/hooks/use-haptic";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  variant?: "standard" | "immersive";
};

/** Trap focus inside `el` while open */
function useFocusTrap(
  elRef: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    const el = elRef.current;
    if (!el) return;

    const focusable = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',
        ),
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = focusable();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // Move focus into the sheet
    const firstFocusable = focusable()[0];
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 50);
    }

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [elRef, active]);
}

export function SheetShell({
  open,
  title,
  onClose,
  children,
  variant = "standard",
}: Props) {
  const immersive = variant === "immersive";
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const haptic = useHaptic();

  useFocusTrap(sheetRef, open);

  // ── Return focus to trigger element on close ──
  const triggerRef = useRef<Element | null>(null);
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
    } else if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [open]);

  // ── Swipe-to-close (Group 2.3) ──
  const dragState = useRef<{
    startY: number;
    startTime: number;
    dragging: boolean;
    moved: boolean;
    overlayEl: HTMLElement | null;
  } | null>(null);
  const suppressOverlayClickRef = useRef(false);

  const onDragStart = (e: React.TouchEvent) => {
    if (!sheetRef.current) return;
    suppressOverlayClickRef.current = true;
    haptic(HAPTIC.drag);
    dragState.current = {
      startY: e.touches[0].clientY,
      startTime: Date.now(),
      dragging: true,
      moved: false,
      overlayEl: sheetRef.current.parentElement,
    };
  };

  const onDragMove = (e: React.TouchEvent) => {
    if (!dragState.current?.dragging || !sheetRef.current) return;
    // Prevent browser from treating swipe as scroll/gesture while dragging the sheet.
    const dy = Math.max(0, e.touches[0].clientY - dragState.current.startY);
    if (dy > 6) {
      dragState.current.moved = true;
      if (e.cancelable) e.preventDefault();
    }
    sheetRef.current.style.transition = "none";
    sheetRef.current.style.transform = `translateY(${dy}px)`;
    const sheetH = sheetRef.current.offsetHeight;
    const progress = Math.min(dy / (sheetH * 0.6), 1);
    if (dragState.current.overlayEl) {
      dragState.current.overlayEl.style.opacity = String(0.6 * (1 - progress * 0.75));
    }
  };

  const onDragEnd = (e: React.TouchEvent) => {
    if (!dragState.current?.dragging || !sheetRef.current) return;
    const dy = Math.max(0, e.changedTouches[0].clientY - dragState.current.startY);
    if (dy > 6) dragState.current.moved = true;
    if (e.cancelable && dragState.current.moved) e.preventDefault();
    const dt = Date.now() - dragState.current.startTime;
    const velocity = dy / Math.max(dt, 1) * 1000; // px/s
    const sheetH = sheetRef.current.offsetHeight;

    sheetRef.current.style.transition = "";
    sheetRef.current.style.transform = "";
    if (dragState.current.overlayEl) {
      dragState.current.overlayEl.style.opacity = "";
    }
    dragState.current.dragging = false;

    if (velocity > 320 || dy > sheetH * 0.38) {
      onClose();
    }
  };

  // ── Escape key on overlay ──
  const handleOverlayKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className={`ov${open ? " open" : ""}${immersive ? " ov--immersive" : ""}`.trim()}
      role="presentation"
      onClick={() => {
        if (suppressOverlayClickRef.current) {
          suppressOverlayClickRef.current = false;
          return;
        }
        onClose();
      }}
      onKeyDown={handleOverlayKey}
    >
      <div
        ref={sheetRef}
        className={`sheet${immersive ? " sheet--immersive" : ""}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => { e.stopPropagation(); onDragEnd(e); }}
      >
        {/* Drag handle — full-width touch target */}
        <div
          className="sheet-drag"
          aria-hidden
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
          onTouchCancel={onDragEnd}
          style={{ cursor: "grab", padding: "12px 0 4px" }}
        />

        <div
          className={`sheet-hdr${immersive ? " sheet-hdr--immersive" : ""}`.trim()}
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
          onTouchCancel={onDragEnd}
        >
          <span className="sheet-title" id={titleId}>
            {title}
          </span>
          <button
            type="button"
            className={`sheet-x${immersive ? " sheet-x--immersive" : ""}`.trim()}
            onClick={onClose}
            aria-label={`Закрыть панель «${title}»`}
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <IcoClose size={15} />
          </button>
        </div>

        <div
          className={`sheet-body${immersive ? " sheet-body--immersive" : ""}`.trim()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
