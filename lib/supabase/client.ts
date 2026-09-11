"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}

/**
 * OAuth sağlayıcıları bilinçli olarak yapılandırılmadı.
 * Anahtar boş olduğu sürece LinkedIn/Google butonları gerçek OAuth'a gitmez,
 * mevcut mock doldurma davranışına düşer.
 */
export const oauthConfigured = {
  linkedin: Boolean(process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID),
  google: Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
};
