import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, ChevronLeft, Clock, MapPin, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JOBS, getJob } from "@/lib/jobs";
import { formatDate, relativeDate } from "@/lib/format";

export function generateStaticParams() {
  return JOBS.map((job) => ({ id: job.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);
  return {
    title: job ? `${job.title} — Pivota` : "İlan bulunamadı — Pivota",
  };
}

function Section({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <section className="mt-8">
      <h2 className="t-h3">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="t-body text-muted break-anywhere flex gap-3">
            <span
              className="bg-muted mt-2.5 size-1.5 shrink-0 rounded-full"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);

  if (!job) notFound();

  const applyHref = `/jobs/${job.code}/apply`;

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-[760px] flex-1 px-4 py-8 md:px-8 md:py-12">
        <Link
          href="/"
          className="text-muted hover:text-ink focus-visible:outline-accent -ml-2 inline-flex min-h-11 items-center gap-1 rounded-[8px] px-2 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Tüm ilanlar
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="chip mono">{job.code}</span>
          <span className="chip">{job.department}</span>
        </div>

        <h1 className="t-h1 break-anywhere mt-3">{job.title}</h1>

        <ul className="t-caption text-muted mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <li className="flex items-center gap-1.5">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {job.location} · {job.workType}
          </li>
          <li className="flex items-center gap-1.5">
            <Briefcase className="size-4 shrink-0" aria-hidden="true" />
            {job.employment}
          </li>
          <li className="flex items-center gap-1.5">
            <Users className="size-4 shrink-0" aria-hidden="true" />
            {job.applicantCount} başvuru
          </li>
          <li className="flex items-center gap-1.5">
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            {formatDate(job.postedAt)} ({relativeDate(job.postedAt)})
          </li>
        </ul>

        <div className="mt-8 hidden md:block">
          <Link href={applyHref} className="btn btn-primary">
            Bu pozisyona başvur
          </Link>
        </div>

        <hr className="border-line mt-8" />

        <p className="t-body-lg break-anywhere mt-8">{job.intro}</p>

        <Section title="Sorumluluklar" items={job.responsibilities} />
        <Section title="Aranan nitelikler" items={job.requirements} />
        <Section title="Tercih sebebi" items={job.niceToHave} />

        <div className="card mt-12 hidden p-6 md:block">
          <h2 className="t-h3">Bu pozisyon size uygun mu?</h2>
          <p className="t-body text-muted mt-2">
            Başvuru beş kısa adımdan oluşur ve ortalama iki dakika sürer.
            Dilerseniz kaydedip sonra devam edebilirsiniz.
          </p>
          <Link href={applyHref} className="btn btn-primary mt-6">
            Bu pozisyona başvur
          </Link>
        </div>
      </main>

      {/* Mobilde ana eylem başparmak bölgesinde sabit durur */}
      <div className="border-line bg-surface fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden">
        <Link href={applyHref} className="btn btn-primary w-full">
          Bu pozisyona başvur
        </Link>
      </div>

      <SiteFooter />
      {/* Mobildeki sabit eylem çubuğu için alt boşluk */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
