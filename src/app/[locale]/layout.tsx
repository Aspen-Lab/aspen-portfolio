import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
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
    <html lang={htmlLang(locale)} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper text-ink antialiased">
        <NextIntlClientProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <CursorOrb />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
