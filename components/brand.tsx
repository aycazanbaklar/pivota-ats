import Link from "next/link";

export function PivotaMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`bg-accent inline-flex h-7 w-7 items-center justify-center rounded-[9px] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path
          d="M8 18V6h5a4 4 0 0 1 0 8H9.5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function PivotaLogo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="text-ink focus-visible:outline-accent inline-flex min-h-11 items-center gap-2 rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <PivotaMark />
      <span className="text-[17px] font-bold tracking-[-0.02em]">Pivota</span>
    </Link>
  );
}
