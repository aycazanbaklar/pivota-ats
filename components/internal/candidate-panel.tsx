"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Building2, FileText, GraduationCap, MapPin, X } from "lucide-react";
import {
  SOURCE_LABELS,
  STAGES,
  activityTime,
  scoreTone,
  stageLabel,
  type Candidate,
  type StageId,
} from "@/lib/pipeline";
import type { RoleId } from "@/lib/roles";
import { StageChip } from "./stage-badge";

const SCORE_BAR = {
  strong: "bg-success",
  medium: "bg-warning",
  low: "bg-line",
} as const;

const CRITERIA = [
  { id: "teknik", label: "Teknik yetkinlik" },
  { id: "iletisim", label: "İletişim" },
  { id: "uyum", label: "Rol uyumu" },
] as const;

function InfoRow({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <li className="grid grid-cols-[20px_1fr] gap-x-3">
      <span className="flex h-[22px] items-center">
        <Icon className="text-muted size-4" aria-hidden="true" />
      </span>
      <span className="t-body text-muted break-anywhere">{children}</span>
    </li>
  );
}

function RatingRow({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: number | null;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset>
      <legend className="t-caption mb-2 font-medium">{label}</legend>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={`flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[8px] border text-[14px] font-semibold transition-colors ${
                selected
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface text-muted hover:border-ink/30"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CandidatePanel({
  candidate,
  role,
  onClose,
  onMove,
  onCompleteAction,
}: {
  candidate: Candidate;
  role: RoleId;
  onClose: () => void;
  onMove: (id: string, stage: StageId) => void;
  onCompleteAction: (id: string, summary: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [ratings, setRatings] = useState<Record<string, number | null>>({
    teknik: null,
    iletisim: null,
    uyum: null,
  });

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  const showScorecard =
    role === "yonetici" && candidate.pendingAction === "scorecard";
  const showApproval = role === "yonetici" && candidate.pendingAction === "onay";

  const allRated = CRITERIA.every((criteria) => ratings[criteria.id] !== null);

  const submitScorecard = () => {
    const values = CRITERIA.map((criteria) => ratings[criteria.id] ?? 0);
    const average = (
      values.reduce((total, value) => total + value, 0) / values.length
    ).toFixed(1);
    onCompleteAction(
      candidate.id,
      `Scorecard tamamlandı · ortalama ${average}/5`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Paneli kapat"
        onClick={onClose}
        className="bg-ink/40 absolute inset-0 cursor-default"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-panel-title"
        className="panel-enter bg-surface shadow-panel absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col"
      >
        <header className="border-line flex items-start gap-3 border-b px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2
              id="candidate-panel-title"
              className="t-h3 break-anywhere"
            >
              {candidate.name}
            </h2>
            <p className="t-caption text-muted break-anywhere mt-1">
              {candidate.headline}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Aday panelini kapat"
            className="text-muted hover:text-ink hover:bg-ink/5 -mt-1 -mr-2 grid size-11 shrink-0 place-items-center rounded-[10px]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip mono">{candidate.jobCode}</span>
            <span className="chip">{candidate.jobTitle}</span>
            <StageChip stage={candidate.stage} />
          </div>

          {/* Uyum skoru */}
          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="t-caption text-muted font-semibold tracking-wide uppercase">
                Uyum skoru
              </h3>
              <span className="t-caption text-muted">beta</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="t-h3 tabular-nums">{candidate.score}</span>
              <span className="text-muted t-caption">/ 100</span>
              <span
                className="bg-line ml-auto h-1.5 w-[140px] overflow-hidden rounded-full"
                aria-hidden="true"
              >
                <span
                  className={`block h-full rounded-full ${SCORE_BAR[scoreTone(candidate.score)]}`}
                  style={{ width: `${candidate.score}%` }}
                />
              </span>
            </div>
            <p className="t-caption text-muted mt-2">
              İlan gereksinimleriyle özgeçmiş eşleşmesinden üretilen bir ön
              sıralama sinyali. Değerlendirme yerine geçmez, kararı görüşme
              çıktıları belirler.
            </p>
          </section>

          {/* Aşama */}
          <section>
            <h3 className="t-caption text-muted font-semibold tracking-wide uppercase">
              Aşama
            </h3>
            <select
              aria-label="Aday aşaması"
              value={candidate.stage}
              onChange={(event) =>
                onMove(candidate.id, event.target.value as StageId)
              }
              className="field mt-2"
            >
              {STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>
            <p className="t-caption text-muted mt-2">
              Board&apos;da sürükleyerek de taşıyabilirsiniz.
            </p>
          </section>

          {/* Özet */}
          <section>
            <h3 className="t-caption text-muted font-semibold tracking-wide uppercase">
              Aday özeti
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5">
              <InfoRow icon={MapPin}>{candidate.location}</InfoRow>
              <InfoRow icon={Building2}>
                {candidate.experience} deneyim · {SOURCE_LABELS[candidate.source]}
              </InfoRow>
              <InfoRow icon={GraduationCap}>{candidate.education}</InfoRow>
            </ul>
          </section>

          {/* CV */}
          <section>
            <h3 className="t-caption text-muted font-semibold tracking-wide uppercase">
              Özgeçmiş
            </h3>
            <div className="border-line rounded-field mt-2 flex items-center gap-3 border p-3">
              <span className="bg-accent-soft grid size-10 shrink-0 place-items-center rounded-[8px]">
                <FileText className="text-accent size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span
                  className="t-body block truncate font-medium"
                  title={candidate.cvFileName}
                >
                  {candidate.cvFileName}
                </span>
                <span className="t-caption text-muted block">
                  {candidate.cvSize}
                </span>
              </span>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {candidate.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="t-body text-muted break-anywhere flex gap-3"
                >
                  <span
                    className="bg-muted mt-2.5 size-1.5 shrink-0 rounded-full"
                    aria-hidden="true"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Aktivite geçmişi */}
          <section>
            <h3 className="t-caption text-muted font-semibold tracking-wide uppercase">
              Aktivite geçmişi
            </h3>
            <ol className="mt-2 flex flex-col gap-3">
              {candidate.activity.map((entry, index) => (
                <li
                  key={`${entry.at ?? entry.hoursAgo}-${index}-${entry.text}`}
                  className="grid grid-cols-[20px_1fr] gap-x-3"
                >
                  <span className="flex h-[22px] items-center justify-center">
                    <span
                      className={`size-2 rounded-full ${index === 0 ? "bg-accent" : "bg-line"}`}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="t-body break-anywhere block">
                      {entry.text}
                    </span>
                    <span className="t-caption text-muted block">
                      {activityTime(entry)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Hiring Manager aksiyonu */}
        {showScorecard || showApproval ? (
          <div className="border-line bg-canvas border-t px-5 py-4">
            <h3 className="t-body font-semibold">
              {showScorecard ? "Scorecard" : "Teklif onayı"}
            </h3>
            <p className="t-caption text-muted mt-1">
              {candidate.name} · {candidate.jobTitle} · {today}
            </p>

            {showScorecard ? (
              <>
                <div className="mt-4 flex flex-col gap-4">
                  {CRITERIA.map((criteria) => (
                    <RatingRow
                      key={criteria.id}
                      label={criteria.label}
                      name={`rating-${criteria.id}`}
                      value={ratings[criteria.id]}
                      onChange={(value) =>
                        setRatings((current) => ({
                          ...current,
                          [criteria.id]: value,
                        }))
                      }
                    />
                  ))}
                </div>
                <button
                  type="button"
                  disabled={!allRated}
                  onClick={submitScorecard}
                  className="btn btn-primary mt-4 w-full"
                >
                  Scorecard&apos;ı gönder
                </button>
                {!allRated ? (
                  <p className="t-caption text-muted mt-2 text-center">
                    Üç başlığı da puanlayınca gönderebilirsiniz.
                  </p>
                ) : null}
              </>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onCompleteAction(
                      candidate.id,
                      `Teklif onaylandı · ${stageLabel(candidate.stage)}`,
                    );
                    onClose();
                  }}
                  className="btn btn-primary w-full"
                >
                  Teklifi onayla
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCompleteAction(
                      candidate.id,
                      "Teklif değerlendirmeye geri gönderildi",
                    );
                    onClose();
                  }}
                  className="btn btn-outline w-full"
                >
                  Değerlendirmeye geri gönder
                </button>
              </div>
            )}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
