"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CircleDashed } from "lucide-react";
import { STAGES, stageLabel, type Candidate, type StageId } from "@/lib/pipeline";
import { CandidateCard, CandidateCardBody } from "./candidate-card";
import { StageDot } from "./stage-badge";

function Column({
  stage,
  label,
  candidates,
  onOpen,
}: {
  stage: StageId;
  label: string;
  candidates: Candidate[];
  onOpen: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <section className="flex w-[264px] shrink-0 flex-col">
      <header className="flex items-center justify-between gap-2 px-1 pb-2">
        <h3
          className="t-caption flex min-w-0 items-center gap-2 font-semibold"
          title={label}
        >
          <StageDot stage={stage} />
          <span className="truncate">{label}</span>
        </h3>
        <span className="bg-canvas border-line text-muted shrink-0 rounded-full border px-2 py-0.5 text-[12px] font-semibold tabular-nums">
          {candidates.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={`flex min-h-[160px] flex-1 flex-col gap-2 rounded-[12px] border p-2 transition-colors ${
          isOver
            ? "border-accent bg-accent-soft"
            : "border-line bg-canvas/60 border-dashed"
        }`}
      >
        {candidates.length === 0 ? (
          <div className="text-muted flex flex-1 flex-col items-center justify-center gap-2 px-3 py-8 text-center">
            <CircleDashed className="size-5" aria-hidden="true" />
            <p className="t-caption">Bu aşamada aday yok.</p>
          </div>
        ) : (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onOpen={onOpen}
            />
          ))
        )}
      </div>
    </section>
  );
}

export function KanbanBoard({
  candidates,
  onOpen,
  onMove,
}: {
  candidates: Candidate[];
  onOpen: (id: string) => void;
  onMove: (id: string, stage: StageId) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // Dokunmatikte "basılı tut → sürükle": kaydırmayla karışmasın
    useSensor(TouchSensor, {
      activationConstraint: { delay: 220, tolerance: 8 },
    }),
  );

  const active = candidates.find((candidate) => candidate.id === activeId);

  const nameOf = (id: string | number) =>
    candidates.find((candidate) => candidate.id === String(id))?.name ?? "Aday";

  /** Ekran okuyucu duyuruları — dnd-kit'in İngilizce/ham id varsayılanının yerine */
  const accessibility = {
    screenReaderInstructions: {
      draggable:
        "Aşamayı değiştirmek için kartı sürükleyip bir sütuna bırakın. Alternatif olarak kartı açıp aşama listesinden seçebilirsiniz.",
    },
    announcements: {
      onDragStart({ active: dragged }: { active: { id: string | number } }) {
        return `${nameOf(dragged.id)} kartı alındı.`;
      },
      onDragOver({
        active: dragged,
        over,
      }: {
        active: { id: string | number };
        over: { id: string | number } | null;
      }) {
        return over
          ? `${nameOf(dragged.id)}, ${stageLabel(over.id as StageId)} sütununun üzerinde.`
          : `${nameOf(dragged.id)} bir sütunun dışında.`;
      },
      onDragEnd({
        active: dragged,
        over,
      }: {
        active: { id: string | number };
        over: { id: string | number } | null;
      }) {
        return over
          ? `${nameOf(dragged.id)}, ${stageLabel(over.id as StageId)} aşamasına taşındı.`
          : `${nameOf(dragged.id)} taşınmadı, kart eski aşamasında kaldı.`;
      },
      onDragCancel({ active: dragged }: { active: { id: string | number } }) {
        return `${nameOf(dragged.id)} taşıma işlemi iptal edildi.`;
      },
    },
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active: dragged, over } = event;
    if (!over) return;
    onMove(String(dragged.id), over.id as StageId);
  };

  return (
    <DndContext
      accessibility={accessibility}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      {/* relative: kart içindeki sr-only span'ler kaydırma kabından taşıp sayfayı yatay kaydırmasın */}
      <div className="relative -mx-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
        <div className="flex min-w-max items-stretch gap-3">
          {STAGES.map((stage) => (
            <Column
              key={stage.id}
              stage={stage.id}
              label={stage.label}
              candidates={candidates.filter(
                (candidate) => candidate.stage === stage.id,
              )}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {active ? (
          <div className="border-accent bg-surface shadow-panel w-[248px] rotate-1 rounded-[10px] border p-3">
            <CandidateCardBody candidate={active} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
