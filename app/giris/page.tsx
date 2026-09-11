"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSupabase } from "@/lib/supabase/client";
import { ROLES, getRole, isRoleId } from "@/lib/roles";

const DEMO_ACCOUNTS = ROLES.map((role) => ({
  role: role.id,
  label: role.id === "aday" ? "Aday" : role.title,
  email: `${role.id}@pivota.test`,
}));

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const supabase = getSupabase();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !data.user) {
      setPending(false);
      setError(
        "E-posta veya parola hatalı. Bilgileri kontrol edip tekrar deneyin.",
      );
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const roleId = isRoleId(profile?.role ?? null) ? profile!.role : "aday";
    router.push(getRole(roleId).defaultRoute);
  };

  return (
    <>
      <SiteHeader showAccount={false} />

      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-12 md:px-8 md:py-16">
        <h1 className="t-h1">Pivota&apos;ya giriş</h1>
        <p className="t-body-lg text-muted mt-3 max-w-[62ch]">
          E-posta ve parolanızla giriş yapın. Rolünüz hesabınıza bağlıdır ve
          girişten sonra kendi varsayılan ekranınız açılır.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-8 max-w-[420px]">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="t-body flex min-h-[22px] items-center font-medium"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field"
              placeholder="ad@pivota.test"
              required
            />
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <label
              htmlFor="password"
              className="t-body flex min-h-[22px] items-center font-medium"
            >
              Parola
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field"
              required
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="t-caption text-danger-ink mt-4 flex items-start gap-1.5"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary mt-6 w-full"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Giriş yapılıyor…
              </>
            ) : (
              "Giriş yap"
            )}
          </button>
        </form>

        <section className="border-line mt-10 border-t pt-6">
          <h2 className="t-caption text-muted font-semibold tracking-wide uppercase">
            Demo hesapları
          </h2>
          <p className="t-caption text-muted mt-2">
            Parola: <span className="mono text-ink font-semibold">password1</span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.role}>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword("password1");
                    setError(null);
                  }}
                  className="border-line bg-surface hover:border-accent hover:bg-accent-soft/40 focus-visible:outline-accent flex min-h-11 items-center gap-2 rounded-[10px] border px-3 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span className="text-ink font-semibold">{account.label}</span>
                  <span className="text-muted mono">{account.email}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
