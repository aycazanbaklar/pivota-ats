export type RoleId = "aday" | "uzman" | "yonetici" | "mudur";
export type InternalRoleId = Exclude<RoleId, "aday">;

export type RoleDefinition = {
  id: RoleId;
  title: string;
  person: string;
  summary: string;
  /** Rol seçildiğinde düşülecek varsayılan rota */
  defaultRoute: "/" | "/pipeline" | "/bekleyen-aksiyonlar";
};

export const ROLES: RoleDefinition[] = [
  {
    id: "aday",
    title: "Aday",
    person: "Elif Demirtaş",
    summary:
      "Açık pozisyonları inceler ve başvurusunu tamamlar. Açık pozisyonlar sayfasıyla açılır.",
    defaultRoute: "/",
  },
  {
    id: "uzman",
    title: "İK Uzmanı",
    person: "Selin Aydın",
    summary:
      "Pipeline'ı günlük yöneten kullanıcı. Tüm aşamaları görür, adayları taşır, arama ve filtre kullanır.",
    defaultRoute: "/pipeline",
  },
  {
    id: "yonetici",
    title: "Hiring Manager",
    person: "Burak Şen",
    summary:
      "Sisteme seyrek girer. Yalnızca kendisinden onay veya scorecard bekleyen adaylarla ilgilenir.",
    defaultRoute: "/bekleyen-aksiyonlar",
  },
  {
    id: "mudur",
    title: "İK Yöneticisi",
    person: "Deniz Korkmaz",
    summary:
      "Karar verici. Pipeline'ın üstünde üç kritik metriği görür, metrikten board'a iner.",
    defaultRoute: "/pipeline",
  },
];

export const WORKSPACE = "Pivota İK";

export function getRole(id: RoleId): RoleDefinition {
  return ROLES.find((role) => role.id === id) ?? ROLES[0];
}

export const ROLE_STORAGE_KEY = "pivota:active-role";

export function isRoleId(value: string | null): value is RoleId {
  return (
    value === "aday" ||
    value === "uzman" ||
    value === "yonetici" ||
    value === "mudur"
  );
}

export function isInternalRole(value: RoleId | null): value is InternalRoleId {
  return value !== null && value !== "aday";
}

/** Aktif rolü tarayıcı depolamasından okur — sunucuda çağrılamaz */
export function readStoredRole(): RoleId | null {
  try {
    const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
    return isRoleId(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function clearStoredRole() {
  try {
    window.localStorage.removeItem(ROLE_STORAGE_KEY);
  } catch {
    /* yoksayılır */
  }
}
