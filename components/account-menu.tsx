"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutGrid, LogOut } from "lucide-react";
import { getRole, isInternalRole } from "@/lib/roles";
import { signOut, useSession } from "@/lib/supabase/session";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toLocaleUpperCase("tr");
}

/** Public alandaki hesap kontrolü — her zaman üst navigasyonun sağında durur */
export function AccountMenu() {
  const router = useRouter();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Oturum çözülene kadar yer tutucu — yerleşim sıçraması olmasın
  if (session.status === "loading") {
    return <div className="h-11 w-[112px]" aria-hidden="true" />;
  }

  if (session.status === "anon") {
    return (
      <Link href="/giris" className="btn btn-outline">
        Giriş yap
      </Link>
    );
  }

  const roleId = session.profile.role;
  const base = getRole(roleId);
  const role = {
    ...base,
    person: session.profile.full_name || base.person,
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="hover:bg-ink/5 focus-visible:outline-accent flex min-h-11 items-center gap-2 rounded-[10px] px-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="bg-accent-soft text-accent grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold">
          {initials(role.person)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-[14px] leading-tight font-semibold">
            {role.person}
          </span>
          <span className="text-muted block text-[12px] leading-tight">
            {role.title}
          </span>
        </span>
        <ChevronDown className="text-muted size-4" aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="menu"
          className="border-line bg-surface shadow-panel absolute right-0 z-50 mt-2 w-[248px] overflow-hidden rounded-[12px] border"
        >
          <div className="border-line border-b px-4 py-3">
            <p className="t-body font-semibold">{role.person}</p>
            <p className="t-caption text-muted mt-0.5">{role.title}</p>
          </div>

          {isInternalRole(roleId) ? (
            <Link
              href={role.defaultRoute}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="text-ink hover:bg-ink/5 flex min-h-11 items-center gap-2.5 px-4 text-[14px]"
            >
              <LayoutGrid className="text-muted size-4" aria-hidden="true" />
              Workspace&apos;e git
            </Link>
          ) : null}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void signOut().then(() => router.refresh());
            }}
            className="text-ink hover:bg-ink/5 border-line flex min-h-11 w-full items-center gap-2.5 border-t px-4 text-left text-[14px]"
          >
            <LogOut className="text-muted size-4" aria-hidden="true" />
            Çıkış yap
          </button>
        </div>
      ) : null}
    </div>
  );
}
