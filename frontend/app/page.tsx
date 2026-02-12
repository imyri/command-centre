import { AIWidget } from "@/widgets/AIWidget";
import { FinanceWidget } from "@/widgets/FinanceWidget";
import { ProductivityWidget } from "@/widgets/ProductivityWidget";
import { TradingWidget } from "@/widgets/TradingWidget";
import { WorkspaceLayout } from "@/workspace/WorkspaceLayout";

export default function Page() {
  return (
    <WorkspaceLayout
      header={
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-md border border-zinc-800 bg-zinc-950/40 px-2 py-1">local-first</span>
          <span className="rounded-md border border-zinc-800 bg-zinc-950/40 px-2 py-1">port 3000</span>
        </div>
      }
      left={
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FinanceWidget />
            <TradingWidget />
          </div>
          <ProductivityWidget />
        </div>
      }
      right={
        <div className="grid grid-cols-1 gap-6">
          <AIWidget />
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="text-sm font-medium text-zinc-200">System</div>
            <div className="mt-2 text-xs text-zinc-500">
              Backend: <span className="text-zinc-300">http://localhost:8000</span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Frontend: <span className="text-zinc-300">http://localhost:3000</span>
            </div>
            <div className="mt-3 text-xs text-zinc-600">
              Configure API URL via <span className="text-zinc-400">NEXT_PUBLIC_API_BASE_URL</span>.
            </div>
          </div>
        </div>
      }
    />
  );
}

