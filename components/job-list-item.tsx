import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import type { Job } from "@/lib/types";
import { relativeDate } from "@/lib/format";

export function JobListItem({ job }: { job: Job }) {
  return (
    <article className="card hover:shadow-card p-4 transition-shadow duration-200 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip mono">{job.code}</span>
        <span className="chip">{job.department}</span>
      </div>

      <h2 className="t-h2 break-anywhere mt-3">
        <Link
          href={`/jobs/${job.code}`}
          className="hover:text-accent focus-visible:outline-accent rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          {job.title}
        </Link>
      </h2>

      <p className="t-body-lg text-muted break-anywhere mt-2 max-w-[64ch]">
        {job.shortDescription}
      </p>

      <div className="border-line mt-4 flex flex-col gap-4 border-t pt-4 md:flex-row md:items-center md:justify-between">
        <ul className="t-body text-muted flex flex-wrap items-center gap-x-6 gap-y-2">
          <li className="flex items-center gap-2">
            <MapPin className="size-[18px] shrink-0" aria-hidden="true" />
            {job.location} · {job.workType}
          </li>
          <li className="flex items-center gap-2">
            <Users className="size-[18px] shrink-0" aria-hidden="true" />
            {job.applicantCount} başvuru
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-[18px] shrink-0" aria-hidden="true" />
            {relativeDate(job.postedAt)} yayınlandı
          </li>
        </ul>

        <div className="grid shrink-0 grid-cols-2 gap-2 md:flex">
          <Link
            href={`/jobs/${job.code}`}
            className="btn btn-quiet"
            aria-label={`${job.title} ilanının detayını görüntüle`}
          >
            Detay
          </Link>
          <Link
            href={`/jobs/${job.code}/apply`}
            className="btn btn-outline"
            aria-label={`${job.title} pozisyonuna başvur`}
          >
            Başvur
          </Link>
        </div>
      </div>
    </article>
  );
}
