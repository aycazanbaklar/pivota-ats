"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  CANDIDATES,
  stageLabel,
  type ActivityEntry,
  type Candidate,
  type StageId,
} from "@/lib/pipeline";
import { getRole, type RoleDefinition } from "@/lib/roles";
import { getSupabase } from "@/lib/supabase/client";
import { signOut as supabaseSignOut, useSession } from "@/lib/supabase/session";

export type BoardFilter = "tumu" | "onay-bekleyen" | "son-asama";

export type StageToastState = { id: number; text: string } | null;

type InternalContextValue = {
  role: RoleDefinition;
  candidates: Candidate[];
  moveCandidate: (id: string, stage: StageId) => void;
  completeAction: (id: string, summary: string) => void;
  query: string;
  setQuery: (value: string) => void;
  boardFilter: BoardFilter;
  setBoardFilter: (value: BoardFilter) => void;
  toast: StageToastState;
  dismissToast: () => void;
  dataNotice: string | null;
  signOut: () => void;
};

const InternalContext = createContext<InternalContextValue | null>(null);

export function useInternal() {
  const value = useContext(InternalContext);
  if (!value) throw new Error("useInternal yalnızca iç uygulama içinde kullanılır");
  return value;
}

type CandidateRow = {
  id: string;
  name: string;
  headline: string;
  job_code: string;
  stage_id: StageId;
  score: number;
  source: Candidate["source"];
  pending_action: Candidate["pendingAction"] | null;
  location: string;
  experience: string;
  education: string;
  cv_file_name: string;
  cv_size: string;
  highlights: string[];
  activity: ActivityEntry[];
  last_activity_at: string;
  job_postings: { title: string } | null;
};

function hoursSince(iso: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 3600000));
}

function rowToCandidate(row: CandidateRow): Candidate {
  return {
    id: row.id,
    name: row.name,
    headline: row.headline,
    jobCode: row.job_code,
    jobTitle: row.job_postings?.title ?? row.job_code,
    stage: row.stage_id,
    score: row.score,
    source: row.source,
    lastActivityHours: hoursSince(row.last_activity_at),
    pendingAction: row.pending_action ?? undefined,
    location: row.location,
    experience: row.experience,
    education: row.education,
    cvFileName: row.cv_file_name,
    cvSize: row.cv_size,
    highlights: row.highlights ?? [],
    activity: row.activity ?? [],
  };
}

export function InternalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const session = useSession();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [dataNotice, setDataNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [boardFilter, setBoardFilter] = useState<BoardFilter>("tumu");
  const [toast, setToast] = useState<StageToastState>(null);

  const roleId = session.status === "signed-in" ? session.profile.role : null;
  const isStaff = roleId !== null && roleId !== "aday";

  /* ---------- Oturum koruması ---------- */
  useEffect(() => {
    if (session.status === "anon") router.replace("/giris");
    // Aday oturumu iç uygulamaya girmez
    if (session.status === "signed-in" && session.profile.role === "aday") {
      router.replace("/");
    }
  }, [session, router]);

  /* ---------- Adayları Supabase'ten yükle ---------- */
  useEffect(() => {
    if (!isStaff) return;
    let active = true;

    void getSupabase()
      .from("candidates")
      .select(
        "id,name,headline,job_code,stage_id,score,source,pending_action,location,experience,education,cv_file_name,cv_size,highlights,activity,last_activity_at,job_postings(title)",
      )
      .order("last_activity_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data) {
          setCandidates(CANDIDATES);
          setDataNotice(
            "Adaylar Supabase'ten yüklenemedi; ekranda yerel örnek veri gösteriliyor.",
          );
        } else {
          setCandidates((data as unknown as CandidateRow[]).map(rowToCandidate));
        }
        setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [isStaff]);

  /**
   * Aşama değişimi tek bir state güncellemesi: aday aşaması, aktivite geçmişi ve
   * anlık geri bildirim birlikte yazılır; ardından Supabase'e kalıcılaştırılır.
   */
  const moveCandidate = useCallback(
    (id: string, stage: StageId) => {
      const target = candidates.find((candidate) => candidate.id === id);
      if (!target || target.stage === stage) return;

      const at = Date.now();
      const from = stageLabel(target.stage);
      const to = stageLabel(stage);
      const entry: ActivityEntry = {
        hoursAgo: 0,
        at,
        text: `${from} → ${to} aşamasına taşındı`,
      };
      const activity = [entry, ...target.activity];

      setCandidates((current) =>
        current.map((candidate) =>
          candidate.id === id
            ? { ...candidate, stage, lastActivityHours: 0, activity }
            : candidate,
        ),
      );

      setToast({ id: at, text: `${target.name}, ${to} aşamasına taşındı.` });

      void getSupabase()
        .from("candidates")
        .update({
          stage_id: stage,
          activity,
          last_activity_at: new Date(at).toISOString(),
          updated_at: new Date(at).toISOString(),
        })
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            setDataNotice(
              `${target.name} için aşama değişikliği kaydedilemedi; ekrandaki durum yalnızca bu oturumda geçerli.`,
            );
          }
        });
    },
    [candidates],
  );

  const completeAction = useCallback(
    (id: string, summary: string) => {
      const target = candidates.find((candidate) => candidate.id === id);
      if (!target) return;

      const at = Date.now();
      const activity: ActivityEntry[] = [
        { hoursAgo: 0, at, text: summary },
        ...target.activity,
      ];

      setCandidates((current) =>
        current.map((candidate) =>
          candidate.id === id
            ? {
                ...candidate,
                pendingAction: undefined,
                lastActivityHours: 0,
                activity,
              }
            : candidate,
        ),
      );

      void getSupabase()
        .from("candidates")
        .update({
          pending_action: null,
          activity,
          last_activity_at: new Date(at).toISOString(),
          updated_at: new Date(at).toISOString(),
        })
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            setDataNotice(
              `${target.name} için aksiyon kaydedilemedi; ekrandaki durum yalnızca bu oturumda geçerli.`,
            );
          }
        });
    },
    [candidates],
  );

  const dismissToast = useCallback(() => setToast(null), []);

  const signOut = useCallback(() => {
    void supabaseSignOut().then(() => router.push("/giris"));
  }, [router]);

  const value = useMemo<InternalContextValue | null>(() => {
    if (!roleId || roleId === "aday" || !loaded) return null;
    const base = getRole(roleId);
    return {
      role: {
        ...base,
        person:
          session.status === "signed-in" && session.profile.full_name
            ? session.profile.full_name
            : base.person,
      },
      candidates,
      moveCandidate,
      completeAction,
      query,
      setQuery,
      boardFilter,
      setBoardFilter,
      toast,
      dismissToast,
      dataNotice,
      signOut,
    };
  }, [
    roleId,
    loaded,
    session,
    candidates,
    moveCandidate,
    completeAction,
    query,
    boardFilter,
    toast,
    dismissToast,
    dataNotice,
    signOut,
  ]);

  if (!value) {
    return (
      <div className="text-muted t-caption flex min-h-dvh items-center justify-center">
        Workspace açılıyor…
      </div>
    );
  }

  return (
    <InternalContext.Provider value={value}>{children}</InternalContext.Provider>
  );
}
