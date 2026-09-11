"use client";

import { Briefcase, TrendingUp, UserCheck } from "lucide-react";
import type { BoardFilter } from "./internal-context";

export function KpiStrip({
  metrics,
  activeFilter,
  onSelect,
}: {
  metrics: { openJobs: number; averageDaysToHire: number; pending: number };
  activeFilter: BoardFilter;
  onSelect: (filter: BoardFilter) => void;
}) {
  const tiles = [
    {
      id: "tumu" as const,
      icon: Briefcase,
      label: "Açık pozisyon",
      value: String(metrics.openJobs),
      hint: "Aday akışı olan ilan",
    },
    {
      id: "son-asama" as const,
      icon: TrendingUp,
      label: "Ortalama işe alım süresi",
      value: `${metrics.averageDaysToHire} gün`,
      hint: "Teklif ve işe alım aşaması",
    },
    {
      id: "onay-bekleyen" as const,
      icon: UserCheck,
      label: "Onay bekleyen aday",
      value: String(metrics.pending),
      hint: "Hiring manager aksiyonu",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {tiles.map((tile) => {
        const active = activeFilter === tile.id;
        return (
          <button
            key={tile.id}
            type="button"
            onClick={() => onSelect(tile.id)}
            aria-pressed={active}
            className={`focus-visible:outline-accent flex items-center gap-3 rounded-[12px] border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
              active
                ? "border-accent bg-accent-soft"
                : "border-line bg-surface hover:border-ink/25"
            }`}
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-[10px] ${
                active ? "bg-accent text-white" : "bg-canvas text-muted"
              }`}
            >
              <tile.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="t-caption text-muted block truncate">
                {tile.label}
              </span>
              <span className="t-h3 block tabular-nums">{tile.value}</span>
              <span className="t-caption text-muted block truncate">
                {tile.hint}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
