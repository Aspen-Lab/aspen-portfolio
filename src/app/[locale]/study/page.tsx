import type { Metadata } from "next";
import { NotionAPI } from "notion-client";
import { NotionPage } from "@/components/NotionPage";
import type { Locale } from "@/i18n/routing";

const PAGE_ID = "29106c193aa980b3b791d7d7fe378e89";

export const metadata: Metadata = {
  title: "Study — Aspen W.",
  description: "Design studies and research notes by Aspen W.",
};

export const revalidate = 3600; // re-fetch every hour

export default async function StudyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await params;
  const notion = new NotionAPI();
  const recordMap = await notion.getPage(PAGE_ID);

  return (
    <article className="pb-32">
      <div className="container-fluid pt-8 sm:pt-12">
        <NotionPage recordMap={recordMap} />
      </div>
    </article>
  );
}
