"use client";

import { stageLabel, stageTone, type StageId, type StageTone } from "@/lib/pipeline";

/** Ölçülü aşama tonu — anlam her zaman metinle birlikte verilir, yalnız renkle değil */
const DOT: Record<StageTone, string> = {
  neutral: "bg-muted",
  info: "bg-accent/45",
  accent: "bg-accent",
  warning: "bg-warning",
  success: "bg-success",
};

export function StageDot({ stage }: { stage: StageId }) {
  return (
    <span
      className={`size-2 shrink-0 rounded-full ${DOT[stageTone(stage)]}`}
      aria-hidden="true"
    />
  );
}

export function StageChip({ stage }: { stage: StageId }) {
  return (
    <span className="chip">
      <StageDot stage={stage} />
      {stageLabel(stage)}
    </span>
  );
}
