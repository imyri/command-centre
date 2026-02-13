"use client";

import { useEffect, useState } from "react";

import { api } from "@/services/api/client";

type FinanceSummary = {
  cash: { currency: string; amount: number };
  net_worth: { currency: string; amount: number };
  updated_at: string | null;
};

export function FinanceWidget() {
  const [data, setData] = useState<FinanceSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<FinanceSummary>("/finance/summary")
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "finance_fetch_failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200">Finance</div>
        <div className="text-xs text-zinc-500">/finance/summary</div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-zinc-900/40 p-3">
          <div className="text-xs text-zinc-400">Cash</div>
          <div className="mt-1 text-lg font-semibold">
            {data ? `${data.cash.currency} ${data.cash.amount.toFixed(2)}` : "—"}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-900/40 p-3">
          <div className="text-xs text-zinc-400">Net Worth</div>
          <div className="mt-1 text-lg font-semibold">
            {data ? `${data.net_worth.currency} ${data.net_worth.amount.toFixed(2)}` : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

