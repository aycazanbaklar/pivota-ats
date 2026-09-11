import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pivota — Açık Pozisyonlar",
  description:
    "Pivota'da açık pozisyonları inceleyin ve birkaç dakikada başvurunuzu tamamlayın.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-canvas text-ink flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
