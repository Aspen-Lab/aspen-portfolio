import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  // Studies are temporarily unpublished; keep existing links in the same language.
  redirect({ href: "/", locale });
}
