export function fmtRub(n: unknown): string {
  return (
    new Intl.NumberFormat("ru-RU").format(Math.floor(Number(n || 0))) + " ₽"
  );
}

export function fmtUsd(n: unknown): string {
  return (
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(n || 0)) + "\u00A0$"
  );
}

export function fmtAmt(n: unknown): string {
  const x = Number(n || 0);
  return (
    new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(x) + " ₽"
  );
}

export function fmtDT(d: string | null | undefined): string {
  if (!d) return "—";
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return "—";
  return x.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function initials(name: string | undefined | null): string {
  return (name || "?")
    .replace(/[^a-zA-Zа-яА-Я ]/g, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AV_COLORS = [
  "#3b5bdb",
  "#7048e8",
  "#0ca678",
  "#e67700",
  "#c92a2a",
  "#a61e4d",
];

export function avatarColor(id: string | number): string {
  return AV_COLORS[Math.abs(parseInt(String(id), 10) || 0) % AV_COLORS.length];
}

export function fmtShortDate(d: string | null | undefined): string {
  const x = new Date(d || "");
  const now = new Date();
  const dl = x.toLocaleDateString("ru-RU");
  const tl = now.toLocaleDateString("ru-RU");
  const tm = x.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return dl === tl
    ? `Сегодня, ${tm}`
    : `${x.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })}, ${tm}`;
}

export function fmtTick(v: number): string {
  const n = Number(v);
  if (n >= 1e6)
    return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e4) return (n / 1e3).toFixed(0) + "k";
  if (n >= 1e3)
    return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return Math.round(n).toLocaleString("ru-RU");
}

export function excerpt(
  t: string | null | undefined,
  mx = 120,
): { s: string; more: boolean } {
  const s = String(t || "")
    .replace(/\s+/g, " ")
    .trim();
  if (s.length <= mx) return { s, more: false };
  return { s: s.slice(0, mx).trim() + "…", more: true };
}

export function caDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-CA");
}
