"use client";

import { useMemo, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import type { Job } from "@/lib/types";
import { JobListItem } from "./job-list-item";

const ALL = "all";

const unique = (values: string[]) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, "tr"));

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const active = value !== ALL;

  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`field ${
        active ? "border-accent text-ink font-medium" : "text-muted"
      }`}
    >
      <option value={ALL}>{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function JobDiscovery({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [workType, setWorkType] = useState(ALL);

  const departments = useMemo(
    () => unique(jobs.map((job) => job.department)),
    [jobs],
  );
  const locations = useMemo(() => unique(jobs.map((job) => job.location)), [jobs]);
  const workTypes = useMemo(() => unique(jobs.map((job) => job.workType)), [jobs]);

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("tr");

    return jobs.filter((job) => {
      if (term) {
        const haystack =
          `${job.title} ${job.shortDescription} ${job.department} ${job.code}`.toLocaleLowerCase(
            "tr",
          );
        if (!haystack.includes(term)) return false;
      }
      if (department !== ALL && job.department !== department) return false;
      if (location !== ALL && job.location !== location) return false;
      if (workType !== ALL && job.workType !== workType) return false;
      return true;
    });
  }, [jobs, query, department, location, workType]);

  const hasFilters =
    query.trim() !== "" ||
    department !== ALL ||
    location !== ALL ||
    workType !== ALL;

  const clearAll = () => {
    setQuery("");
    setDepartment(ALL);
    setLocation(ALL);
    setWorkType(ALL);
  };

  return (
    <>
      {/* Discovery toolbar */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Pozisyon veya anahtar kelime ara"
            placeholder="Pozisyon veya anahtar kelime arayın"
            className="field field-search"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
              className="text-muted hover:text-ink hover:bg-ink/5 absolute top-1/2 right-0.5 grid size-11 -translate-y-1/2 place-items-center rounded-[8px]"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:flex lg:shrink-0">
          <div className="lg:w-[184px]">
            <FilterSelect
              label="Tüm departmanlar"
              value={department}
              options={departments}
              onChange={setDepartment}
            />
          </div>
          <div className="lg:w-[168px]">
            <FilterSelect
              label="Tüm lokasyonlar"
              value={location}
              options={locations}
              onChange={setLocation}
            />
          </div>
          <div className="col-span-2 lg:w-[208px]">
            <FilterSelect
              label="Tüm çalışma modelleri"
              value={workType}
              options={workTypes}
              onChange={setWorkType}
            />
          </div>
        </div>
      </div>

      {/* Sonuç sayısı */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <h2 className="t-caption text-muted font-semibold tracking-wide uppercase">
          {hasFilters
            ? `${filtered.length} pozisyon · ${jobs.length} ilan içinde`
            : `${jobs.length} açık pozisyon`}
        </h2>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-accent hover:bg-accent-soft focus-visible:outline-accent -mr-2 flex min-h-11 shrink-0 items-center rounded-[8px] px-2 text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Filtreleri temizle
          </button>
        ) : null}
      </div>

      {/* Sonuçlar */}
      {filtered.length === 0 ? (
        <div className="card mt-4 flex flex-col items-center gap-3 px-6 py-16 text-center">
          <SearchX className="text-muted size-6" aria-hidden="true" />
          <p className="t-body font-medium">Aramanızla eşleşen ilan bulunamadı</p>
          <p className="t-caption text-muted max-w-[44ch]">
            Arama terimini kısaltmayı ya da filtrelerden birini kaldırmayı
            deneyebilirsiniz.
          </p>
          <button type="button" onClick={clearAll} className="btn btn-outline mt-3">
            Filtreleri temizle
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {filtered.map((job) => (
            <JobListItem key={job.code} job={job} />
          ))}
        </div>
      )}
    </>
  );
}
