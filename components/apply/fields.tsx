"use client";

import type { ReactNode } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";

export function LinkedInGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94ZM21 14.13c0-3.5-1.87-5.13-4.36-5.13-2.01 0-2.91 1.11-3.41 1.88V8.5H9.85c.04.95 0 12.5 0 12.5h3.38v-6.98c0-.3.02-.6.11-.82.24-.61.79-1.24 1.72-1.24 1.22 0 1.7.93 1.7 2.28V21H21v-6.87Z" />
    </svg>
  );
}

export function LinkedInImportButton({
  status,
  onClick,
  className = "",
}: {
  status: "idle" | "loading" | "done";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "loading"}
      className={`btn btn-outline ${className}`}
    >
      {status === "loading" ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          LinkedIn&apos;e bağlanılıyor…
        </>
      ) : (
        <>
          <LinkedInGlyph className="size-4" />
          LinkedIn ile doldur
        </>
      )}
    </button>
  );
}

export function LinkedInFilledBanner() {
  return (
    <div className="border-success/30 bg-success-soft rounded-field flex items-start gap-3 border p-3">
      <span className="bg-success mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
        <Check className="size-3.5 text-white" aria-hidden="true" />
      </span>
      <p className="t-caption text-success-ink">
        <span className="font-semibold">LinkedIn&apos;den dolduruldu.</span>{" "}
        Bilgilerinizi kontrol edip düzenleyebilirsiniz.
      </p>
    </div>
  );
}

/**
 * Alan iskeleti: label tek satırlık sabit yükseklikte kalır, durum geri bildirimi
 * (autofill / hata / ipucu) her zaman input'un ALTINDA gösterilir.
 * Böylece aynı satırdaki input'lar hep aynı y ekseninden başlar.
 */
export function FieldShell({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="t-body flex min-h-[22px] items-center font-medium"
      >
        <span className="truncate">
          {label}
          {optional ? (
            <span className="text-muted font-normal"> (opsiyonel)</span>
          ) : null}
        </span>
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="t-caption text-danger-ink break-anywhere flex items-start gap-1.5"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="t-caption text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  return ids || undefined;
}

export function RadioGroupField({
  name,
  label,
  options,
  value,
  error,
  onChange,
  onBlur,
}: {
  name: string;
  label: string;
  options: readonly string[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="t-body break-anywhere mb-1 font-medium">{label}</legend>

      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const id = `${name}-${option}`;
          const selected = value === option;
          return (
            <label
              key={option}
              htmlFor={id}
              className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-field border px-3 py-2 transition-colors ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-field bg-surface hover:border-ink/40"
              }`}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                onBlur={onBlur}
                aria-describedby={error ? `${name}-error` : undefined}
                className="accent-accent size-4 shrink-0"
              />
              <span className="t-body break-anywhere">{option}</span>
            </label>
          );
        })}
      </div>

      {error ? (
        <p
          id={`${name}-error`}
          role="alert"
          className="t-caption text-danger-ink flex items-start gap-1.5"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </fieldset>
  );
}
