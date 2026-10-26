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

  // Simplified (Aspen, 2026-10-25: 「这里也保持内容 但是设计简化」): the six
  // areas as a plain list beside the one in view; no radial map or icons.
  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        <b>{cn ? "我的工作范围" : "Areas of ownership"}</b>
        {cn ? "设计 ↔ 代码，同一个实践" : "Design ↔ Code, one practice"}
      </figcaption>

      <div role="tablist" aria-label={cn ? "工作领域，使用方向键切换" : "Disciplines; use arrow keys to explore"} className={styles.list}>
        {disciplines.map((discipline, i) => (
          <button
            key={discipline.key}
            ref={(element) => { refs.current[i] = element; }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-controls={`${id}-evidence`}
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(i); }}
            onKeyDown={(event) => navigate(event, i)}
            className={styles.item}
          >
            <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
            {tr(discipline.label)}
          </button>
        ))}
      </div>

      <div className={styles.evidence} id={`${id}-evidence`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
        <h3 className={styles.evidenceTitle}>{tr(current.scope)}</h3>
        <p className={styles.evidenceBody}>{tr(current.evidence)}</p>
        <p className={styles.outputs}>{tr(current.outputs)}</p>
        <p className={styles.caseLinks}>
          {cn ? "相关项目" : "See the work"}
          {current.links.map((link) => <Link key={link.href} href={link.href}>{link.label} ↗</Link>)}
        </p>
      </div>
    </figure>
  );
}
