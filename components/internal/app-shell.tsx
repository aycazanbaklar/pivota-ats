"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Search, Settings } from "lucide-react";
import { PivotaMark } from "@/components/brand";
import { WORKSPACE } from "@/lib/roles";
import { useInternal } from "./internal-context";
import { StageToast } from "./stage-toast";

type NavItem = { label: string; href: string };

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toLocaleUpperCase("tr");
}

export function AppShell({ children }: { children: ReactNode }) {
  const { role, query, setQuery, signOut, dataNotice } = useInternal();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const navItems: NavItem[] = [
    { label: "İlanlar", href: "/yakinda/ilanlar" },
    { label: "Adaylar", href: "/yakinda/adaylar" },
    ...(role.id === "yonetici"
      ? [{ label: "Bekleyen Aksiyonlar", href: "/bekleyen-aksiyonlar" }]
      : []),
    { label: "Pipeline", href: "/pipeline" },
    { label: "Raporlar", href: "/yakinda/raporlar" },
  ];

  return (
    <>
      <header className="border-line bg-surface sticky top-0 z-40 border-b">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-4 px-4 md:px-6">
          <Link
            href="/pipeline"
            className="text-ink flex min-h-11 shrink-0 items-center gap-2 rounded-[10px]"
          >
            <PivotaMark />
            <span className="hidden text-[17px] font-bold tracking-[-0.02em] sm:inline">
              Pivota
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-[10px] px-3 text-[14px] font-medium transition-colors ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-muted hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative ml-auto hidden min-w-0 max-w-[280px] flex-1 md:block">
            <Search
              className="text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Aday veya pozisyon ara"
              placeholder="Aday veya pozisyon ara"
              className="field field-search"
            />
          </div>

          <div className="relative ml-auto shrink-0 md:ml-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="hover:bg-ink/5 focus-visible:outline-accent flex min-h-11 items-center gap-2 rounded-[10px] px-2 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="bg-accent-soft text-accent grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold">
                {initials(role.person)}
              </span>
              <span className="hidden text-left lg:block">
                <span className="block text-[14px] leading-tight font-semibold">
                  {role.person}
                </span>
                <span className="text-muted block text-[12px] leading-tight">
                  {role.title}
                </span>
              </span>
              <ChevronDown className="text-muted size-4" aria-hidden="true" />
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="border-line bg-surface shadow-panel absolute right-0 z-50 mt-2 w-[264px] overflow-hidden rounded-[12px] border"
              >
                <div className="border-line border-b px-4 py-3">
                  <p className="t-body font-semibold">{role.person}</p>
                  <p className="t-caption text-muted mt-0.5">{role.title}</p>
                  <p className="t-caption text-muted mt-2 flex items-center gap-1.5">
                    <span
                      className="bg-success size-1.5 rounded-full"
                      aria-hidden="true"
                    />
                    {WORKSPACE} workspace
                  </p>
                </div>

                <Link
                  href="/yakinda/hesap-ayarlari"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="text-ink hover:bg-ink/5 flex min-h-11 items-center gap-2.5 px-4 text-[14px]"
                >
                  <Settings className="text-muted size-4" aria-hidden="true" />
                  Hesap ayarları
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="text-ink hover:bg-ink/5 border-line flex min-h-11 w-full items-center gap-2.5 border-t px-4 text-left text-[14px]"
                >
                  <LogOut className="text-muted size-4" aria-hidden="true" />
                  Çıkış yap
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {dataNotice ? (
        <div className="border-warning/30 bg-warning-soft border-b">
          <p className="text-warning-ink t-caption mx-auto w-full max-w-[1440px] px-4 py-2 md:px-6">
            {dataNotice}
          </p>
        </div>
      ) : null}

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>

      <StageToast />
    </>
  );
}
