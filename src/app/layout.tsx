import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aspen-portfolio.vercel.app"),
  title: "Aspen W. — Product Designer",
  description:
    "Product designer who blends creativity with technical expertise. 4+ years across TikTok, Hyundai, Slashy (YC25), CDC, and XING Art. iF Design Award & IDEA Student Award winner. Currently designing flight & hotel repricing at Axel (Gordian, YC W19).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper text-ink antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <CustomCursor />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
