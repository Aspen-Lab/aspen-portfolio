import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CursorOrb } from "@/components/CursorOrb";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { SITE_URL, homeCopy, htmlLang, pageMeta } from "@/lib/seo";
import "../globals.css";

/* One family (Aspen, 2026-10-24: 「更好的字体」, chose D · Switzer): Switzer,
   a Swiss neo-grotesk from the Indian Type Foundry's Fontshare (ITF Free
   Font License: free for commercial use, self-hosted here). It sets the
   headlines light and tight and the text at its regular weight; Geist
   Mono stays only for code and small structural labels. Chinese falls
   back to the system grotesk (PingFang SC on Apple). It replaced
   Newsreader (headlines) and Geist (text). */
const switzer = localFont({
  src: [
    { path: "../fonts/Switzer-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/Switzer-VariableItalic.woff2", weight: "100 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-switzer",
});

// Home copy doubles as the fallback for pages without their own (the
// 404); every real page overrides title, canonical and share card.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = homeCopy(locale);
  // No alternates here — a canonical set in the layout would be
  // inherited by every page that forgot its own.
  const { openGraph, twitter } = pageMeta(locale, "", copy);

  return { metadataBase: new URL(SITE_URL), ...copy, openGraph, twitter };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<unknown>;
}) {
  const { locale } = (await params) as { locale: string };
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // The site is one bilingual experience; html lang reflects the active route.
  return (
    <html lang={htmlLang(locale)} className={`${switzer.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper text-ink antialiased">
        <a href="#main-content" className="skip-link">
          {locale === "cn" ? "跳到正文" : "Skip to content"}
        </a>
        <NextIntlClientProvider>
          <Nav />
          <main id="main-content" tabIndex={-1} className="flex-1 scroll-mt-28">{children}</main>
          <Footer />
          <CursorOrb />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
