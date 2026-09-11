export type StageId =
  | "basvuru"
  | "telefon"
  | "teknik"
  | "teklif"
  | "ise-alindi";

export type SourceId = "linkedin" | "kariyer" | "referans" | "website";

export type PendingAction = "onay" | "scorecard";

export type ActivityEntry = {
  /** Kaç saat önce — göreli tarih bundan üretilir, böylece sunucu ve istemci aynı metni basar */
  hoursAgo: number;
  /** Oturum içinde oluşan olaylarda gerçek zaman damgası (yalnızca istemcide üretilir) */
  at?: number;
  text: string;
};

export type Candidate = {
  id: string;
  name: string;
  headline: string;
  jobCode: string;
  jobTitle: string;
  stage: StageId;
  /** 0-100 uyum skoru — beta sinyal, karar yerine ön sıralama için */
  score: number;
  source: SourceId;
  lastActivityHours: number;
  pendingAction?: PendingAction;
  location: string;
  experience: string;
  education: string;
  cvFileName: string;
  cvSize: string;
  highlights: string[];
  activity: ActivityEntry[];
};

/** Aşama ayrımı için ölçülü semantik ton — ilerleme: nötr → indigo → karar → sonuç */
export type StageTone = "neutral" | "info" | "accent" | "warning" | "success";

export const STAGES: { id: StageId; label: string; tone: StageTone }[] = [
  { id: "basvuru", label: "İlk Başvuru", tone: "neutral" },
  { id: "telefon", label: "Telefon Görüşmesi", tone: "info" },
  { id: "teknik", label: "Teknik Mülakat", tone: "accent" },
  { id: "teklif", label: "Teklif", tone: "warning" },
  { id: "ise-alindi", label: "İşe Alındı", tone: "success" },
];

export const SOURCE_LABELS: Record<SourceId, string> = {
  linkedin: "LinkedIn",
  kariyer: "Kariyer sitesi",
  referans: "Çalışan referansı",
  website: "Pivota kariyer sayfası",
};

export function stageLabel(id: StageId): string {
  return STAGES.find((stage) => stage.id === id)?.label ?? id;
}

export function stageTone(id: StageId): StageTone {
  return STAGES.find((stage) => stage.id === id)?.tone ?? "neutral";
}

/** Sabit saat farkından göreli metin üretir (hidrasyon farkı oluşmaz) */
export function relativeFromHours(hours: number): string {
  if (hours < 1) return "az önce";
  if (hours === 1) return "1 saat önce";
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "dün";
  if (days < 7) return `${days} gün önce`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 hafta önce" : `${weeks} hafta önce`;
}

/** Aktivite zamanı: oturum içinde oluşan olaylarda gerçek saat, mock veride sabit fark */
export function activityTime(entry: ActivityEntry): string {
  if (entry.at === undefined) return relativeFromHours(entry.hoursAgo);
  const minutes = Math.floor((Date.now() - entry.at) / 60000);
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dakika önce`;
  return relativeFromHours(Math.floor(minutes / 60));
}

export type ScoreTone = "strong" | "medium" | "low";

export function scoreTone(score: number): ScoreTone {
  if (score >= 80) return "strong";
  if (score >= 65) return "medium";
  return "low";
}

export const CANDIDATES: Candidate[] = [
  {
    id: "c-01",
    name: "Elif Demirtaş",
    headline: "Kıdemli Ürün Tasarımcısı · Trendbox Teknoloji",
    jobCode: "ILN-2026-014",
    jobTitle: "Kıdemli Ürün Tasarımcısı",
    stage: "teknik",
    score: 88,
    source: "linkedin",
    lastActivityHours: 2,
    pendingAction: "scorecard",
    location: "İstanbul",
    experience: "6 yıl",
    education: "Marmara Üniversitesi — Endüstriyel Tasarım",
    cvFileName: "elif-demirtas-cv.pdf",
    cvSize: "412 KB",
    highlights: [
      "B2B SaaS ürünlerinde uçtan uca akış tasarımı",
      "Tasarım sistemi kurma ve sürdürme deneyimi",
      "Kullanılabilirlik testleriyle karar doğrulama",
    ],
    activity: [
      { hoursAgo: 2, text: "Teknik mülakat aşamasına taşındı" },
      { hoursAgo: 26, text: "Telefon görüşmesi tamamlandı" },
      { hoursAgo: 72, text: "Başvuru alındı" },
    ],
  },
  {
    id: "c-02",
    name: "Mert Kavaklıoğlu",
    headline: "Ürün Tasarımcısı · Vestra Dijital",
    jobCode: "ILN-2026-014",
    jobTitle: "Kıdemli Ürün Tasarımcısı",
    stage: "telefon",
    score: 74,
    source: "kariyer",
    lastActivityHours: 5,
    location: "İzmir",
    experience: "4 yıl",
    education: "Dokuz Eylül Üniversitesi — Görsel İletişim Tasarımı",
    cvFileName: "mert-kavaklioglu-cv.pdf",
    cvSize: "358 KB",
    highlights: [
      "Mobil uygulama tasarımında yoğun deneyim",
      "Tasarım sistemi katkısı",
    ],
    activity: [
      { hoursAgo: 5, text: "Telefon görüşmesi planlandı" },
      { hoursAgo: 48, text: "Başvuru alındı" },
    ],
  },
  {
    id: "c-03",
    name: "Ayşegül Karahanoğlu Yılmaz",
    headline: "Frontend Geliştirici · Nova Yazılım",
    jobCode: "ILN-2026-013",
    jobTitle: "Frontend Geliştirici (React)",
    stage: "teknik",
    score: 91,
    source: "referans",
    lastActivityHours: 7,
    pendingAction: "scorecard",
    location: "İstanbul",
    experience: "5 yıl",
    education: "İTÜ — Bilgisayar Mühendisliği",
    cvFileName: "aysegul-karahanoglu-yilmaz-cv.pdf",
    cvSize: "521 KB",
    highlights: [
      "React ve TypeScript ile büyük ölçekli arayüzler",
      "Erişilebilirlik (WCAG) pratiği",
      "Tasarım sistemi bileşen kütüphanesi kurulumu",
    ],
    activity: [
      { hoursAgo: 7, text: "Teknik mülakat için scorecard bekleniyor" },
      { hoursAgo: 30, text: "Teknik mülakat tamamlandı" },
      { hoursAgo: 96, text: "Başvuru alındı" },
    ],
  },
  {
    id: "c-04",
    name: "Onur Bayraktar",
    headline: "Frontend Geliştirici · Kobi Bulut",
    jobCode: "ILN-2026-013",
    jobTitle: "Frontend Geliştirici (React)",
    stage: "basvuru",
    score: 62,
    source: "website",
    lastActivityHours: 9,
    location: "Ankara",
    experience: "2 yıl",
    education: "Hacettepe Üniversitesi — Yazılım Mühendisliği",
    cvFileName: "onur-bayraktar-cv.pdf",
    cvSize: "287 KB",
    highlights: ["React ile ürün geliştirme", "Test otomasyonuna ilgi"],
    activity: [{ hoursAgo: 9, text: "Başvuru alındı" }],
  },
  {
    id: "c-05",
    name: "Zeynep Aksoy",
    headline: "İK Uzmanı · Marla Perakende",
    jobCode: "ILN-2026-011",
    jobTitle: "İK Uzmanı",
    stage: "teklif",
    score: 84,
    source: "linkedin",
    lastActivityHours: 12,
    pendingAction: "onay",
    location: "İstanbul",
    experience: "5 yıl",
    education: "Boğaziçi Üniversitesi — Psikoloji",
    cvFileName: "zeynep-aksoy-cv.pdf",
    cvSize: "399 KB",
    highlights: [
      "Teknik pozisyonlarda işe alım deneyimi",
      "Aday deneyimi iyileştirme projeleri",
    ],
    activity: [
      { hoursAgo: 12, text: "Teklif onayı bekleniyor" },
      { hoursAgo: 54, text: "Teknik mülakat tamamlandı" },
      { hoursAgo: 120, text: "Başvuru alındı" },
    ],
  },
  {
    id: "c-06",
    name: "Emre Şahin",
    headline: "İşe Alım Uzmanı · Trendbox Teknoloji",
    jobCode: "ILN-2026-011",
    jobTitle: "İK Uzmanı",
    stage: "telefon",
    score: 69,
    source: "kariyer",
    lastActivityHours: 20,
    location: "İstanbul",
    experience: "3 yıl",
    education: "Anadolu Üniversitesi — İşletme",
    cvFileName: "emre-sahin-cv.pdf",
    cvSize: "302 KB",
    highlights: ["Yüksek hacimli işe alım", "ATS kullanım alışkanlığı"],
    activity: [
      { hoursAgo: 20, text: "Telefon görüşmesi tamamlandı" },
      { hoursAgo: 68, text: "Başvuru alındı" },
    ],
  },
  {
    id: "c-07",
    name: "Cansu Ergin",
    headline: "Kurumsal Satış Temsilcisi · Vialog",
    jobCode: "ILN-2026-010",
    jobTitle: "Kurumsal Satış Temsilcisi",
    stage: "teklif",
    score: 79,
    source: "referans",
    lastActivityHours: 26,
    pendingAction: "onay",
    location: "Ankara",
    experience: "7 yıl",
    education: "ODTÜ — İşletme",
    cvFileName: "cansu-ergin-cv.pdf",
    cvSize: "465 KB",
    highlights: [
      "B2B SaaS satışında kanıtlanmış kota performansı",
      "CRM disiplini",
    ],
    activity: [
      { hoursAgo: 26, text: "Teklif onayı bekleniyor" },
      { hoursAgo: 74, text: "Son görüşme tamamlandı" },
      { hoursAgo: 150, text: "Başvuru alındı" },
    ],
  },
  {
    id: "c-08",
    name: "Kerem Yalçın",
    headline: "Satış Temsilcisi · Bilge Sistem",
    jobCode: "ILN-2026-010",
    jobTitle: "Kurumsal Satış Temsilcisi",
    stage: "basvuru",
    score: 58,
    source: "website",
    lastActivityHours: 30,
    location: "Ankara",
    experience: "2 yıl",
    education: "Gazi Üniversitesi — İktisat",
    cvFileName: "kerem-yalcin-cv.pdf",
    cvSize: "244 KB",
    highlights: ["Saha satış deneyimi"],
    activity: [{ hoursAgo: 30, text: "Başvuru alındı" }],
  },
  {
    id: "c-09",
    name: "Selin Uçar",
    headline: "Veri Analisti · Harmoni Analitik",
    jobCode: "ILN-2026-008",
    jobTitle: "Veri Analisti",
    stage: "teknik",
    score: 82,
    source: "linkedin",
    lastActivityHours: 34,
    pendingAction: "scorecard",
    location: "İzmir",
    experience: "4 yıl",
    education: "Ege Üniversitesi — İstatistik",
    cvFileName: "selin-ucar-cv.pdf",
    cvSize: "377 KB",
    highlights: ["SQL ve Python ile analiz", "Dashboard kurulumu"],
    activity: [
      { hoursAgo: 34, text: "Teknik mülakat tamamlandı" },
      { hoursAgo: 90, text: "Telefon görüşmesi tamamlandı" },
      { hoursAgo: 168, text: "Başvuru alındı" },
    ],
  },
  {
    id: "c-10",
    name: "Barış Tunç",
    headline: "Raporlama Uzmanı · Metrik Yazılım",
    jobCode: "ILN-2026-008",
    jobTitle: "Veri Analisti",
    stage: "basvuru",
    score: 66,
    source: "kariyer",
    lastActivityHours: 40,
    location: "İzmir",
    experience: "3 yıl",
    education: "Yaşar Üniversitesi — Endüstri Mühendisliği",
    cvFileName: "baris-tunc-cv.pdf",
    cvSize: "268 KB",
    highlights: ["Excel ve SQL ağırlıklı raporlama"],
    activity: [{ hoursAgo: 40, text: "Başvuru alındı" }],
  },
  {
    id: "c-11",
    name: "Melis Arıkan",
    headline: "Müşteri Başarı Uzmanı · Nova Yazılım",
    jobCode: "ILN-2026-006",
    jobTitle: "Müşteri Başarı Uzmanı",
    stage: "telefon",
    score: 77,
    source: "linkedin",
    lastActivityHours: 46,
    location: "İstanbul",
    experience: "4 yıl",
    education: "Koç Üniversitesi — Sosyoloji",
    cvFileName: "melis-arikan-cv.pdf",
    cvSize: "331 KB",
    highlights: ["SaaS onboarding yönetimi", "Hesap sağlığı takibi"],
    activity: [
      { hoursAgo: 46, text: "Telefon görüşmesi planlandı" },
      { hoursAgo: 110, text: "Başvuru alındı" },
    ],
  },
  {
    id: "c-12",
    name: "Ahmet Kılıçarslan",
    headline: "Destek Uzmanı · Kobi Bulut",
    jobCode: "ILN-2026-006",
    jobTitle: "Müşteri Başarı Uzmanı",
    stage: "basvuru",
    score: 54,
    source: "website",
    lastActivityHours: 52,
    location: "Bursa",
    experience: "2 yıl",
    education: "Uludağ Üniversitesi — İşletme",
    cvFileName: "ahmet-kilicarslan-cv.pdf",
    cvSize: "219 KB",
    highlights: ["Müşteri destek süreçleri"],
    activity: [{ hoursAgo: 52, text: "Başvuru alındı" }],
  },
  {
    id: "c-13",
    name: "Gizem Polat",
    headline: "Ürün Tasarımcısı · Serra Studio",
    jobCode: "ILN-2026-014",
    jobTitle: "Kıdemli Ürün Tasarımcısı",
    stage: "basvuru",
    score: 71,
    source: "referans",
    lastActivityHours: 58,
    location: "İstanbul",
    experience: "5 yıl",
    education: "Mimar Sinan Üniversitesi — Endüstri Ürünleri Tasarımı",
    cvFileName: "gizem-polat-cv.pdf",
    cvSize: "402 KB",
    highlights: ["Ajans ve ürün ekibi deneyimi", "Prototipleme"],
    activity: [{ hoursAgo: 58, text: "Başvuru alındı" }],
  },
  {
    id: "c-14",
    name: "Tolga Erdoğan",
    headline: "Frontend Geliştirici · Vialog",
    jobCode: "ILN-2026-013",
    jobTitle: "Frontend Geliştirici (React)",
    stage: "telefon",
    score: 80,
    source: "linkedin",
    lastActivityHours: 64,
    location: "İstanbul",
    experience: "6 yıl",
    education: "Yıldız Teknik Üniversitesi — Bilgisayar Mühendisliği",
    cvFileName: "tolga-erdogan-cv.pdf",
    cvSize: "455 KB",
    highlights: ["Next.js ile ürün geliştirme", "Performans optimizasyonu"],
    activity: [
      { hoursAgo: 64, text: "Telefon görüşmesi tamamlandı" },
      { hoursAgo: 140, text: "Başvuru alındı" },
    ],
  },
  {
    id: "c-15",
    name: "Nazlı Şimşek",
    headline: "Junior Frontend Geliştirici · Freelance",
    jobCode: "ILN-2026-013",
    jobTitle: "Frontend Geliştirici (React)",
    stage: "basvuru",
    score: 49,
    source: "website",
    lastActivityHours: 75,
    location: "Eskişehir",
    experience: "1 yıl",
    education: "Anadolu Üniversitesi — Bilgisayar Mühendisliği",
    cvFileName: "nazli-simsek-cv.pdf",
    cvSize: "198 KB",
    highlights: ["Kişisel projelerde React deneyimi"],
    activity: [{ hoursAgo: 75, text: "Başvuru alındı" }],
  },
];

/** Müdür şeridindeki metrikler — mock veriden türetilir */
export function pipelineMetrics(candidates: Candidate[]) {
  const openJobs = new Set(candidates.map((c) => c.jobCode)).size;
  const pending = candidates.filter((c) => c.pendingAction).length;
  return {
    openJobs,
    averageDaysToHire: 24,
    pending,
  };
}
