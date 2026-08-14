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
import { CursorLight } from "@/components/CursorLight";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cn = locale === "cn";

  return {
    metadataBase: new URL("https://aspen-portfolio.vercel.app"),
    title: cn ? "Aspen W. — Axel 唯一设计师" : "Aspen W. — Sole Designer at Axel",
    description: cn
      ? "Aspen W. 是 Axel(Gordian, YC W19)唯一设计师，直接交付产品设计与生产代码。XING Art 创始人之一，MiraclePlus $300K，2025 iF + Red Dot + IDEA 获奖，Georgia Tech 工业设计 + 心理学双专业。"
      : "Sole designer at Axel (Gordian, YC W19) — designs and ships production code. Founder of XING Art ($300K MiraclePlus '25). iF + Red Dot + IDEA 2025. GT dual major in Industrial Design + Psychology.",
  };
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
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper text-ink antialiased">
        <NextIntlClientProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <CursorLight />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
