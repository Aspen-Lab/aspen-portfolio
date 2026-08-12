import type { Metadata } from "next";
import { NotionAPI } from "notion-client";
import { NotionPage } from "@/components/NotionPage";
import type { Locale } from "@/i18n/routing";

const PAGE_ID = "29106c193aa980b3b791d7d7fe378e89";
const NOTION_URL = `https://www.notion.so/${PAGE_ID}`;

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
  const { locale } = (await params) as { locale: Locale };
  const isCn = locale === "cn";

  // Notion's unofficial API intermittently 403s datacenter IPs. Never let
  // that take the whole build (or an ISR revalidation) down — fall back to
  // a link-out and recover on a later revalidate.
  let recordMap = null;
  try {
    const notion = new NotionAPI();
    recordMap = await notion.getPage(PAGE_ID);
  } catch (err) {
    console.error("[study] Notion fetch failed, rendering fallback:", err);
  }

  return (
    <article className="pb-32">
      <div className="container-fluid pt-8 sm:pt-12">
        {recordMap ? (
          <NotionPage recordMap={recordMap} />
        ) : (
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-soft mb-4">
              {isCn ? "研习 · 暂时离线" : "Studies · temporarily offline"}
            </p>
            <p className="text-[16px] text-mute leading-[1.7]">
              {isCn
                ? "研究笔记暂时加载不出来（Notion 源不可达）。可以直接在 Notion 里阅读："
                : "The research notes can't be loaded right now (the Notion source is unreachable). You can read them directly on Notion:"}
            </p>
            <a
              href={NOTION_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:text-mute transition-colors"
            >
              {isCn ? "在 Notion 打开" : "Open in Notion"} ↗
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
