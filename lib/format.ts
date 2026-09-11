const DAY = 24 * 60 * 60 * 1000;

/** Gün hassasiyetinde göreli tarih — "3 gün önce", "2 hafta önce" */
export function relativeDate(iso: string): string {
  const posted = new Date(`${iso}T00:00:00Z`).getTime();
  const now = Date.now();
  const days = Math.max(0, Math.floor((now - posted) / DAY));

  if (days === 0) return "Bugün";
  if (days === 1) return "Dün";
  if (days < 7) return `${days} gün önce`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} hafta önce`;
  }
  const months = Math.floor(days / 30);
  return `${months} ay önce`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
