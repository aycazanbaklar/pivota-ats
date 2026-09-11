"use client";

import { ChevronRight, Inbox } from "lucide-react";
import { relativeFromHours, type Candidate } from "@/lib/pipeline";
import { ScorePill } from "./candidate-card";

const ACTION_LABEL = {
  scorecard: "Scorecard bekleniyor",
  onay: "Teklif onayı bekleniyor",
} as const;

export function PendingActions({
  candidates,
  onOpen,
}: {
  candidates: Candidate[];
  onOpen: (id: string) => void;
}) {
  if (candidates.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <Inbox className="text-muted size-6" aria-hidden="true" />
        <p className="t-body font-medium">Bekleyen aksiyonunuz yok</p>
        <p className="t-caption text-muted max-w-[46ch]">
          Sizden onay veya scorecard beklenen bir aday olduğunda burada
          listelenir.
        </p>
      </div>
    );
  }

  return (
    <ul className="border-line bg-surface divide-line divide-y overflow-hidden rounded-[12px] border">
      {candidates.map((candidate) => (
        <li key={candidate.id}>
          <button
            type="button"
            onClick={() => onOpen(candidate.id)}
            className="hover:bg-canvas focus-visible:outline-accent flex w-full items-center gap-4 px-4 py-3 text-left focus-visible:-outline-offset-2 focus-visible:outline-2"
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span
                  className="t-body truncate font-semibold"
                  title={candidate.name}
                >
                  {candidate.name}
                </span>
                <ScorePill score={candidate.score} />
              </span>
              <span className="t-caption text-muted mt-0.5 block truncate">
                {candidate.jobTitle} · {candidate.jobCode}
              </span>
            </span>

            <span className="hidden shrink-0 sm:block">
              <span
                className={`chip ${
                  candidate.pendingAction === "onay"
                    ? "border-warning/30 bg-warning-soft text-warning-ink"
                    : "border-accent/30 bg-accent-soft text-accent"
                }`}
              >
                {candidate.pendingAction
                  ? ACTION_LABEL[candidate.pendingAction]
                  : ""}
              </span>
            </span>

            <span className="t-caption text-muted hidden w-[92px] shrink-0 text-right md:block">
              {relativeFromHours(candidate.lastActivityHours)}
            </span>

            <ChevronRight
              className="text-muted size-4 shrink-0"
              aria-hidden="true"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
