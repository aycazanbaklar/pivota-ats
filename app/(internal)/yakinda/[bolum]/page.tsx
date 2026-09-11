import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

const SECTIONS: Record<string, { title: string; description: string }> = {
  ilanlar: {
    title: "İlanlar",
    description:
      "İlan oluşturma ve yayın yönetimi bu prototipin kapsamı dışında; şu an yalnızca pipeline akışı çalışıyor.",
  },
  adaylar: {
    title: "Adaylar",
    description:
      "Aday veri tabanı görünümü bu prototipin kapsamı dışında; adaylara pipeline üzerinden ulaşabilirsiniz.",
  },
  raporlar: {
    title: "Raporlar",
    description:
      "Detaylı raporlama bu prototipin kapsamı dışında; özet metrikler İK Yöneticisi görünümünde pipeline'ın üstünde yer alıyor.",
  },
  "hesap-ayarlari": {
    title: "Hesap ayarları",
    description:
      "Hesap ve workspace ayarları bu prototipin kapsamı dışında; rol değiştirmek için avatar menüsünden çıkış yapabilirsiniz.",
  },
};

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((bolum) => ({ bolum }));
}

export default async function ComingSoonPage({
  params,
}: {
  params: Promise<{ bolum: string }>;
}) {
  const { bolum } = await params;
  const section = SECTIONS[bolum];

  if (!section) notFound();

  return (
    <div className="mx-auto max-w-[560px] py-16">
      <h1 className="t-h1">{section.title}</h1>
      <p className="t-body-lg text-muted mt-4">{section.description}</p>
      <Link href="/pipeline" className="btn btn-primary mt-8">
        Pipeline&apos;a dön
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
