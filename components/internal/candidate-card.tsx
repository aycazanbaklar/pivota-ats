"use client";

import { useDraggable } from "@dnd-kit/core";
import { Globe, Link2, Users } from "lucide-react";
import { LinkedInGlyph } from "@/components/apply/fields";
import {
  SOURCE_LABELS,
  relativeFromHours,
  scoreTone,
  type Candidate,
  type SourceId,
} from "@/lib/pipeline";

const SOURCE_ICONS: Record<
  SourceId,
  (props: { className?: string }) => React.ReactNode
> = {
  linkedin: ({ className }) => <LinkedInGlyph className={className} />,
  kariyer: ({ className }) => (
    <Globe className={className} aria-hidden="true" />
  ),
  referans: ({ className }) => (
    <Users className={className} aria-hidden="true" />
  ),
  website: ({ className }) => (
    <Link2 className={className} aria-hidden="true" />
  ),
};

const SCORE_STYLES = {
  strong: "bg-success-soft text-success-ink",
  medium: "bg-warning-soft text-warning-ink",
  low: "bg-canvas text-muted border border-line",
} as const;

export function ScorePill({ score }: { score: number }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-[6px] px-1.5 py-0.5 text-[12px] leading-none font-semibold tabular-nums ${
        SCORE_STYLES[scoreTone(score)]
      }`}
      title={`Uyum skoru ${score}/100`}
    >
      {score}
    </span>
  );
}

export function CandidateCardBody({ candidate }: { candidate: Candidate }) {
  const SourceIcon = SOURCE_ICONS[candidate.source];

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="t-body min-w-0 truncate font-semibold" title={candidate.name}>
          {candidate.name}
        </p>
        <ScorePill score={candidate.score} />
      </div>

      <p
        className="t-caption text-muted mt-1 truncate"
        title={candidate.jobTitle}
      >
        {candidate.jobTitle}
      </p>

      <div className="text-muted mt-3 flex items-center gap-2 text-[12px]">
        <span
          className="flex items-center gap-1"
          title={SOURCE_LABELS[candidate.source]}
        >
          <SourceIcon className="size-3.5 shrink-0" />
          <span className="sr-only">{SOURCE_LABELS[candidate.source]}</span>
        </span>
        <span aria-hidden="true">·</span>
        <span className="truncate">
          {relativeFromHours(candidate.lastActivityHours)}
        </span>
      </div>
    </>
  );
}

export function CandidateCard({
  candidate,
  onOpen,
}: {
  candidate: Candidate;
  onOpen: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: candidate.id });

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => onOpen(candidate.id)}
      style={
        transform
          ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            }
          : undefined
      }
      className={`border-line bg-surface hover:border-ink/25 focus-visible:outline-accent w-full cursor-grab rounded-[10px] border p-3 text-left transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing ${
        isDragging ? "opacity-40" : "hover:shadow-raise"
      }`}
      {...listeners}
      {...attributes}
      aria-label={`${candidate.name} — ${candidate.jobTitle}, uyum skoru ${candidate.score}. Detay panelini aç`}
    >
      <CandidateCardBody candidate={candidate} />
    </button>
  );
}
