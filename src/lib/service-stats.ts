import type { MentorCatalogRow, ProfitRow } from "@/types/models";

export type ServiceStats = {
  profitCount: number;
  paidCount: number;
  pendingCount: number;
  totalAmount: number;
  totalNetProfit: number;
  uniqueWorkers: number;
  lastProfitAt: string | null;
};

function normName(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

function isPaidStatus(status: string | null | undefined): boolean {
  const u = (status ?? "").toLowerCase();
  return u === "paid" || u === "выплачено" || u === "completed" || u === "done";
}

export function computeServiceStats(
  serviceName: string | null | undefined,
  profits: ProfitRow[],
): ServiceStats {
  const key = normName(serviceName);
  const rows = profits.filter(
    (p) => normName(p.service_name ?? null) === key && key.length > 0,
  );
  let totalAmount = 0;
  let totalNetProfit = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let lastProfitAt: string | null = null;

  for (const p of rows) {
    totalAmount += Number(p.amount ?? 0);
    totalNetProfit += Number(p.net_profit ?? p.amount ?? 0);
    if (isPaidStatus(p.status)) paidCount += 1;
    else pendingCount += 1;
    const ca = p.created_at;
    if (ca && (!lastProfitAt || ca > lastProfitAt)) lastProfitAt = ca;
  }

  const workers = new Set(
    rows.map((p) => String(p.worker_id)).filter(Boolean),
  );

  return {
    profitCount: rows.length,
    paidCount,
    pendingCount,
    totalAmount,
    totalNetProfit,
    uniqueWorkers: workers.size,
    lastProfitAt,
  };
}

export function mentorsForService(
  serviceName: string | null | undefined,
  catalog: MentorCatalogRow[],
): MentorCatalogRow[] {
  const key = normName(serviceName);
  if (!key) return [];
  return catalog.filter((m) => normName(m.service_name ?? null) === key);
}
