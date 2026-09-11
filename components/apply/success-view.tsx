"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import type { Job } from "@/lib/types";

export function SuccessView({
  job,
  applicationNumber,
  notice,
}: {
  job: Job;
  applicationNumber: string;
  notice?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(applicationNumber);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      /* pano erişimi yoksa numara ekranda görünür durumda kalır */
    }
  };

  return (
    <div className="step-enter mx-auto w-full max-w-[560px] py-8 md:py-16">
      <span className="bg-success-soft flex size-16 items-center justify-center rounded-full">
        <Check className="text-success-ink size-8" aria-hidden="true" />
      </span>

      <h1 ref={headingRef} tabIndex={-1} className="t-display mt-6 outline-none">
        Başvurunuz alındı
      </h1>

      <p className="t-body-lg text-muted mt-4">
        <span className="text-ink font-medium">{job.title}</span> pozisyonu için
        başvurunuz İK ekibimize iletildi; başvurunuzu inceleyip 5 iş günü içinde
        e-posta ile dönüş yapacağız.
      </p>

      <div className="card mt-8 p-4 md:p-6">
        <p className="t-caption text-muted">Başvuru numaranız</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="mono t-h3 break-anywhere">{applicationNumber}</p>
          <button type="button" onClick={copy} className="btn btn-outline">
            {copied ? (
              <>
                <Check className="size-4" aria-hidden="true" />
                Kopyalandı
              </>
            ) : (
              <>
                <Copy className="size-4" aria-hidden="true" />
                Kopyala
              </>
            )}
          </button>
        </div>
        <p className="t-caption text-muted mt-3">
          Bizimle iletişime geçerken bu numarayı paylaşırsanız başvurunuza daha
          hızlı ulaşırız.
        </p>
        <p aria-live="polite" className="sr-only">
          {copied ? "Başvuru numarası panoya kopyalandı" : ""}
        </p>
      </div>

      {notice ? (
        <p
          role="status"
          className="border-warning/30 bg-warning-soft text-warning-ink t-caption rounded-field mt-6 border p-3"
        >
          {notice}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <Link href="/" className="btn btn-primary">
          Açık pozisyonlara dön
        </Link>
        <Link href={`/jobs/${job.code}`} className="btn btn-quiet">
          İlanı yeniden görüntüle
        </Link>
      </div>
    </div>
  );
}
