"use client";

import type { ComponentType, ReactNode } from "react";
import { Clock, FileText, ListChecks, MapPin, User } from "lucide-react";
import type { Job } from "@/lib/types";

const EXPECTATIONS = [
  { icon: User, label: "Kişisel bilgiler", detail: "Ad, e-posta, telefon" },
  {
    icon: FileText,
    label: "CV veya LinkedIn profili",
    detail: "PDF, JPEG, Word ya da tek tıkla LinkedIn",
  },
  {
    icon: ListChecks,
    label: "4 kısa ön eleme sorusu",
    detail: "Seçenekli, serbest metin gerekmiyor",
  },
];

/** Tüm ikon+metin satırları aynı ikon sütununu ve aynı içerik sütununu paylaşır */
function IconRow({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[20px_1fr] gap-x-3">
      <span className="flex h-[22px] items-center justify-start">
        <Icon className="text-muted size-4" aria-hidden={true} />
      </span>
      <div className="min-w-0">{children}</div>
    </li>
  );
}

export function StepIntro({ job }: { job: Job }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="t-h3 break-anywhere">{job.title}</h2>

        <ul className="flex flex-col gap-1.5">
          <IconRow icon={MapPin}>
            <p className="t-body text-muted break-anywhere">
              {job.location} · {job.workType} · {job.employment}
            </p>
          </IconRow>
          <IconRow icon={Clock}>
            <p className="t-body text-muted">5 adım · ortalama 2 dakika</p>
          </IconRow>
        </ul>
      </div>

      <p className="t-body break-anywhere max-w-[62ch]">
        {job.shortDescription}
      </p>

      <hr className="border-line" />

      <section className="flex flex-col gap-3">
        <h3 className="t-caption text-muted font-semibold tracking-wide uppercase">
          Sizden isteyeceklerimiz
        </h3>

        <ul className="flex flex-col gap-3">
          {EXPECTATIONS.map(({ icon, label, detail }) => (
            <IconRow key={label} icon={icon}>
              <p className="t-body font-medium">{label}</p>
              <p className="t-caption text-muted mt-0.5">{detail}</p>
            </IconRow>
          ))}
        </ul>
      </section>
    </div>
  );
}
