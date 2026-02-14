"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { api } from "@/services/api/client";

type Position = {
  symbol: string;
  qty: number;
  avg_price: number;
};

type DataPoint = {
  time: string;
  value: number;
};

export function TradingWidget() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  // 1. Fetch the real positions from your Python Backend
  useEffect(() => {
    api.get<{ positions: Position[] }>("/trading/positions").then((data) => {
      setPositions(data.positions);
    });
  }, []);

  // 2. Simulate a "Live Market" chart
  // (In a real app, this would come from a database history)
  useEffect(() => {
    // Generate 20 fake data points that look like a stock chart
    const initialData = Array.from({ length: 20 }).map((_, i) => ({
      time: i.toString(),
      value: 15000 + Math.random() * 500 - 250, // Fluctuate around $15k
    }));
    setChartData(initialData);

    // Every 2 seconds, add a new point to make it move
    const interval = setInterval(() => {
      setChartData((current) => {
        const lastValue = current[current.length - 1].value;
        const newValue = lastValue + (Math.random() * 200 - 100); // Random move up/down
        return [...current.slice(1), { time: Date.now().toString(), value: newValue }];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-[300px] flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40">
      {/* Header */}
      <div className="absolute left-4 top-4 z-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <div className="text-sm font-medium text-zinc-200">Live Portfolio</div>
        </div>
        <div className="text-xs text-zinc-500">Real-time valuation</div>
      </div>

      {/* The Chart (Background) */}
      <div className="absolute inset-0 bottom-0 top-12 opacity-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
              itemStyle={{ color: '#60a5fa' }}
              labelStyle={{ display: 'none' }}
              formatter={(value: any) => [`$${Number(value || 0).toFixed(2)}`, "Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* The List of Stocks (Foreground) */}
      <div className="z-10 mt-auto p-4">
        <div className="space-y-2">
          {positions.map((p) => (
            <div key={p.symbol} className="flex items-center justify-between rounded-lg bg-zinc-900/60 px-3 py-2 backdrop-blur-sm border border-zinc-800/50">
              <span className="font-bold text-zinc-200">{p.symbol}</span>
              <div className="text-right">
                <div className="text-xs text-zinc-400">
                  {p.qty} qty • avg {p.avg_price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}