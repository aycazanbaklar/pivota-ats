import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JobDiscovery } from "@/components/job-discovery";
import { JOBS } from "@/lib/jobs";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 py-12 md:px-8 md:py-16">
        <section className="max-w-[68ch]">
          <h1 className="t-display">Pivota&apos;da açık pozisyonlar</h1>
          <p className="t-body-lg text-muted mt-4">
            İşe alım süreçlerini tek bir yerden yöneten bir ekip kuruyoruz.
            Başvurunuz ortalama iki dakika sürer; kaldığınız yerden devam
            edebilirsiniz.
          </p>
        </section>

        <JobDiscovery jobs={JOBS} />
      </main>

      <SiteFooter />
    </>
  );
}
