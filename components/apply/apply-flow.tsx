"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useForm, type Path } from "react-hook-form";
import { Check, ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import type { Job } from "@/lib/types";
import {
  type ApplicationValues,
  STEPS,
  clearDraft,
  createApplicationNumber,
  emptyValues,
  linkedInProfile,
  readDraft,
  validateCvFile,
  writeDraft,
} from "@/lib/application";
import { SiteHeader } from "@/components/site-header";
import { getSupabase, oauthConfigured } from "@/lib/supabase/client";
import { candidateTextFrom, matchScore } from "@/lib/match";
import { ApplyProgress } from "./progress";
import { KvkkDialog } from "./kvkk-dialog";
import { SuccessView } from "./success-view";
import { StepIntro } from "./steps/step-intro";
import { StepPersonal } from "./steps/step-personal";
import { StepCv } from "./steps/step-cv";
import { StepQuestions } from "./steps/step-questions";
import { StepConsent } from "./steps/step-consent";

const PERSONAL_KEYS = [
  "fullName",
  "email",
  "phone",
  "city",
  "linkedinUrl",
] as const;

export function ApplyFlow({ job }: { job: Job }) {
  const profile = linkedInProfile(job);

  const [step, setStep] = useState(1);
  const [maxVisited, setMaxVisited] = useState(1);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [linkedInStatus, setLinkedInStatus] = useState<"idle" | "loading" | "done">("idle");
  const [fileError, setFileError] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [kvkkOpen, setKvkkOpen] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const submittedRef = useRef(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const importTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<ApplicationValues>({
    mode: "onTouched",
    defaultValues: emptyValues(job),
  });
  const { getValues, setValue, reset, trigger, handleSubmit, watch } = form;
  const values = watch();

  /* ---------- Taslağı geri yükle ---------- */
  useEffect(() => {
    const draft = readDraft(job.code);
    if (draft) {
      reset(draft.values);
      setStep(draft.step);
      setMaxVisited(draft.step);
      setDraftRestored(true);
      if (draft.values.filledFromLinkedIn) setLinkedInStatus("done");
    }
    setHydrated(true);
  }, [job.code, reset]);

  /* ---------- Taslağı otomatik kaydet ---------- */
  useEffect(() => {
    if (!hydrated || applicationNumber) return;
    const timer = setTimeout(() => {
      // Gönderimden sonra bekleyen zamanlayıcı silinen taslağı geri yazmasın
      if (submittedRef.current) return;
      writeDraft(job.code, { step, values: getValues(), savedAt: Date.now() });
    }, 400);
    return () => clearTimeout(timer);
  }, [values, step, hydrated, applicationNumber, job.code, getValues]);

  /* ---------- Adım değişince başlığa odaklan ---------- */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [step]);

  useEffect(
    () => () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
      if (importTimer.current) clearTimeout(importTimer.current);
    },
    [],
  );


  const goTo = (next: number) => {
    setStep(next);
    setMaxVisited((current) => Math.max(current, next));
  };

  /* ---------- LinkedIn ile doldur ---------- */
  const importLinkedIn = () => {
    // OAuth anahtarı tanımlı olsaydı sağlayıcıya yönlendirilirdi; boş olduğu için
    // gerçek OAuth denenmez, bilinen mock doldurma davranışına düşülür.
    if (oauthConfigured.linkedin) {
      setSubmitNotice(
        "LinkedIn OAuth bu ortamda yapılandırılmadı; bilgiler profil verisinden dolduruldu.",
      );
    }
    setLinkedInStatus("loading");
    importTimer.current = setTimeout(() => {
      PERSONAL_KEYS.forEach((key) => {
        // Adayın kendi yazdığı bilgiyi ezmeden yalnızca boş alanları doldur
        if (!getValues(key)?.trim()) {
          setValue(key, profile[key], { shouldDirty: true, shouldValidate: true });
        }
      });
      setValue("headline", profile.headline, { shouldDirty: true });
      setValue("company", profile.company, { shouldDirty: true });
      setValue("experience", profile.experience, { shouldDirty: true });
      setValue("education", profile.education, { shouldDirty: true });
      setValue("filledFromLinkedIn", true, { shouldDirty: true });
      setLinkedInStatus("done");
      setCvError(null);
    }, 900);
  };

  /* ---------- CV dosyası ---------- */
  const selectFile = (file: File) => {
    const error = validateCvFile(file);
    if (error) {
      setFileError(error);
      return;
    }
    setFileError(null);
    setCvError(null);
    setValue("cvName", file.name, { shouldDirty: true });
    setValue("cvSize", file.size, { shouldDirty: true });
  };

  const removeFile = () => {
    setValue("cvName", "", { shouldDirty: true });
    setValue("cvSize", 0, { shouldDirty: true });
    setFileError(null);
  };

  /* ---------- Adım doğrulama ---------- */
  const stepFields: Record<number, Path<ApplicationValues>[]> = {
    2: ["fullName", "email", "phone"],
    4: job.screeningQuestions.map(
      (question) => `answers.${question.id}` as Path<ApplicationValues>,
    ),
  };

  const goNext = async () => {
    if (step === 3) {
      const current = getValues();
      if (!current.cvName && !current.filledFromLinkedIn) {
        setCvError(
          "CV yüklenmedi. PDF, JPEG veya Word dosyanızı yükleyin ya da LinkedIn ile doldurun.",
        );
        return;
      }
    }

    const fields = stepFields[step];
    if (fields?.length) {
      const valid = await trigger(fields, { shouldFocus: true });
      if (!valid) return;
    }

    goTo(step + 1);
  };

  const saveForLater = () => {
    writeDraft(job.code, { step, values: getValues(), savedAt: Date.now() });
    setDraftSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setDraftSaved(false), 5000);
  };

  const onSubmit = () => {
    submittedRef.current = true;
    const values = getValues();
    const number = createApplicationNumber();

    // CV/profil metni ile ilan gereksinimleri arasında hafif anahtar kelime eşleşmesi
    const score = matchScore(candidateTextFrom(values), {
      title: job.title,
      requirements: job.requirements,
      niceToHave: job.niceToHave,
    });

    clearDraft(job.code);
    setApplicationNumber(number);
    window.scrollTo({ top: 0, behavior: "auto" });

    void getSupabase()
      .from("applications")
      .insert({
        application_number: number,
        job_code: job.code,
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        city: values.city,
        linkedin_url: values.linkedinUrl,
        headline: values.headline,
        company: values.company,
        experience: values.experience,
        education: values.education,
        cv_file_name: values.cvName,
        filled_from_linkedin: values.filledFromLinkedIn,
        answers: values.answers,
        note: values.note,
        kvkk_accepted: values.kvkk,
        match_score: score,
      })
      .then(({ error }) => {
        if (error) {
          setSubmitNotice(
            "Başvurunuz bu cihazda kaydedildi ancak sunucuya iletilemedi. Başvuru numaranızla bize ulaşabilirsiniz.",
          );
        }
      });
  };

  const onInvalid = () => {
    const errors = form.formState.errors;
    if (errors.fullName || errors.email || errors.phone) {
      goTo(2);
      return;
    }
    if (errors.answers) {
      goTo(4);
    }
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step < STEPS.length) {
      event.preventDefault();
      void goNext();
      return;
    }
    void handleSubmit(onSubmit, onInvalid)(event);
  };

  const currentStep = STEPS[step - 1];

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-8 pb-28 md:px-8 md:py-12 md:pb-16">
        {applicationNumber ? (
          <SuccessView
            job={job}
            applicationNumber={applicationNumber}
            notice={submitNotice}
          />
        ) : (
          <form onSubmit={onFormSubmit} noValidate>
            {/* Geri: kartın dışında, adım bağlamının hemen üstünde */}
            {step === 1 ? (
              <Link
                href={`/jobs/${job.code}`}
                className="text-muted hover:text-ink hover:bg-ink/5 focus-visible:outline-accent -ml-2 inline-flex min-h-11 items-center gap-1 rounded-[8px] px-2 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                İlana dön
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="text-muted hover:text-ink hover:bg-ink/5 focus-visible:outline-accent -ml-2 inline-flex min-h-11 items-center gap-1 rounded-[8px] px-2 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Geri
              </button>
            )}

            <p className="t-caption text-muted break-anywhere mt-2">
              <span className="mono text-ink font-semibold">{job.code}</span> ·{" "}
              {job.title}
            </p>

            <div className="mt-4">
              <ApplyProgress step={step} maxVisited={maxVisited} onJump={goTo} />
            </div>

            {draftRestored ? (
              <div className="border-accent/30 bg-accent-soft rounded-field mt-6 flex items-start gap-3 border p-3">
                <Info className="text-accent mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p className="t-caption text-ink flex-1">
                  Kaldığınız yerden devam ediyorsunuz — daha önce girdiğiniz
                  bilgiler yüklendi.
                </p>
                <button
                  type="button"
                  onClick={() => setDraftRestored(false)}
                  className="text-muted hover:text-ink hover:bg-ink/5 -m-2 grid size-11 shrink-0 place-items-center rounded-[8px]"
                  aria-label="Bildirimi kapat"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}

            <section
              key={step}
              className="card step-enter mt-6 p-4 md:p-6"
              aria-labelledby="step-heading"
            >
              <h1
                id="step-heading"
                ref={headingRef}
                tabIndex={-1}
                className="t-h2 outline-none"
              >
                {currentStep.label}
              </h1>

              <div className="mt-6">
                {step === 1 ? <StepIntro job={job} /> : null}
                {step === 2 ? (
                  <StepPersonal
                    form={form}
                    linkedInStatus={linkedInStatus}
                    onImportLinkedIn={importLinkedIn}
                  />
                ) : null}
                {step === 3 ? (
                  <StepCv
                    form={form}
                    linkedInStatus={linkedInStatus}
                    onImportLinkedIn={importLinkedIn}
                    onSelectFile={selectFile}
                    onRemoveFile={removeFile}
                    fileError={fileError}
                    cvError={cvError}
                  />
                ) : null}
                {step === 4 ? <StepQuestions form={form} job={job} /> : null}
                {step === 5 ? (
                  <StepConsent
                    form={form}
                    job={job}
                    onEditStep={goTo}
                    onOpenKvkk={() => setKvkkOpen(true)}
                  />
                ) : null}
              </div>
            </section>

            {/* Tek eylem satırı: ikincil solda, birincil sağda — her adımda aynı */}
            <div className="border-line bg-surface fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:static md:mt-8 md:border-0 md:bg-transparent md:p-0">
              <button
                type="button"
                onClick={saveForLater}
                /* Genişlik sabit: "Kaydedildi" durumunda birincil eylem yer değiştirmesin */
                className="btn btn-outline flex-1 md:flex-none md:min-w-[224px]"
              >
                {draftSaved ? (
                  <>
                    <Check className="text-success size-4" aria-hidden="true" />
                    Kaydedildi
                  </>
                ) : (
                  <>
                    {/* Dar ekranda etiket iki satıra sarmasın */}
                    <span className="sm:hidden">Taslağı kaydet</span>
                    <span className="hidden sm:inline">
                      Kaydet ve sonra devam et
                    </span>
                  </>
                )}
              </button>

              <button type="submit" className="btn btn-primary flex-1 md:flex-none">
                {step === STEPS.length ? (
                  <>
                    {/* Dar ekranda etiket iki satıra sarmasın */}
                    <span className="sm:hidden">Gönder</span>
                    <span className="hidden sm:inline">Başvuruyu gönder</span>
                  </>
                ) : (
                  <>
                    {step === 1 ? (
                      <>
                        <span className="sm:hidden">Başla</span>
                        <span className="hidden sm:inline">
                          Başvuruya başla
                        </span>
                      </>
                    ) : (
                      "Devam et"
                    )}
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>

            <p aria-live="polite" className="sr-only">
              {draftSaved
                ? "Taslağınız bu tarayıcıda saklandı; aynı ilandan devam edebilirsiniz."
                : ""}
            </p>
          </form>
        )}
      </main>

      <KvkkDialog open={kvkkOpen} onClose={() => setKvkkOpen(false)} />
    </>
  );
}
