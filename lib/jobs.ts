import type { Job, ScreeningQuestion } from "./types";

const baseQuestions = (officeLine: string): ScreeningQuestion[] => [
  {
    id: "q1",
    label: officeLine,
    type: "radio",
    options: ["Evet", "Hayır"],
    required: true,
  },
  {
    id: "q2",
    label: "İlgili alandaki toplam deneyiminiz",
    type: "select",
    options: ["0-1 yıl", "1-3 yıl", "3-5 yıl", "5-8 yıl", "8+ yıl"],
    required: true,
  },
  {
    id: "q3",
    label:
      "Daha önce bir aday takip sistemi (ATS), İK yazılımı veya işe alım süreçlerini yöneten bir ürün üzerinde çalıştınız mı? Ürün adını ya da rolünüzü aşağıdaki not alanında paylaşabilirsiniz.",
    type: "radio",
    options: ["Evet, çalıştım", "Hayır, çalışmadım"],
    required: true,
  },
  {
    id: "q4",
    label: "En erken başlayabileceğiniz tarih",
    type: "select",
    options: ["Hemen", "2 hafta içinde", "1 ay içinde", "2 ay ve sonrası"],
    required: true,
  },
];

export const JOBS: Job[] = [
  {
    code: "ILN-2026-014",
    title: "Kıdemli Ürün Tasarımcısı",
    department: "Tasarım",
    location: "İstanbul",
    workType: "Hibrit",
    employment: "Tam zamanlı",
    shortDescription:
      "Pivota ATS'in aday ve işe alım deneyimini uçtan uca tasarlayacak, ürün ekibiyle birlikte çalışacak kıdemli bir tasarımcı arıyoruz.",
    intro:
      "Pivota, KOBİ ve orta ölçekli şirketlerin işe alım süreçlerini tek bir yerden yönettiği bir ATS platformu. Kıdemli Ürün Tasarımcısı olarak, adayın ilk başvurusundan işe alım kararına kadar uzanan deneyimin tamamından sorumlu olacaksınız.",
    responsibilities: [
      "Aday başvuru akışı ve İK pipeline deneyimini uçtan uca tasarlamak",
      "Ürün yöneticileri ve geliştiricilerle birlikte problem tanımından teslime kadar çalışmak",
      "Tasarım sistemimizi büyütmek ve bileşen tutarlılığını korumak",
      "Kullanıcı görüşmeleri ve kullanılabilirlik testleriyle kararları doğrulamak",
    ],
    requirements: [
      "5+ yıl ürün tasarımı deneyimi, tercihen B2B SaaS alanında",
      "Karmaşık iş akışlarını sadeleştirme konusunda kanıtlanmış portföy",
      "Figma'da ileri düzey yetkinlik ve tasarım sistemi deneyimi",
      "Tasarım kararlarını veriyle ve kullanıcı içgörüsüyle gerekçelendirme alışkanlığı",
    ],
    niceToHave: [
      "HTML/CSS okuyabilme, geliştiricilerle aynı dilde konuşabilme",
      "İK teknolojileri veya işe alım ürünlerinde deneyim",
    ],
    applicantCount: 47,
    postedAt: "2026-09-02",
    screeningQuestions: baseQuestions(
      "Bu pozisyon hibrit çalışmaya dayanıyor. İstanbul ofisimizde haftada 2 gün bulunabilir misiniz?",
    ),
  },
  {
    code: "ILN-2026-013",
    title: "Frontend Geliştirici (React)",
    department: "Mühendislik",
    location: "İstanbul",
    workType: "Uzaktan",
    employment: "Tam zamanlı",
    shortDescription:
      "React ve TypeScript ile Pivota ATS'in arayüzünü geliştirecek, tasarım ekibiyle yakın çalışacak bir geliştirici arıyoruz.",
    intro:
      "Ürün arayüzümüzün performansından ve erişilebilirliğinden sorumlu olacak, tasarım sistemimizi kod tarafında büyütecek bir frontend geliştirici arıyoruz.",
    responsibilities: [
      "React + TypeScript ile ürün arayüzlerini geliştirmek",
      "Tasarım sistemi bileşenlerini kod tarafında kurmak ve sürdürmek",
      "Erişilebilirlik ve performans standartlarını gözetmek",
      "Kod incelemeleriyle ekip kalitesine katkı vermek",
    ],
    requirements: [
      "3+ yıl React deneyimi",
      "TypeScript ve modern CSS konusunda güçlü hakimiyet",
      "Erişilebilirlik (WCAG) konusunda pratik bilgi",
    ],
    niceToHave: ["Next.js deneyimi", "Test otomasyonu deneyimi"],
    applicantCount: 132,
    postedAt: "2026-08-27",
    screeningQuestions: baseQuestions(
      "Bu pozisyon uzaktan çalışmaya açık. Türkiye saat diliminde tam zamanlı çalışabilir misiniz?",
    ),
  },
  {
    code: "ILN-2026-011",
    title: "İK Uzmanı",
    department: "İnsan Kaynakları",
    location: "İstanbul",
    workType: "Ofis",
    employment: "Tam zamanlı",
    shortDescription:
      "Pivota'nın kendi işe alım süreçlerini yürütecek, aday deneyimini sahiplenen bir İK uzmanı arıyoruz.",
    intro:
      "Kendi ürünümüzü her gün kullanan bir ekipte, işe alım hattını uçtan uca yürütecek bir İK uzmanı arıyoruz.",
    responsibilities: [
      "Açık pozisyonlar için aday havuzunu yönetmek",
      "Ön görüşmeleri planlamak ve yürütmek",
      "Hiring manager'larla birlikte değerlendirme sürecini koordine etmek",
      "Aday deneyimini iyileştirecek geri bildirimleri ürün ekibine taşımak",
    ],
    requirements: [
      "2+ yıl işe alım deneyimi",
      "Aday takip sistemleriyle çalışma alışkanlığı",
      "Güçlü yazılı ve sözlü iletişim",
    ],
    niceToHave: ["Teknik pozisyonlarda işe alım deneyimi"],
    applicantCount: 89,
    postedAt: "2026-08-20",
    screeningQuestions: baseQuestions(
      "Bu pozisyon ofisten çalışmaya dayanıyor. İstanbul ofisimizde haftanın 5 günü bulunabilir misiniz?",
    ),
  },
  {
    code: "ILN-2026-010",
    title: "Kurumsal Satış Temsilcisi",
    department: "Satış",
    location: "Ankara",
    workType: "Hibrit",
    employment: "Tam zamanlı",
    shortDescription:
      "Orta ölçekli şirketlere Pivota ATS'i anlatacak, satış hattını baştan sona yönetecek bir satış temsilcisi arıyoruz.",
    intro:
      "İK ekiplerinin gerçek problemlerini anlayıp doğru çözümü konumlandıracak, danışmanlık yaklaşımıyla satış yapan bir ekip arkadaşı arıyoruz.",
    responsibilities: [
      "Yeni müşteri adaylarına ulaşmak ve ihtiyaç analizini yürütmek",
      "Ürün demoları vermek ve teklif süreçlerini yönetmek",
      "Müşteri başarı ekibiyle devir süreçlerini koordine etmek",
    ],
    requirements: [
      "3+ yıl B2B SaaS satış deneyimi",
      "CRM kullanım alışkanlığı",
      "Ankara ve çevresinde müşteri ziyareti yapabilme",
    ],
    niceToHave: ["İK teknolojileri alanında satış deneyimi"],
    applicantCount: 61,
    postedAt: "2026-08-14",
    screeningQuestions: baseQuestions(
      "Bu pozisyon hibrit çalışmaya dayanıyor. Ankara ofisimizde haftada 2 gün bulunabilir misiniz?",
    ),
  },
  {
    code: "ILN-2026-008",
    title: "Veri Analisti",
    department: "Ürün",
    location: "İzmir",
    workType: "Uzaktan",
    employment: "Tam zamanlı",
    shortDescription:
      "Ürün ve işe alım verisini analiz ederek ekiplerin karar almasını hızlandıracak bir analist arıyoruz.",
    intro:
      "İşe alım hattındaki dönüşüm oranlarını, kaynak performansını ve ürün kullanım verisini analiz edecek bir veri analisti arıyoruz.",
    responsibilities: [
      "Ürün ve işe alım metriklerini raporlamak",
      "Dashboard'ları kurmak ve sürdürmek",
      "Ekiplere düzenli içgörü sunmak",
    ],
    requirements: [
      "2+ yıl analitik deneyimi",
      "SQL ve bir görselleştirme aracında yetkinlik",
    ],
    niceToHave: ["Python ile veri analizi deneyimi"],
    applicantCount: 74,
    postedAt: "2026-08-06",
    screeningQuestions: baseQuestions(
      "Bu pozisyon uzaktan çalışmaya açık. Türkiye saat diliminde tam zamanlı çalışabilir misiniz?",
    ),
  },
  {
    code: "ILN-2026-006",
    title: "Müşteri Başarı Uzmanı",
    department: "Müşteri Başarı",
    location: "İstanbul",
    workType: "Hibrit",
    employment: "Tam zamanlı",
    shortDescription:
      "Yeni müşterilerin Pivota'ya geçişini yöneten, kullanım oranını artıran bir müşteri başarı uzmanı arıyoruz.",
    intro:
      "Müşterilerimizin ürünü ilk günden itibaren doğru kullanmasını sağlayacak, ihtiyaçlarını ürün ekibine taşıyacak bir ekip arkadaşı arıyoruz.",
    responsibilities: [
      "Yeni müşterilerin kurulum ve eğitim sürecini yönetmek",
      "Kullanım verisini takip edip riskli hesapları erken yakalamak",
      "Müşteri geri bildirimlerini ürün yol haritasına taşımak",
    ],
    requirements: [
      "2+ yıl müşteri başarı veya hesap yönetimi deneyimi",
      "SaaS ürünlerinde onboarding deneyimi",
    ],
    niceToHave: ["İK ekipleriyle çalışma deneyimi"],
    applicantCount: 38,
    postedAt: "2026-07-30",
    screeningQuestions: baseQuestions(
      "Bu pozisyon hibrit çalışmaya dayanıyor. İstanbul ofisimizde haftada 2 gün bulunabilir misiniz?",
    ),
  },
];

export function getJob(code: string): Job | undefined {
  return JOBS.find((job) => job.code.toLowerCase() === code.toLowerCase());
}
