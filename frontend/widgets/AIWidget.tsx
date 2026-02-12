"use client";

import { useEffect, useState } from "react";

import { api } from "@/services/api/client";

type AIStatus = {
  assistant: string;
  capabilities: string[];
};

export function AIWidget() {
  const [data, setData] = useState<AIStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<AIStatus>("/ai/status")
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "ai_fetch_failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-200">AI</div>
        <div className="text-xs text-zinc-500">/ai/status</div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-400">{error}</div> : null}

      <div className="mt-3 rounded-lg bg-zinc-900/40 p-3">
        <div className="text-xs text-zinc-400">Assistant</div>
        <div className="mt-1 text-sm font-medium">{data?.assistant ?? "—"}</div>
        <div className="mt-3 text-xs text-zinc-400">Capabilities</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {(data?.capabilities ?? []).length === 0 ? (
            <span className="text-sm text-zinc-500">—</span>
          ) : (
            (data?.capabilities ?? []).map((c) => (
              <span key={c} className="rounded-md border border-zinc-800 bg-zinc-950/40 px-2 py-1 text-xs text-zinc-200">
                {c}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

