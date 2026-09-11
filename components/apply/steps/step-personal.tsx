"use client";

import type { UseFormReturn } from "react-hook-form";
import type { ApplicationValues } from "@/lib/application";
import { EMAIL_PATTERN, isValidPhone } from "@/lib/application";
import {
  FieldShell,
  LinkedInFilledBanner,
  LinkedInImportButton,
  describedBy,
} from "../fields";

export function StepPersonal({
  form,
  linkedInStatus,
  onImportLinkedIn,
}: {
  form: UseFormReturn<ApplicationValues>;
  linkedInStatus: "idle" | "loading" | "done";
  onImportLinkedIn: () => void;
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const imported = watch("filledFromLinkedIn");

  return (
    <div className="flex flex-col gap-6">
      {imported ? (
        <LinkedInFilledBanner />
      ) : (
        <div className="border-line bg-canvas rounded-field flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
          <p className="t-caption text-muted">
            Bilgilerinizi tek tek yazmak yerine LinkedIn profilinizden
            aktarabilirsiniz.
          </p>
          <LinkedInImportButton
            status={linkedInStatus}
            onClick={onImportLinkedIn}
            className="shrink-0"
          />
        </div>
      )}

      <FieldShell
        id="fullName"
        label="Ad ve soyad"
        error={errors.fullName?.message}
      >
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          className="field"
          aria-invalid={errors.fullName ? true : undefined}
          aria-describedby={describedBy("fullName", undefined, errors.fullName?.message)}
          {...register("fullName", {
            required:
              "Ad soyad alanı boş. Size hitap edebilmemiz için ad ve soyadınızı yazın.",
          })}
        />
      </FieldShell>

      <FieldShell
        id="email"
        label="E-posta"
        hint="Başvuru sonucunu bu adrese ileteceğiz."
        error={errors.email?.message}
      >
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className="field"
          placeholder="ad@ornek.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy(
            "email",
            "Başvuru sonucunu bu adrese ileteceğiz.",
            errors.email?.message,
          )}
          {...register("email", {
            required:
              "E-posta adresi boş. Size dönüş yapabilmemiz için bir adres yazın.",
            pattern: {
              value: EMAIL_PATTERN,
              message:
                "E-posta adresi eksik görünüyor. @ ve alan adını içerecek şekilde yazın (örn. ad@ornek.com).",
            },
          })}
        />
      </FieldShell>

      <FieldShell
        id="phone"
        label="Telefon"
        error={errors.phone?.message}
      >
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="field"
          placeholder="0532 000 00 00"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={describedBy("phone", undefined, errors.phone?.message)}
          {...register("phone", {
            required:
              "Telefon numarası boş. Ön görüşme için ulaşabileceğimiz bir numara yazın.",
            validate: (value) =>
              isValidPhone(value) ||
              "Telefon numarası eksik görünüyor. Alan koduyla birlikte en az 10 hane yazın.",
          })}
        />
      </FieldShell>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <FieldShell
          id="city"
          label="Şehir"
          optional
        >
          <input
            id="city"
            type="text"
            autoComplete="address-level2"
            className="field"
            {...register("city")}
          />
        </FieldShell>

        <FieldShell
          id="linkedinUrl"
          label="LinkedIn profili"
          optional
        >
          <input
            id="linkedinUrl"
            type="text"
            className="field"
            placeholder="linkedin.com/in/kullanici"
            {...register("linkedinUrl")}
          />
        </FieldShell>
      </div>
    </div>
  );
}
