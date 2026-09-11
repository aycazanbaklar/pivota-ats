"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import type { ApplicationValues } from "@/lib/application";
import type { Job } from "@/lib/types";
import { FieldShell, RadioGroupField, describedBy } from "../fields";

export function StepQuestions({
  form,
  job,
}: {
  form: UseFormReturn<ApplicationValues>;
  job: Job;
}) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-8">
      {job.screeningQuestions.map((question) => {
        const error = errors.answers?.[question.id]?.message;

        if (question.type === "radio") {
          return (
            <Controller
              key={question.id}
              name={`answers.${question.id}`}
              control={control}
              rules={{
                required:
                  "Bu soru yanıtlanmadı. Devam etmek için bir seçenek seçin.",
              }}
              render={({ field, fieldState }) => (
                <RadioGroupField
                  name={field.name}
                  label={question.label}
                  options={question.options}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
          );
        }

        return (
          <FieldShell
            key={question.id}
            id={`answers-${question.id}`}
            label={question.label}
            error={error}
          >
            <select
              id={`answers-${question.id}`}
              className="field"
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(
                `answers-${question.id}`,
                undefined,
                error,
              )}
              {...register(`answers.${question.id}`, {
                required:
                  "Bu soru yanıtlanmadı. Devam etmek için listeden bir seçenek seçin.",
              })}
            >
              <option value="">Seçiniz</option>
              {question.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FieldShell>
        );
      })}

      <FieldShell
        id="note"
        label="Eklemek istediğiniz not"
        optional
        hint="Kısa tutabilirsiniz — değerlendirmede yalnızca ek bağlam olarak okunur."
      >
        <textarea
          id="note"
          rows={4}
          className="field resize-y"
          aria-describedby="note-hint"
          {...register("note")}
        />
      </FieldShell>
    </div>
  );
}
