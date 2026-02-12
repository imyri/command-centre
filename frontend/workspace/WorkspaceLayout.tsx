"use client";

import type { ReactNode } from "react";

type WorkspaceLayoutProps = {
  header?: ReactNode;
  left: ReactNode;
  right: ReactNode;
};

export function WorkspaceLayout({ header, left, right }: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-400">Personal Financial OS</div>
            <div className="text-xl font-semibold tracking-tight">Command Centre</div>
          </div>
          <div className="flex items-center gap-3">{header}</div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">{left}</div>
          <div className="lg:col-span-4">{right}</div>
        </div>
      </div>
    </div>
  );
}

