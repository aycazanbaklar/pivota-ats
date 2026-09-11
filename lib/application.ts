import type { Job } from "./types";

export type ApplicationValues = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedinUrl: string;
  headline: string;
  company: string;
  experience: string;
  education: string;
  /** Dosyanın kendisi ayrı state'te tutulur; burada yalnızca taslağa yazılabilen üst veri var */
  cvName: string;
  cvSize: number;
  filledFromLinkedIn: boolean;
  answers: Record<string, string>;
  note: string;
  kvkk: boolean;
};

export const STEPS = [
  { n: 1, label: "İlan özeti", short: "İlan özeti" },
  { n: 2, label: "Kişisel bilgiler", short: "Kişisel" },
  { n: 3, label: "CV ve profil", short: "CV" },
  { n: 4, label: "Ön eleme soruları", short: "Ön eleme" },
  { n: 5, label: "Onay ve gönderim", short: "Onay" },
] as const;

export const TOTAL_STEPS = STEPS.length;

export function emptyValues(job: Job): ApplicationValues {
  return {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    linkedinUrl: "",
    headline: "",
    company: "",
    experience: "",
    education: "",
    cvName: "",
    cvSize: 0,
    filledFromLinkedIn: false,
    answers: Object.fromEntries(
      job.screeningQuestions.map((q) => [q.id, ""]),
    ) as Record<string, string>,
    note: "",
    kvkk: false,
  };
}

/** LinkedIn profilinden gelen bilgiler */
export function linkedInProfile(job: Job) {
  return {
    fullName: "Elif Demirtaş",
    email: "elif.demirtas@gmail.com",
    phone: "+90 532 418 76 02",
    city: "İstanbul",
    linkedinUrl: "linkedin.com/in/elifdemirtas",
    headline: job.title,
    company: "Trendbox Teknoloji",
    experience: "6 yıl",
    education: "Marmara Üniversitesi — Endüstriyel Tasarım (Lisans)",
  } satisfies Partial<ApplicationValues>;
}

export const ACCEPTED_CV_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".doc", ".docx"];
export const MAX_CV_BYTES = 5 * 1024 * 1024;

export function validateCvFile(file: File): string | null {
  const name = file.name.toLowerCase();
  const okType = ACCEPTED_CV_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (!okType) {
    return "Bu dosya türü desteklenmiyor. PDF, JPEG veya Word (.doc, .docx) dosyası yükleyin.";
  }
  if (file.size > MAX_CV_BYTES) {
    return "Dosya 5 MB sınırını aşıyor. Daha küçük boyutlu bir sürümünü yükleyin.";
  }
  return null;
}

export function draftKey(jobCode: string) {
  return `pivota:application-draft:${jobCode}`;
}

export type Draft = {
  step: number;
  values: ApplicationValues;
  savedAt: number;
};

export function readDraft(jobCode: string): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(draftKey(jobCode));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed?.values) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeDraft(jobCode: string, draft: Draft) {
  try {
    window.localStorage.setItem(draftKey(jobCode), JSON.stringify(draft));
  } catch {
    /* kota dolu veya depolama kapalı — taslak kaydedilemez, akış devam eder */
  }
}

export function clearDraft(jobCode: string) {
  try {
    window.localStorage.removeItem(draftKey(jobCode));
  } catch {
    /* yoksayılır */
  }
}

/** PVT-2026-XXXXX biçiminde başvuru numarası */
export function createApplicationNumber(): string {
  const serial = Math.floor(10000 + Math.random() * 90000);
  return `PVT-2026-${serial}`;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 10;
}
