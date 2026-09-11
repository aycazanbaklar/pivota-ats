"use client";

import type { ReactNode } from "react";
import { InternalProvider } from "@/components/internal/internal-context";
import { AppShell } from "@/components/internal/app-shell";

export default function InternalLayout({ children }: { children: ReactNode }) {
  return (
    <InternalProvider>
      <AppShell>{children}</AppShell>
    </InternalProvider>
  );
}
