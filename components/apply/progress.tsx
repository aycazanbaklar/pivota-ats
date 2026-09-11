"use client";

import { Check } from "lucide-react";
import { STEPS, TOTAL_STEPS } from "@/lib/application";

/**
 * Kompakt ilerleme göstergesi.
 * Durum yalnızca renkle değil; tamamlananda tik, güncelde dolu numara + kalın etiket,
 * sıradakinde ince çerçeveli numara ve "Adım x / 5" metniyle de ayrışır.
 */
export function ApplyProgress({
  step,
  maxVisited,
  onJump,
}: {
  step: number;
  maxVisited: number;
  onJump: (step: number) => void;
}) {
  const current = STEPS[step - 1];

  return (
    <div>
      {/* Mobil: sayı + metin + sayılabilir segmentler */}
      <div className="md:hidden">
        <p className="t-caption text-muted">
          <span className="text-ink font-semibold">
            Adım {step} / {TOTAL_STEPS}
          </span>{" "}
          · {current.label}
        </p>
        <ol className="mt-2 flex gap-1.5" aria-hidden="true">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className={`h-1 flex-1 rounded-full ${
                s.n <= step ? "bg-accent" : "bg-line"
              }`}
            />
          ))}
        </ol>
      </div>

      {/* Masaüstü: küçük numaralı göstergeler + ince bağlayıcı */}
      <div className="hidden md:block">
        <p className="t-caption text-muted mb-2">
          Adım {step} / {TOTAL_STEPS}
        </p>

        <ol className="flex items-center gap-2">
          {STEPS.map((s, index) => {
            const isDone = s.n < step;
            const isCurrent = s.n === step;
            const canJump = s.n <= maxVisited && !isCurrent;

            const marker = (
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] leading-none font-semibold ${
                  isCurrent
                    ? "border-accent bg-accent text-white"
                    : isDone
                      ? "border-accent bg-accent text-white"
                      : "border-line text-muted bg-surface"
                }`}
              >
                {isDone ? (
                  <Check className="size-3" aria-hidden="true" />
                ) : (
                  s.n
                )}
              </span>
            );

            const label = (
              <span
                className={`text-[13px] leading-none whitespace-nowrap ${
                  isCurrent ? "text-ink font-semibold" : "text-muted"
                }`}
              >
                {/* Güncel adım tam etiket, diğerleri kısa etiket — hiçbiri kırpılmaz */}
                {isCurrent ? s.label : s.short}
              </span>
            );

            return (
              <li key={s.n} className="flex min-w-0 items-center gap-2">
                {canJump ? (
                  <button
                    type="button"
                    onClick={() => onJump(s.n)}
                    className="hover:bg-ink/5 focus-visible:outline-accent -mx-1.5 flex min-w-0 items-center gap-2 rounded-[8px] px-1.5 py-3 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {marker}
                    {label}
                    <span className="sr-only">adımına dön</span>
                  </button>
                ) : (
                  <span
                    className="flex min-w-0 items-center gap-2 py-3"
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {marker}
                    {label}
                  </span>
                )}

                {index < STEPS.length - 1 ? (
                  <span
                    className={`h-px w-6 shrink-0 ${isDone ? "bg-accent" : "bg-line"}`}
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
