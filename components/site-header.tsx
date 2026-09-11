import Link from "next/link";
import { PivotaLogo } from "./brand";
import { AccountMenu } from "./account-menu";

/**
 * Public üst navigasyon.
 * Sol: marka + bölüm bağlantısı · Sağ: her zaman hesap kontrolü.
 */
export function SiteHeader({ showAccount = true }: { showAccount?: boolean }) {
  return (
    <header className="border-line bg-surface sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center gap-2 px-4 md:px-8">
        <PivotaLogo />

        <nav className="flex items-center">
          <Link
            href="/"
            className="text-muted hover:text-ink hover:bg-ink/5 focus-visible:outline-accent flex min-h-11 items-center rounded-[10px] px-3 text-[15px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Açık pozisyonlar
          </Link>
        </nav>

        <div className="ml-auto shrink-0">{showAccount ? <AccountMenu /> : null}</div>
      </div>
    </header>
  );
}
