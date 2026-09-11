import { notFound } from "next/navigation";
import { ApplyFlow } from "@/components/apply/apply-flow";
import { JOBS, getJob } from "@/lib/jobs";

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
    title: job ? `${job.title} — Başvuru | Pivota` : "İlan bulunamadı — Pivota",
  };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);

  if (!job) notFound();

  return <ApplyFlow job={job} />;
}
