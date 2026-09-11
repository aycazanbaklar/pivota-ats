"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { pipelineMetrics } from "@/lib/pipeline";
import { useInternal, type BoardFilter } from "./internal-context";
import { KanbanBoard } from "./kanban-board";
import { CandidatePanel } from "./candidate-panel";
import { PendingActions } from "./pending-actions";
import { KpiStrip } from "./kpi-strip";

const FILTER_LABELS: Record<Exclude<BoardFilter, "tumu">, string> = {
  "onay-bekleyen": "Onay bekleyen adaylar",
  "son-asama": "Teklif ve işe alım aşaması",
};

export function PipelineScreen({ view }: { view: "board" | "pending" }) {
  const {
    role,
    candidates,
    moveCandidate,
    completeAction,
    query,
    boardFilter,
    setBoardFilter,
  } = useInternal();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [jobFilter, setJobFilter] = useState("all");

  const selected = candidates.find((candidate) => candidate.id === selectedId);
  const pending = candidates.filter((candidate) => candidate.pendingAction);
  const metrics = pipelineMetrics(candidates);

  const jobs = useMemo(() => {
    const map = new Map<string, string>();
    candidates.forEach((candidate) => map.set(candidate.jobCode, candidate.jobTitle));
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1], "tr"));
  }, [candidates]);

  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr");

    return candidates.filter((candidate) => {
      if (term) {
        const haystack =
          `${candidate.name} ${candidate.jobTitle} ${candidate.jobCode}`.toLocaleLowerCase(
            "tr",
          );
        if (!haystack.includes(term)) return false;
      }
      if (jobFilter !== "all" && candidate.jobCode !== jobFilter) return false;
      if (boardFilter === "onay-bekleyen" && !candidate.pendingAction) {
        return false;
      }
      if (
        boardFilter === "son-asama" &&
        candidate.stage !== "teklif" &&
        candidate.stage !== "ise-alindi"
      ) {
        return false;
      }
      return true;
    });
  }, [candidates, query, jobFilter, boardFilter]);

  const filtersActive =
    query.trim() !== "" || jobFilter !== "all" || boardFilter !== "tumu";

  const panel = selected ? (
    <CandidatePanel
      candidate={selected}
      role={role.id}
      onClose={() => setSelectedId(null)}
      onMove={moveCandidate}
      onCompleteAction={completeAction}
    />
  ) : null;

  if (view === "pending") {
    return (
      <>
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="t-h1">Bekleyen Aksiyonlarınız</h1>
            <p className="t-body text-muted mt-2">
              {pending.length > 0
                ? `${pending.length} aday sizden onay veya scorecard bekliyor.`
                : "Şu an sizden beklenen bir aksiyon yok."}
            </p>
          </div>
          <Link
            href="/pipeline"
            className="btn btn-outline"
          >
            Tüm Pipeline&apos;ı Gör
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </header>

        <div className="mt-6">
          <PendingActions candidates={pending} onOpen={setSelectedId} />
        </div>

        {panel}
      </>
    );
  }

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-h1">Pipeline</h1>
          <p className="t-body text-muted mt-2">
            {role.title} görünümü · {candidates.length} aday, {jobs.length}{" "}
            pozisyon
          </p>
        </div>

        {role.id === "yonetici" ? (
          <Link href="/bekleyen-aksiyonlar" className="btn btn-outline">
            Bekleyen Aksiyonlarınız ({pending.length})
          </Link>
        ) : null}
      </header>

      {role.id === "mudur" ? (
        <div className="mt-6">
          <KpiStrip
            metrics={metrics}
            activeFilter={boardFilter}
            onSelect={setBoardFilter}
          />
        </div>
      ) : null}

      {/* Board araç çubuğu */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="w-[248px]">
          <select
            aria-label="Pozisyona göre filtrele"
            value={jobFilter}
            onChange={(event) => setJobFilter(event.target.value)}
            className={`field ${
              jobFilter !== "all"
                ? "border-accent text-ink font-medium"
                : "text-muted"
            }`}
          >
            <option value="all">Tüm pozisyonlar</option>
            {jobs.map(([code, title]) => (
              <option key={code} value={code}>
                {title}
              </option>
            ))}
          </select>
        </div>

        {boardFilter !== "tumu" ? (
          <button
            type="button"
            onClick={() => setBoardFilter("tumu")}
            className="border-accent bg-accent-soft text-accent flex min-h-11 items-center gap-2 rounded-[8px] border px-3 text-[13px] font-semibold"
          >
            {FILTER_LABELS[boardFilter]}
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">filtresini kaldır</span>
          </button>
        ) : null}

        <p className="t-caption text-muted ml-auto">
          {filtersActive
            ? `${visible.length} aday · ${candidates.length} içinde`
            : `${candidates.length} aday`}
        </p>
      </div>

      <div className="mt-4">
        <KanbanBoard
          candidates={visible}
          onOpen={setSelectedId}
          onMove={moveCandidate}
        />
      </div>

      {panel}
    </>
  );
}
