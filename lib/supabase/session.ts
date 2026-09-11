"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "./client";
import type { RoleId } from "@/lib/roles";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: RoleId;
};

export type SessionState =
  | { status: "loading" }
  | { status: "anon" }
  | { status: "signed-in"; profile: Profile };

/** Oturum + profil rolü tek kaynaktan okunur (auth.users → public.profiles) */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ status: "loading" });

  useEffect(() => {
    const supabase = getSupabase();
    let active = true;

    const resolve = async (session: Session | null) => {
      if (!session?.user) {
        if (active) setState({ status: "anon" });
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", session.user.id)
        .single();

      if (!active) return;
      setState(
        error || !data
          ? { status: "anon" }
          : { status: "signed-in", profile: data as Profile },
      );
    };

    void supabase.auth
      .getSession()
      .then(({ data }) => resolve(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        void resolve(session);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function signOut() {
  await getSupabase().auth.signOut();
}
