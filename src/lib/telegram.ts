import { TG_BOT } from "./constants";

export type TelegramWebAppLike = {
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (c: string) => void;
  setBackgroundColor?: (c: string) => void;
  isVersionAtLeast?: (v: string) => boolean;
  disableVerticalSwipes?: () => void;
  enableClosingConfirmation?: () => void;
  /** Bot API 8.0+ */
  isFullscreen?: boolean;
  requestFullscreen?: () => void | Promise<void>;
  exitFullscreen?: () => void | Promise<void>;
  onEvent?: (eventType: string, eventHandler: () => void) => void;
  offEvent?: (eventType: string, eventHandler: () => void) => void;
  initDataUnsafe?: { user?: { id?: number; first_name?: string; photo_url?: string } };
  HapticFeedback?: {
    selectionChanged: () => void;
    impactOccurred: (s: "light" | "medium" | "heavy") => void;
    notificationOccurred: (s: "success" | "error" | "warning") => void;
  };
  openLink?: (url: string, opts?: Record<string, unknown>) => void;
  openTelegramLink?: (url: string) => void;
};

export function getTelegram(): TelegramWebAppLike | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Telegram?: { WebApp?: TelegramWebAppLike } })
    .Telegram?.WebApp;
}

export function initTelegramChrome(): void {
  const tg = getTelegram();
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.setHeaderColor?.("#060b16");
  tg.setBackgroundColor?.("#060b16");
  try {
    if (typeof tg.isVersionAtLeast === "function" && tg.isVersionAtLeast("7.7"))
      tg.disableVerticalSwipes?.();
  } catch {
    /* ignore */
  }
  try {
    if (typeof tg.isVersionAtLeast === "function" && tg.isVersionAtLeast("6.2"))
      tg.enableClosingConfirmation?.();
  } catch {
    /* ignore */
  }
}

export function openTgUrl(url: string): void {
  const w = getTelegram();
  if (!w) {
    window.location.href = url;
    return;
  }
  const hasOL = typeof w.openLink === "function";
  const hasOTL = typeof w.openTelegramLink === "function";
  if (hasOL) {
    try {
      w.openLink!(url, { try_browser: "internal" });
      return;
    } catch {
      /* continue */
    }
    try {
      w.openLink!(url, { try_instant_view: false });
      return;
    } catch {
      /* continue */
    }
    try {
      w.openLink!(url);
      return;
    } catch {
      /* continue */
    }
  }
  if (hasOTL) {
    try {
      w.openTelegramLink!(url);
      return;
    } catch {
      /* continue */
    }
  }
  window.location.href = url;
}

export function botDeepLink(start: string): void {
  openTgUrl(`https://t.me/${TG_BOT}?start=${start}`);
}
