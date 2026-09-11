"use client";

import type { UseFormReturn } from "react-hook-form";
import { AlertCircle, Shield } from "lucide-react";
import type { ApplicationValues } from "@/lib/application";
import type { Job } from "@/lib/types";

function SummaryRow({
  label,
  value,
  onEdit,
  editLabel,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  editLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <dt className="t-caption text-muted">{label}</dt>
        <dd className="t-body break-anywhere mt-0.5">{value}</dd>
      </div>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="text-accent hover:bg-accent-soft focus-visible:outline-accent -mr-2 -my-2 flex min-h-11 shrink-0 items-center rounded-[8px] px-2 text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Düzenle
          <span className="sr-only"> — {editLabel}</span>
        </button>
      ) : null}
    </div>
  );
}

export function StepConsent({
  form,
  job,
  onEditStep,
  onOpenKvkk,
}: {
  form: UseFormReturn<ApplicationValues>;
  job: Job;
  onEditStep: (step: number) => void;
  onOpenKvkk: () => void;
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const values = watch();
  const answered = job.screeningQuestions.filter(
    (question) => values.answers?.[question.id],
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="t-caption text-muted font-semibold tracking-wide uppercase">
          Başvuru özeti
        </h2>
        <dl className="divide-line border-line mt-3 divide-y border-y">
          <SummaryRow label="Pozisyon" value={`${job.code} · ${job.title}`} />
          <SummaryRow
            label="Ad ve soyad"
            value={values.fullName || "—"}
            onEdit={() => onEditStep(2)}
            editLabel="kişisel bilgiler"
          />
          <SummaryRow
            label="İletişim"
            value={[values.email, values.phone].filter(Boolean).join(" · ") || "—"}
            onEdit={() => onEditStep(2)}
            editLabel="kişisel bilgiler"
          />
          <SummaryRow
            label="CV"
            value={
              values.cvName ||
              (values.filledFromLinkedIn
                ? "LinkedIn profili aktarıldı"
                : "—")
            }
            onEdit={() => onEditStep(3)}
            editLabel="CV ve profil"
          />
          <SummaryRow
            label="Ön eleme soruları"
            value={`${answered} / ${job.screeningQuestions.length} soru yanıtlandı`}
            onEdit={() => onEditStep(4)}
            editLabel="ön eleme soruları"
          />
        </dl>
      </section>

      <section>
        <h2 className="t-caption text-muted font-semibold tracking-wide uppercase">
          Kişisel verilerin korunması
        </h2>

        <div className="mt-3">
          <div className="grid grid-cols-[20px_1fr] gap-x-3">
            <span className="flex h-[22px] items-center">
              <Shield className="text-muted size-4" aria-hidden="true" />
            </span>
            <p className="t-body text-muted max-w-[62ch]">
              Paylaştığınız bilgiler yalnızca bu başvuru için Pivota
              sunucularında işlenir, üçüncü taraflarla paylaşılmaz ve saklama
              süresi dolduğunda silinir.{" "}
              <button
                type="button"
                onClick={onOpenKvkk}
                className="text-accent focus-visible:outline-accent rounded-[4px] font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Aydınlatma metninin tamamını okuyun
              </button>
            </p>
          </div>

          <label
            htmlFor="kvkk"
            className={`mt-4 flex cursor-pointer items-start gap-3 rounded-field border p-3 transition-colors ${
              errors.kvkk
                ? "border-danger bg-danger-soft/40"
                : values.kvkk
                  ? "border-accent bg-accent-soft"
                  : "border-field bg-surface hover:border-ink/40"
            }`}
          >
            <input
              id="kvkk"
              type="checkbox"
              className="accent-accent mt-0.5 size-5 shrink-0"
              aria-invalid={errors.kvkk ? true : undefined}
              aria-describedby={errors.kvkk ? "kvkk-error" : undefined}
              {...register("kvkk", {
                required:
                  "Onay kutusu işaretlenmedi. Başvuruyu göndermek için aydınlatma metnini onaylayın.",
              })}
            />
            <span className="t-body">
              Aydınlatma metnini okudum, kişisel verilerimin bu başvuru
              kapsamında işlenmesini onaylıyorum.
            </span>
          </label>

          {errors.kvkk ? (
            <p
              id="kvkk-error"
              role="alert"
              className="t-caption text-danger-ink mt-2 flex items-start gap-1.5"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{errors.kvkk.message}</span>
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
