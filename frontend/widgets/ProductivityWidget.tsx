"use client";

import { useMemo, useState } from "react";

import { KanbanView } from "@/productivity/KanbanView";
import { ListView } from "@/productivity/ListView";
import { TimelineView } from "@/productivity/TimelineView";

type ViewKey = "list" | "kanban" | "timeline";

export function ProductivityWidget() {
  const [view, setView] = useState<ViewKey>("list");

  const content = useMemo(() => {
    switch (view) {
      case "kanban":
        return <KanbanView />;
      case "timeline":
        return <TimelineView />;
      case "list":
      default:
        return <ListView />;
    }
  }, [view]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-medium text-zinc-200">Productivity</div>
        <div className="flex items-center gap-2">
          <ViewButton active={view === "list"} onClick={() => setView("list")}>
            List
          </ViewButton>
          <ViewButton active={view === "kanban"} onClick={() => setView("kanban")}>
            Kanban
          </ViewButton>
          <ViewButton active={view === "timeline"} onClick={() => setView("timeline")}>
            Timeline
          </ViewButton>
        </div>
      </div>

      <div className="mt-4">{content}</div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg border px-3 py-1.5 text-xs font-medium",
        active ? "border-zinc-600 bg-zinc-900/60 text-zinc-100" : "border-zinc-800 bg-zinc-950/30 text-zinc-400 hover:text-zinc-200"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

