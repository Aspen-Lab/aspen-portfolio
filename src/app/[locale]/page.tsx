import type { Metadata } from "next";
import { TabsHome } from "@/components/TabsHome";
import type { Locale } from "@/i18n/routing";
import { homeCopy, pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, "", homeCopy(locale));
}

export default function Home() {
  return <TabsHome />;
}
