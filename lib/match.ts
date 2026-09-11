import { distance } from "fastest-levenshtein";

/**
 * CV / profil metni ile ilan gereksinimleri arasında hafif anahtar kelime eşleşmesi.
 *
 * Kütüphane: `fastest-levenshtein` (≈2 kB, bağımlılıksız, anahtar gerektirmez).
 * Yalnızca düzenleme mesafesi primitifi oradan geliyor; Türkçe normalleştirme,
 * durak kelime ayıklama ve kapsama hesabı burada. Ağır bir ML/embedding
 * hattı kurulmadı — skor, gereksinim anahtar kelimelerinin ne kadarının
 * adayın metninde karşılandığının ölçüsüdür.
 */

const STOPWORDS = new Set([
  "ve","veya","ile","için","bir","bu","da","de","en","gibi","olan","olarak",
  "üzerinde","konusunda","alanında","yıl","deneyimi","deneyim","tercihen",
  "güçlü","ileri","düzey","temel","iyi","çok","daha","her","tüm","the","and",
  "or","with","for","of","in","to","a","an",
]);

/** Türkçe duyarlı küçültme + noktalama temizliği */
function tokenize(text: string): string[] {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}+#.]+/gu, " ")
    .split(" ")
    .map((token) => token.replace(/^[.]+|[.]+$/g, ""))
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

/** Ek almış Türkçe sözcükler için toleranslı eşleşme (react → react'te) */
function matches(keyword: string, token: string): boolean {
  if (token === keyword) return true;
  if (token.startsWith(keyword) && token.length - keyword.length <= 3) return true;
  const tolerance = keyword.length >= 8 ? 2 : keyword.length >= 5 ? 1 : 0;
  return tolerance > 0 && distance(keyword, token) <= tolerance;
}

export type JobForMatch = {
  title: string;
  requirements: readonly string[];
  niceToHave?: readonly string[];
};

/**
 * 0-100 arası uyum skoru.
 * Aranan nitelikler 1.0, tercih sebepleri 0.5, ilan başlığı 0.8 ağırlıkta.
 */
export function matchScore(candidateText: string, job: JobForMatch): number {
  const candidateTokens = new Set(tokenize(candidateText));
  if (candidateTokens.size === 0) return 0;

  const weighted: { keyword: string; weight: number }[] = [
    ...tokenize(job.title).map((keyword) => ({ keyword, weight: 0.8 })),
    ...job.requirements.flatMap((line) =>
      tokenize(line).map((keyword) => ({ keyword, weight: 1 })),
    ),
    ...(job.niceToHave ?? []).flatMap((line) =>
      tokenize(line).map((keyword) => ({ keyword, weight: 0.5 })),
    ),
  ];

  // Aynı anahtar kelime birden çok satırda geçerse en yüksek ağırlığı alsın
  const keywords = new Map<string, number>();
  weighted.forEach(({ keyword, weight }) => {
    keywords.set(keyword, Math.max(keywords.get(keyword) ?? 0, weight));
  });
  if (keywords.size === 0) return 0;

  let total = 0;
  let covered = 0;
  keywords.forEach((weight, keyword) => {
    total += weight;
    for (const token of candidateTokens) {
      if (matches(keyword, token)) {
        covered += weight;
        break;
      }
    }
  });

  return Math.round((covered / total) * 100);
}

/** Başvuru formundaki alanlardan eşleştirilecek metni toplar */
export function candidateTextFrom(values: {
  headline?: string;
  company?: string;
  experience?: string;
  education?: string;
  cvName?: string;
  note?: string;
  answers?: Record<string, string>;
}): string {
  return [
    values.headline,
    values.company,
    values.experience,
    values.education,
    values.cvName?.replace(/[-_]/g, " ").replace(/\.[a-z]+$/i, ""),
    values.note,
    ...Object.values(values.answers ?? {}),
  ]
    .filter(Boolean)
    .join(" ");
}
