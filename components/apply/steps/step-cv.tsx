"use client";

import { useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { AlertCircle, FileText, Trash2, Upload } from "lucide-react";
import type { ApplicationValues } from "@/lib/application";
import { ACCEPTED_CV_EXTENSIONS } from "@/lib/application";
import { formatFileSize } from "@/lib/format";
import {
  FieldShell,
  LinkedInFilledBanner,
  LinkedInImportButton,
} from "../fields";

export function StepCv({
  form,
  linkedInStatus,
  onImportLinkedIn,
  onSelectFile,
  onRemoveFile,
  fileError,
  cvError,
}: {
  form: UseFormReturn<ApplicationValues>;
  linkedInStatus: "idle" | "loading" | "done";
  onImportLinkedIn: () => void;
  onSelectFile: (file: File) => void;
  onRemoveFile: () => void;
  fileError: string | null;
  cvError: string | null;
}) {
  const { register, watch } = form;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const cvName = watch("cvName");
  const cvSize = watch("cvSize");
  const imported = watch("filledFromLinkedIn");
  const error = fileError ?? cvError;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="t-body font-medium">CV yükleyin</h2>

        {cvName ? (
          <div className="border-line bg-surface rounded-field flex items-center gap-3 border p-3">
            <span className="bg-accent-soft flex size-10 shrink-0 items-center justify-center rounded-[8px]">
              <FileText className="text-accent size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="t-body block truncate font-medium" title={cvName}>
                {cvName}
              </span>
              <span className="t-caption text-muted block">
                {formatFileSize(cvSize)} · yüklendi
              </span>
            </span>
            <button
              type="button"
              onClick={onRemoveFile}
              className="btn btn-quiet size-11 shrink-0 p-0"
              aria-label={`${cvName} dosyasını kaldır`}
            >
              <Trash2 className="size-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              const file = event.dataTransfer.files?.[0];
              if (file) onSelectFile(file);
            }}
            className={`focus-within:border-accent focus-within:ring-accent/20 rounded-field flex cursor-pointer flex-col items-center gap-2 border border-dashed px-4 py-8 text-center transition-colors focus-within:ring-3 ${
              dragging
                ? "border-accent bg-accent-soft"
                : error
                  ? "border-danger bg-danger-soft/40"
                  : "border-field bg-surface hover:border-accent hover:bg-accent-soft/40"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              className="sr-only"
              accept={ACCEPTED_CV_EXTENSIONS.join(",")}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onSelectFile(file);
                event.target.value = "";
              }}
            />
            <Upload className="text-muted size-6" aria-hidden="true" />
            <span className="t-body font-medium">
              Dosya seçin veya sürükleyip bırakın
            </span>
            <span className="t-caption text-muted">
              PDF, JPEG veya Word · en fazla 5 MB
            </span>
          </label>
        )}

        {error ? (
          <p
            role="alert"
            className="t-caption text-danger-ink break-anywhere flex items-start gap-1.5"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        <span className="bg-line h-px flex-1" aria-hidden="true" />
        <span className="t-caption text-muted">veya</span>
        <span className="bg-line h-px flex-1" aria-hidden="true" />
      </div>

      {imported ? (
        <div className="flex flex-col gap-6">
          <LinkedInFilledBanner />

          <div className="grid items-start gap-6 md:grid-cols-2">
            <FieldShell
              id="headline"
              label="Güncel unvan"
            >
              <input id="headline" type="text" className="field" {...register("headline")} />
            </FieldShell>

            <FieldShell
              id="company"
              label="Şirket"
            >
              <input id="company" type="text" className="field" {...register("company")} />
            </FieldShell>

            <FieldShell
              id="experience"
              label="Toplam deneyim"
            >
              <input id="experience" type="text" className="field" {...register("experience")} />
            </FieldShell>

            <FieldShell
              id="education"
              label="Eğitim"
            >
              <input id="education" type="text" className="field" {...register("education")} />
            </FieldShell>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-2">
          <LinkedInImportButton
            status={linkedInStatus}
            onClick={onImportLinkedIn}
            className="w-full md:w-auto"
          />
          <p className="t-caption text-muted">
            Profilinizdeki ad, iletişim ve deneyim bilgileri forma aktarılır.
          </p>
        </div>
      )}
    </div>
  );
}
