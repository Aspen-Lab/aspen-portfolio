import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lato } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { routing } from "@/i18n/routing";
import "../globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aspen-portfolio.vercel.app"),
  title: "Aspen W. — Sole Designer at Axel",
  description:
    "Sole designer at Axel (Gordian, YC W19) — designs and ships production code. Founder of XING Art ($300K MiraclePlus '25). iF + Red Dot + IDEA 2025. GT dual major in Industrial Design + Psychology.",
};

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
    <html lang={locale} className={lato.variable}>
      <body className="min-h-screen flex flex-col bg-paper text-ink antialiased">
        <NextIntlClientProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <CustomCursor />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
