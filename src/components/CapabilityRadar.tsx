"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./CapabilityRadar.module.css";

type Bilingual = { en: string; cn: string };
type Discipline = {
  key: string;
  label: Bilingual;
  shortLabel: Bilingual;
  scope: Bilingual;
  evidence: Bilingual;
  outputs: Bilingual;
  links: { href: string; label: string }[];
};

// These are areas of ownership, not a self-assessed proficiency scale.
// Evidence is grounded in the Axel, Hyundai and TikTok case studies.
const disciplines: Discipline[] = [
  {
    key: "product",
    label: { en: "Product design", cn: "产品设计" },
    shortLabel: { en: "Product design", cn: "产品设计" },
    scope: { en: "Shape the experience", cn: "定义产品体验" },
    evidence: { en: "Turn product problems into flows, components and interaction states, then carry those decisions into the running product.", cn: "从产品问题出发，梳理流程、组件和交互状态，再把设计决策推进到实际产品中。" },
    outputs: { en: "Figma · flows · design tokens · prototypes", cn: "Figma · 用户流程 · 设计变量 · 原型" },
    links: [{ href: "/work/axel", label: "Axel" }],
  },
  {
    key: "frontend",
    label: { en: "Frontend engineering", cn: "前端工程" },
    shortLabel: { en: "Frontend", cn: "前端工程" },
    scope: { en: "Ship production PRs", cn: "直接交付生产代码 PR" },
    evidence: { en: "Build the components, responsive layouts and motion myself. My main deliverable is a reviewable PR with a working preview.", cn: "亲自实现组件、响应式布局和动效。我的主要交付物，是带有运行预览、可以直接评审的 PR。" },
    outputs: { en: "React · Next.js · TypeScript · QA", cn: "React · Next.js · TypeScript · 测试" },
    links: [{ href: "/work/axel", label: "Axel" }],
  },
  {
    key: "brand",
    label: { en: "Brand & campaigns", cn: "品牌与广告" },
    shortLabel: { en: "Brand & campaigns", cn: "品牌与广告" },
    scope: { en: "Connect brand to product", cn: "连接品牌与产品" },
    evidence: { en: "Own visual identity and core campaign creative, carrying the same direction from the ad into the landing page and product.", cn: "负责品牌视觉和核心广告创意，让广告、落地页和产品保持连贯的视觉方向。" },
    outputs: { en: "Identity · campaign creative · landing pages", cn: "品牌视觉 · 广告创意 · 落地页" },
    links: [{ href: "/work/axel", label: "Axel" }],
  },
  {
    key: "email",
    label: { en: "Email experiences", cn: "邮件体验" },
    shortLabel: { en: "Email experiences", cn: "邮件体验" },
    scope: { en: "Make every message work", cn: "把邮件作为产品来做" },
    evidence: { en: "Design and implement transactional emails, handle event data and missing states, and check rendering before delivery.", cn: "设计并实现交易类邮件，处理事件数据与缺失状态，检查不同场景下的渲染效果。" },
    outputs: { en: "Customer.io · Liquid · templates · testing", cn: "Customer.io · Liquid · 模板 · 测试" },
    links: [{ href: "/work/axel", label: "Axel" }],
  },
  {
    key: "ai",
    label: { en: "AI workflow", cn: "AI 工作流" },
    shortLabel: { en: "AI workflow", cn: "AI 工作流" },
    scope: { en: "Iterate, then verify", cn: "快速实现，认真验证" },
    evidence: { en: "Use AI coding tools to explore and implement faster, while owning the final experience, code review and checks.", cn: "用 AI 编码工具加快探索与实现，同时对最终体验、代码评审和验证负责。" },
    outputs: { en: "Claude Code · Cursor · previews · verification", cn: "Claude Code · Cursor · 预览 · 验证" },
    links: [{ href: "/work/axel", label: "Axel" }],
  },
  {
    key: "research",
    label: { en: "Research", cn: "用户研究" },
    shortLabel: { en: "Research", cn: "用户研究" },
    scope: { en: "Design for trust", cn: "用研究建立信任" },
    evidence: { en: "Bring usability and trust into complex decisions, from L2+ driving interfaces to onboarding and payment verification.", cn: "把可用性和信任带入复杂决策，覆盖 L2+ 驾驶界面、新用户流程与支付身份验证。" },
    outputs: { en: "User research · usability · HMI · KYC", cn: "用户研究 · 可用性 · HMI · KYC" },
    links: [{ href: "/work/hyundai", label: "Hyundai" }, { href: "/work/tiktok", label: "TikTok Pay" }],
  },
];

const points = [[50, 8], [82, 27], [82, 65], [50, 84], [18, 65], [18, 27]];
const polygon = points.map(([x, y]) => `${x},${y}`).join(" ");

function DisciplineIcon({ index }: { index: number }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {index === 0 && <><path d="M5 18C5 10 19 14 19 6M5 5h14M5 5v13M19 6v13" /><path d="M3 3h4v4H3zM17 17h4v4h-4z" fill="var(--color-paper)" /><circle cx="19" cy="5" r="2" /><circle cx="5" cy="19" r="2" /></>}
      {index === 1 && <path d="m7 6-5 6 5 6m10-12 5 6-5 6m-3-14-4 16" />}
      {index === 2 && <><path d="M3 8h18v13H3zM3 3h8v5M8 21V8" /><circle cx="16" cy="14.5" r="2.5" /><path d="M14 3h7" /></>}
      {index === 3 && <><rect x="2.5" y="5" width="19" height="14" rx="1.5" /><path d="m3 6 9 7 9-7M3 18l6-6m12 6-6-6" /></>}
      {index === 4 && <><path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2Z" /><path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8Z" fill="var(--color-paper)" /></>}
      {index === 5 && <><circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6M7 10h6m-3-3v6" /></>}
    </svg>
  );
}

export function CapabilityRadar() {
  const cn = useLocale() === "cn";
  const tr = (value: Bilingual) => cn ? value.cn : value.en;
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(1);
  const current = disciplines[active];

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % disciplines.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + disciplines.length - 1) % disciplines.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = disciplines.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        <span>{cn ? "我的工作范围" : "WHERE I TAKE OWNERSHIP"}</span>
        <span className={styles.count}>06</span>
      </figcaption>

      <div className={styles.map}>
        <svg className={styles.connections} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <polygon points={polygon} fill="currentColor" fillOpacity=".025" stroke="currentColor" strokeOpacity=".18" strokeWidth=".25" />
          {points.map(([x, y], i) => <line key={i} x1="50" y1="46" x2={x} y2={y} className={styles.spoke} data-active={active === i} />)}
          <path d="M18 27 82 65M82 27 18 65" stroke="currentColor" strokeOpacity=".045" strokeWidth=".25" />
        </svg>

        <div className={styles.center} aria-hidden="true">
          <span className={styles.centerOverline}>{cn ? "双向协作" : "ONE PRACTICE"}</span>
          <span className={styles.centerTitle}>{cn ? "设计" : "Design"}</span>
          <span className={styles.centerBridge}>↔</span>
          <span className={styles.centerTitle}>{cn ? "代码" : "Code"}</span>
          <span className={styles.centerFoot}>{cn ? "由我交付" : "SHIPPED BY ME"}</span>
        </div>

        <div role="tablist" aria-label={cn ? "工作领域，使用方向键切换" : "Disciplines; use arrow keys to explore"} className={styles.tabs}>
          {disciplines.map((discipline, i) => (
            <button
              key={discipline.key}
              ref={(element) => { refs.current[i] = element; }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-controls={`${id}-evidence`}
              aria-selected={active === i}
              aria-label={tr(discipline.label)}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(event) => navigate(event, i)}
              className={styles.node}
              style={{ left: `${points[i][0]}%`, top: `${points[i][1]}%` }}
            >
              <span className={styles.icon}><DisciplineIcon index={i} /></span>
              <span className={styles.nodeLabel}>{tr(discipline.shortLabel)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.evidence} id={`${id}-evidence`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
        <div className={styles.evidenceMeta}>
          <span>{String(active + 1).padStart(2, "0")} / {tr(current.label)}</span>
          <span>{cn ? "工作实践" : "IN PRACTICE"}</span>
        </div>
        <h3 className={styles.evidenceTitle}>{tr(current.scope)}</h3>
        <p className={styles.evidenceBody}>{tr(current.evidence)}</p>
        <p className={styles.outputs}>{tr(current.outputs)}</p>
        <div className={styles.caseLinks}>
          <span>{cn ? "相关项目" : "SEE THE WORK"}</span>
          {current.links.map((link) => <Link key={link.href} href={link.href}>{link.label}<span aria-hidden="true">↗</span></Link>)}
        </div>
      </div>
    </figure>
  );
}
