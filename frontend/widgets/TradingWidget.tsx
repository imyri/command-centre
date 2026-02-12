"use client";

import { useEffect, useState } from "react";

import { api } from "@/services/api/client";

type TradingPositions = {
  positions: Array<{ symbol: string; qty: number; avg_price: number }>;
};

export function TradingWidget() {
  const [data, setData] = useState<TradingPositions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<TradingPositions>("/trading/positions")
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "trading_fetch_failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200">Trading</div>
        <div className="text-xs text-zinc-500">/trading/positions</div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

      <div className="mt-3 space-y-2">
        {(data?.positions ?? []).length === 0 ? (
          <div className="text-sm text-zinc-500">—</div>
        ) : (
          (data?.positions ?? []).map((p) => (
            <div key={p.symbol} className="flex items-center justify-between rounded-lg bg-zinc-900/40 px-3 py-2">
              <div className="text-sm font-medium">{p.symbol}</div>
              <div className="text-xs text-zinc-400">
                qty {p.qty} • avg {p.avg_price}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

