"use client";

export function Loader({ visible }: { visible: boolean }) {
  return (
    <div
      className={`ldr${!visible ? " ldr--hidden" : ""}`.trim()}
      aria-busy={visible}
      aria-hidden={!visible}
    >
      <div className="ldr-spin" aria-hidden>
        <svg className="ldr-ring" viewBox="0 0 40 40">
          <circle className="track" cx="20" cy="20" r="16" />
          <circle
            className="arc"
            cx="20"
            cy="20"
            r="16"
            strokeDasharray="62 38"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="ldr-txt">Синхронизация</div>
    </div>
  );
}
