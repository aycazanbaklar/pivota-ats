import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[760px] flex-1 flex-col justify-center px-4 py-24 md:px-8">
        <h1 className="t-h1">Bu ilan artık yayında değil</h1>
        <p className="t-body-lg text-muted mt-4">
          Aradığınız ilan kaldırılmış veya bağlantı hatalı olabilir. Açık
          pozisyonların tamamını listeden görebilirsiniz.
        </p>
        <div>
          <Link href="/" className="btn btn-primary mt-8">
            Açık pozisyonlara dön
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
