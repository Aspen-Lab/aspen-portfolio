import Image from "next/image";
import type { Metadata } from "next";
import { moreWork, awards } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { Reveal } from "@/components/Reveal";
import { BootSequence } from "@/components/BootSequence";
import { PageEntrance } from "@/components/PageEntrance";
import { BootReveal } from "@/components/BootReveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cn = locale === "cn";

  return {
    title: cn ? "关于 — Aspen W." : "About — Aspen W.",
    description: cn
      ? "一半是设计师，一半是心理学者，永远在交付。Aspen W. 是 Georgia Tech 双学位学生，目前在 Axel(Gordian, YC W19)担任 Design Engineer，直接向 CEO 汇报。"
      : "Half designer, half psychologist, always shipping. Aspen W. — dual-degree at Georgia Tech, currently a Design Engineer at Axel (Gordian, YC W19), reporting directly to the CEO.",
  };
}

type CapIcon = "design" | "code" | "brand" | "research";

const CAPABILITIES: ReadonlyArray<{
  name: string;
  tag: string;
  desc: string;
  icon: CapIcon;
}> = [
  {
    name: "Product Design",
    tag: "0→1 · end-to-end",
    desc: "Multi-country KYC, automotive HMI, fintech flows — research through shipped UI.",
    icon: "design",
  },
  {
    name: "Design Engineering",
    tag: "React · production",
    desc: "I ship my own design as PRs — same tokens, components, and stack as the team.",
    icon: "code",
  },
  {
    name: "Brand & Visual",
    tag: "identity · motion",
    desc: "Type, systems, packaging, motion — from CDC packaging to product marks.",
    icon: "brand",
  },
  {
    name: "Research × Psychology",
    tag: "behavior · cog-sci",
    desc: "GT Psych dual degree — usability, trust, the gap between said and done.",
    icon: "research",
  },
];

const CAPABILITIES_CN: typeof CAPABILITIES = [
  {
    name: "产品设计",
    tag: "0→1 · 端到端",
    desc: "多国 KYC、汽车 HMI、金融科技流程 —— 从研究到上线 UI。",
    icon: "design",
  },
  {
    name: "设计工程",
    tag: "React · 生产环境",
    desc: "我把自己的设计直接作为 PR 交付 —— token、组件、技术栈和团队保持一致。",
    icon: "code",
  },
  {
    name: "品牌与视觉",
    tag: "identity · motion",
    desc: "字体、系统、包装、动效 —— 从 CDC 包装到产品标识。",
    icon: "brand",
  },
  {
    name: "研究 × 心理学",
    tag: "behavior · cog-sci",
    desc: "Georgia Tech 心理学双学位 —— 可用性、信任，以及说出口与真实行为之间的差距。",
    icon: "research",
  },
];

function CapabilityGlyph({ icon }: { icon: CapIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-[18px] h-[18px]",
    "aria-hidden": true,
  };
  switch (icon) {
    case "design":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <path d="M9 8l-4 4 4 4M15 8l4 4-4 4M13 6l-2 12" />
        </svg>
      );
    case "brand":
      return (
        <svg {...common}>
          <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
        </svg>
      );
    case "research":
      return (
        <svg {...common}>
          <circle cx="6" cy="7" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="11" cy="18" r="2" />
          <path d="M7.7 8.2l2.4 8M7.9 6.7l8.2-.6" />
        </svg>
      );
  }
}

const TRAJECTORY: ReadonlyArray<{ org: string; role: string; period: string }> = [
  {
    org: "Axel · Gordian (YC W19)",
    role: "Sole Designer · reports to CEO",
    period: "Dec 2025 — Now",
  },
  {
    org: "TikTok · PIPO UED",
    role: "Product Designer (Intern) · TikTok Pay KYC",
    period: "Jun — Sep 2025",
  },
  {
    org: "Hyundai · HATCI Lab",
    role: "HMI Designer · IONIQ 6 L2+",
    period: "Jan — May 2025",
  },
  {
    org: "XING Art",
    role: "Co-founder & Product Designer · $300K MiraclePlus",
    period: "2022 — 2025",
  },
  {
    org: "CDC · NWSS Lab",
    role: "Product Designer · CryoSave (IDEA Award)",
    period: "Aug — Dec 2023",
  },
];

const TRAJECTORY_CN: typeof TRAJECTORY = [
  {
    org: "Axel · Gordian (YC W19)",
    role: "唯一设计师 · 直接汇报 CEO",
    period: "2025.12 — 至今",
  },
  {
    org: "TikTok · PIPO UED",
    role: "产品设计实习生 · TikTok Pay KYC",
    period: "2025.06 — 09",
  },
  {
    org: "Hyundai · HATCI Lab",
    role: "HMI 设计师 · IONIQ 6 L2+",
    period: "2025.01 — 05",
  },
  {
    org: "XING Art",
    role: "联合创始人 & 产品设计师 · $300K MiraclePlus",
    period: "2022 — 2025",
  },
  {
    org: "CDC · NWSS Lab",
    role: "产品设计师 · CryoSave(IDEA Award)",
    period: "2023.08 — 12",
  },
];

const AWARDS_CN = [
  { title: "iF Design Award", project: "Field of Vision", year: "2025" },
  { title: "Red Dot Design Award", project: "Field of Vision", year: "2025" },
  { title: "IDEA Student Award", project: "CryoSave · CDC NWSS", year: "2025" },
  { title: "Bredendieck Award", project: "Georgia Tech(两次)", year: "" },
  { title: "Humanitarian Award", project: "", year: "" },
  { title: "Atlanta Design Festival", project: "入选认可", year: "" },
];

const MORE_WORK_CN = [
  {
    client: "Vulcan Engineering Solutions",
    role: "UX 设计师 · 结构工程工作流",
    period: "2025.01 — 05",
  },
  {
    client: "Edison Bike",
    role: "产品设计师 · Piedmont Park Mammoth 电动货运车",
    period: "2024.01 — 05",
  },
  {
    client: "Refracted Lab",
    role: "自由设计师 · Web3 界面",
    period: "2024.06 — 08",
  },
  {
    client: "上海交通大学",
    role: "设计研究员 · AI 船舶识别",
    period: "2024.06 — 08",
  },
  {
    client: "CDC NWSS Lab",
    role: "产品设计师 · CryoSave 包装系统(IDEA Award)",
    period: "2023.08 — 12",
  },
  {
    client: "XING Art",
    role: "联合创始人 & 产品设计师 · MiraclePlus '25, $300K, 1K+ 用户",
    period: "2022.12 — 2025.09",
  },
];

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
  priority?: boolean;
};

function Figure({
  src,
  alt,
  caption,
  aspect = "3/4",
  priority = false,
}: FigureProps) {
  return (
    <figure className="group">
      <div
        className="relative h-[clamp(240px,38vh,400px)] w-auto overflow-hidden rounded-[8px] bg-cream photo-frame"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 80vw, 640px"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        />

        {/* Terminal viewfinder · corner ticks + inspect hint on hover. */}
        <span className="pointer-events-none absolute inset-2.5 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-ink/50" />
          <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-ink/50" />
          <span className="absolute left-0 bottom-0 h-3 w-3 border-l border-b border-ink/50" />
          <span className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-ink/50" />
        </span>
        <span className="pointer-events-none absolute right-3 bottom-3 z-10 font-mono text-[9px] uppercase tracking-[0.22em] text-ink bg-paper/70 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          ⤢ Inspect
        </span>
      </div>
      {caption && (
        <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-soft leading-[1.7]">
          <span className="text-soft/50">{"// "}</span>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function SectionTitle({
  number,
  title,
  meta,
}: {
  number: string;
  title: string;
  meta?: string;
}) {
  return (
    <Reveal>
      <div className="border-t border-b border-line py-4 mb-14 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[24px] sm:text-[30px] tracking-[-0.01em] flex items-baseline gap-3 sm:gap-4">
          <span className="font-mono text-soft/70 text-[12px] tracking-[0.2em] uppercase">
            [A-{number}]
          </span>
          {title}
        </h2>
        {meta && (
          <span className="font-mono text-soft/55 text-[10px] tracking-[0.2em] uppercase whitespace-nowrap shrink-0 hidden sm:block">
            {meta}
          </span>
        )}
      </div>
    </Reveal>
  );
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isCn = locale === "cn";
  const capabilities = isCn ? CAPABILITIES_CN : CAPABILITIES;
  const trajectory = isCn ? TRAJECTORY_CN : TRAJECTORY;
  const localizedAwards = isCn ? AWARDS_CN : awards;
  const localizedMoreWork = isCn ? MORE_WORK_CN : moreWork;

  return (
    <>
      <BootSequence />
      <PageEntrance>
      <article className="pb-32">

      <BootReveal delay={0}>
      <section className="container-fluid pt-10 pb-24">
        {/* Framed system panel — the architectural anchor of the page. */}
          <div className="border border-line rounded-[12px] overflow-hidden">
            {/* Window title bar */}
            <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-2.5 border-b border-line bg-cream/30 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-soft">
              <span className="flex items-center gap-2.5 min-w-0">
                <span className="flex gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full border border-line" />
                  <span className="w-2 h-2 rounded-full border border-line" />
                  <span className="w-2 h-2 rounded-full border border-line" />
                </span>
                <span className="text-ink truncate">ASPEN_W</span>
                <span className="text-soft/50 hidden sm:inline">
                  {"// about.sys"}
                </span>
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
                </span>
                {isCn ? "在线" : "Online"}
              </span>
            </div>

            {/* Body grid — meta rail × main column */}
            <div className="grid grid-cols-1 md:grid-cols-[210px_1fr]">
              {/* Left rail — diagnostic key/value index */}
              <dl className="border-b md:border-b-0 md:border-r border-line font-mono text-[11px] uppercase tracking-[0.13em]">
                {(
                  [
                    [isCn ? "角色" : "Role", isCn ? "设计工程师" : "Design Engineer"],
                    [isCn ? "公司" : "At", "Axel · YC W19"],
                    [isCn ? "教育" : "Edu", isCn ? "GT — 工业设计 + 心理学" : "GT — ID + Psych"],
                    [isCn ? "所在地" : "Base", isCn ? "Bellevue, WA" : "Bellevue, WA"],
                    [isCn ? "创办" : "Founded", "XING Art · $300K"],
                    [isCn ? "状态" : "State", isCn ? "持续交付" : "Shipping"],
                  ] as const
                ).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-3 px-4 sm:px-5 py-3 border-b border-line/50 last:border-b-0"
                  >
                    <dt className="text-soft/55">{k}</dt>
                    <dd className="text-mute text-right">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Main — identity headline; the facts now live in the bands below */}
              <div className="flex items-center p-6 sm:p-9 lg:p-12">
                <h1
                  className="font-display font-light tracking-[-0.02em] text-ink leading-[1.02]"
                  style={{ fontSize: "clamp(32px, 4.2vw, 58px)" }}
                >
                  {isCn ? "一半是设计师，" : "Half designer,"}
                  <br />
                  {isCn ? "一半是心理学者，" : "half psychologist,"}
                  <br />
                  <span className="italic font-normal">
                    {isCn ? "永远在交付。" : "always shipping."}
                  </span>
                </h1>
              </div>
            </div>

            {/* Capabilities band — what I do, in the diagnostic-rail idiom */}
            <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] border-t border-line">
              <div className="px-4 sm:px-5 py-4 md:py-6 border-b md:border-b-0 md:border-r border-line font-mono text-[11px] uppercase tracking-[0.13em] flex items-baseline justify-between md:block">
                <span className="text-soft/55">
                  {isCn ? "能力" : "Capabilities"}
                </span>
                <span className="text-soft/35 md:mt-1.5 md:block">[ 04 · stack ]</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {capabilities.map((c, i) => (
                  <div
                    key={c.name}
                    className={`group/cap p-5 sm:p-6 border-line/50 ${i % 2 === 0 ? "sm:border-r" : ""} ${
                      i < CAPABILITIES.length - (CAPABILITIES.length % 2 === 0 ? 2 : 1)
                        ? "border-b"
                        : "border-b sm:border-b-0"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="shrink-0 grid place-items-center w-9 h-9 rounded-[7px] border border-line bg-cream/50 text-mute transition-colors duration-300 group-hover/cap:text-ink group-hover/cap:border-soft">
                        <CapabilityGlyph icon={c.icon} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="font-display text-[16px] sm:text-[17px] tracking-[-0.01em] text-ink">
                            {c.name}
                          </h3>
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft/50 whitespace-nowrap shrink-0">
                            {c.tag}
                          </span>
                        </div>
                        <p className="mt-2 text-[13.5px] leading-[1.6] text-mute max-w-[42ch]">
                          {c.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trajectory band — experience timeline, most recent first */}
            <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] border-t border-line">
              <div className="px-4 sm:px-5 py-4 md:py-6 border-b md:border-b-0 md:border-r border-line font-mono text-[11px] uppercase tracking-[0.13em] flex items-baseline justify-between md:block">
                <span className="text-soft/55">
                  {isCn ? "轨迹" : "Trajectory"}
                </span>
                <span className="text-soft/35 md:mt-1.5 md:block">[ 05 · log ]</span>
              </div>
              <ol className="relative py-1">
                {/* Continuous timeline rail */}
                <span
                  aria-hidden
                  className="absolute left-[1.55rem] sm:left-[1.85rem] top-6 bottom-6 w-px bg-line"
                />
                {trajectory.map((e, i) => (
                  <li
                    key={e.org}
                    className={`relative flex items-baseline justify-between gap-4 pl-11 sm:pl-14 pr-5 sm:pr-6 py-3.5 ${
                      i < TRAJECTORY.length - 1 ? "border-b border-line/50" : ""
                    }`}
                  >
                    {/* Node — current role pulses like the title-bar status dot */}
                    <span
                      aria-hidden
                      className="absolute left-[1.55rem] sm:left-[1.85rem] top-[1.3rem] -translate-x-1/2"
                    >
                      {i === 0 ? (
                        <span className="relative flex w-[9px] h-[9px]">
                          <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />
                          <span className="relative w-[9px] h-[9px] rounded-full bg-ink ring-[3px] ring-paper" />
                        </span>
                      ) : (
                        <span className="block w-[9px] h-[9px] rounded-full bg-paper border border-soft ring-[3px] ring-paper" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="text-ink text-[14.5px] tracking-[-0.005em]">
                        {e.org}
                      </span>
                      <span className="block text-mute text-[13px] leading-[1.5] mt-0.5">
                        {e.role}
                      </span>
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-soft/55 whitespace-nowrap shrink-0 pt-0.5">
                      {e.period}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Footer coordinate strip */}
            <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-2.5 border-t border-line font-mono text-[10px] uppercase tracking-[0.22em] text-soft/55">
              <span>LAT 47.6101 · LON −122.2015</span>
              <span className="hidden sm:inline">
                {isCn ? "REC · 1995 — 至今" : "REC · 1995 — PRESENT"}
              </span>
              <span>EOF</span>
            </div>
          </div>
      </section>
      </BootReveal>

      {/* 01 — Life Style */}
      <BootReveal delay={0.09}>
      <section className="container-fluid mt-8">
        <SectionTitle
          number="01"
          title={isCn ? "生活方式" : "Life Style"}
          meta={isCn ? "模块 · 08 张影像 · 已加载" : "Module · 08 frames · loaded"}
        />

        <Reveal>
          <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-soft mb-12 max-w-md">
            {isCn
              ? "18 岁拥有第一辆车 · Georgia Tech 大一 · 认真想象自己的未来"
              : "Got my car at 18 · Freshman at Georgia Tech · Dreaming about my future"}
          </p>
        </Reveal>

        <div className="flex items-start gap-5 sm:gap-7 overflow-x-auto no-scrollbar snap-x pb-3 pr-[clamp(1.25rem,4vw,3rem)]">
          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/car-georgia-tech.jpg"
                alt="Aspen with her first car at 18, downtown Atlanta at night"
                aspect="3/4"
                caption={
                  isCn
                    ? "18 岁拥有第一辆车 —— GT 大一，认真想象未来"
                    : "Got my car at 18 — freshman at GT, dreaming about my future"
                }
                priority
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/drawing-1.jpg"
                alt="Black-and-white photograph of a parking garage alley with trees"
                aspect="3/4"
                caption={
                  isCn
                    ? "喜欢摄影 —— 用镜头看日常"
                    : "Love photograph — daily life through a lens"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/sketching-bw.png"
                alt="Black-and-white photograph of a brutalist tower against cloudy sky"
                aspect="16/10"
                caption={
                  isCn
                    ? "把日常放进黑白画面里"
                    : "The everyday, framed in black & white"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/sketching-2.png"
                alt="Charcoal sketch of an eye in progress"
                aspect="3/4"
                caption={isCn ? "好像还挺会画" : "Somehow good at drawing"}
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/cool-stuff-roommate.png"
                alt="Multiple charcoal sketches of faces and hands on cream paper"
                aspect="4/3"
                caption={isCn ? "喜欢黑白素描" : "Enjoy B&W sketching"}
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/illuminated-dice-1.png"
                alt="Electronics workbench with soldering iron, microphone, mixed cups and wires"
                aspect="16/10"
                caption={
                  isCn
                    ? "和室友一起做有意思的东西"
                    : "Making cool stuff with my roommate"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/illuminated-dice-2.png"
                alt="Two glowing dice on a red dice tray"
                aspect="1/1"
              />
            </Reveal>
          </div>
          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/workspace-1.png"
                alt="LiPo battery and circuit board feeding a glowing die in a red tray, next to a Polaroid"
                aspect="1/1"
                caption={
                  isCn
                    ? "给桌游做的无线发光骰子"
                    : "Wireless illuminated dice for our table game"
                }
              />
            </Reveal>
          </div>
        </div>
      </section>
      </BootReveal>

      {/* 02 — My Workspace */}
      <BootReveal delay={0.17}>
      <section className="container-fluid mt-32">
        <SectionTitle
          number="02"
          title={isCn ? "我的工作台" : "My Workspace"}
          meta={isCn ? "模块 · 06 张影像 · 已加载" : "Module · 06 frames · loaded"}
        />

        <div className="flex items-start gap-5 sm:gap-7 overflow-x-auto no-scrollbar snap-x pb-3 pr-[clamp(1.25rem,4vw,3rem)]">
          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/workspace-2.png"
                alt="Aspen's desk with dual monitors showing a flip clock and solar system"
                aspect="16/10"
                caption={
                  isCn
                    ? "我的工作台 —— 为了让创造力更顺。少即是多。"
                    : "My workspace — built to enrich creativity. Less is more."
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/bronze-studio-2.png"
                alt="A friend at home holding a Sony camera, taking a photo"
                aspect="3/4"
                caption={
                  isCn
                    ? "房间里总有人拿着相机"
                    : "Always someone with a camera in the room"
                }
              />
            </Reveal>
          </div>
          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/film-washing-1.png"
                alt="Close-up black-and-white photo of someone holding a vintage Edixa Reflex 1000 film camera"
                aspect="4/3"
                caption={
                  isCn
                    ? "胶片相机 —— 一种更慢的观看"
                    : "Film cameras — the slower kind of seeing"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/film-washing-2.png"
                alt="Drawing class with laptop and projector showing arm sketch references on the wall"
                aspect="16/10"
                caption={
                  isCn
                    ? "素描夜晚 —— 墙上是参考，桌上是本子"
                    : "Sketching nights — references on the wall, sketchbooks on the table"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/film-washing-3.png"
                alt="Purple-gloved hand holding a film reel under sink water during developing"
                aspect="3/4"
                caption={
                  isCn
                    ? "手洗胶片 —— 盆里的 PH14"
                    : "Film washing by hand — PH14 in the basin"
                }
              />
            </Reveal>
          </div>
          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/film-washing-4.png"
                alt="Black-and-white film print of a silver SUV parked in front of an old brick building"
                aspect="3/4"
                caption={isCn ? "冲洗后的成片" : "The print, after"}
              />
            </Reveal>
          </div>
        </div>
      </section>
      </BootReveal>

      {/* 03 — Love Music */}
      <BootReveal delay={0.25}>
      <section className="container-fluid mt-32">
        <SectionTitle
          number="03"
          title={isCn ? "热爱音乐" : "Love Music"}
          meta={isCn ? "模块 · 05 张影像 · 已加载" : "Module · 05 frames · loaded"}
        />

        <div className="flex items-start gap-5 sm:gap-7 overflow-x-auto no-scrollbar snap-x pb-3 pr-[clamp(1.25rem,4vw,3rem)]">
          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/bronze-studio-1.png"
                alt="A sunburst acoustic guitar resting on a grey carpet"
                aspect="3/4"
                caption={isCn ? "热爱音乐" : "Love music"}
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/designing-pals-2.png"
                alt="Three bronze-and-clay monk sculptures in a workshop with pegboard wall"
                aspect="3/4"
                caption={isCn ? "在青铜工作室工作" : "Working at a Bronze Studio"}
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/designing-pals-1.png"
                alt="Wooden desk with iPad of horse-anatomy refs, sketchbook drawings, red sculpted clay animals"
                aspect="16/10"
                caption={
                  isCn
                    ? "带着参考做设计 —— 桌面、速写本，以及最后变成的泥稿"
                    : "Designing with reference — desk, sketchbook, and the clay it ends up as"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/neuroscience-1.png"
                alt="Three friends in silhouette jumping against a sunset sky"
                aspect="3/2"
              />
            </Reveal>
          </div>
          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/neuroscience-2.png"
                alt="Portrait of three young men in golden-hour light with mountains behind"
                aspect="3/2"
                caption={
                  isCn
                    ? "和朋友们 —— 他们去读 PhD 前的最后一天"
                    : "With my pals — last day before they head to their PhDs"
                }
              />
            </Reveal>
          </div>
        </div>
      </section>
      </BootReveal>

      {/* 04 — Enjoy Cooking */}
      <BootReveal delay={0.33}>
      <section className="container-fluid mt-32">
        <SectionTitle
          number="04"
          title={isCn ? "喜欢做饭" : "Enjoy Cooking"}
          meta={isCn ? "模块 · 07 张影像 · 已加载" : "Module · 07 frames · loaded"}
        />

        <div className="flex items-start gap-5 sm:gap-7 overflow-x-auto no-scrollbar snap-x pb-3 pr-[clamp(1.25rem,4vw,3rem)]">
          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/cooking.png"
                alt="Jupyter notebook with PSYC 3803 brain-science course materials and downsampling visualization"
                aspect="16/9"
                caption={
                  isCn
                    ? "我喜欢神经科学 —— 在认知科学/心理学双学位里很开心。真的开心。"
                    : "I love neuro-sci — happy in the cog sci dual degree. Yes I am happy."
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/rat-apartment.png"
                alt="Two plates of steak with asparagus, potatoes, and sauce"
                aspect="4/3"
                caption={
                  isCn
                    ? "给我和女朋友做饭"
                    : "Cooking for me and my girlfriend"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/miku-switch.png"
                alt="A small mouse inside a clear plastic terrarium with moss, near a window screen"
                aspect="4/3"
                caption={
                  isCn
                    ? "在公寓里抓到一只小鼠 —— 很可爱，但最后还是请它离开了"
                    : "Caught a rat in my apartment — it's cute, but I made it leave eventually"
                }
              />
            </Reveal>
          </div>
          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/drawing-app.png"
                alt="Teal Nintendo Switch Lite with hand-drawn Hatsune Miku in marker on the back"
                aspect="3/4"
                caption={
                  isCn
                    ? "手绘 Miku Switch Lite —— 给她的圣诞礼物"
                    : "DIY Miku Switch Lite — Xmas gift for my girl"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/xing-art-cat.png"
                alt="iPad screen showing a stylized anime elf girl in progress in a drawing app"
                aspect="16/10"
                caption={
                  isCn
                    ? "用我自己设计的 App 画画"
                    : "Drawing with the app I designed"
                }
              />
            </Reveal>
          </div>
          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/nvidia-line.png"
                alt="A tabby cat with white belly, looking up at the camera"
                aspect="3/4"
                caption={
                  isCn ? "我的猫 —— 超级超级喜欢他" : "My cat — I love him sooooo much"
                }
              />
            </Reveal>
          </div>
        </div>
      </section>
      </BootReveal>

      {/* 05 — Unforgettable Summer */}
      <BootReveal delay={0.41}>
      <section className="container-fluid mt-32">
        <SectionTitle
          number="05"
          title={isCn ? "难忘的夏天" : "Unforgettable Summer"}
          meta={isCn ? "模块 · 09 张影像 · 已加载" : "Module · 09 frames · loaded"}
        />

        <div className="flex items-start gap-5 sm:gap-7 overflow-x-auto no-scrollbar snap-x pb-3 pr-[clamp(1.25rem,4vw,3rem)]">
          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/gtc-1.png"
                alt="Crowd of attendees in winter coats lined up at night outside a convention center"
                aspect="1/1"
                caption={isCn ? "凌晨 4 点排队等 5090" : "Lined up at 4 AM for a 5090"}
              />
            </Reveal>
          </div>
          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/jensen-sign.png"
                alt="Young man at NVIDIA GTC with conference lanyard, holding a tablet"
                aspect="1/1"
                caption={isCn ? "在 NVIDIA GTC 2025" : "At NVIDIA GTC 2025"}
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/if-award-miracleplus.png"
                alt="A PC tower at NVIDIA GTC 2025 signed Jensen was here by Jensen Huang"
                aspect="16/10"
                caption={isCn ? "Jensen 在我的 PC 上签名了！" : "Jensen signed my PC!"}
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/pitching-2.png"
                alt="iF Design Award page for Field of Vision — cane for the blind"
                aspect="3/4"
                caption={
                  isCn
                    ? "Field of Vision 获得 iF Design Award"
                    : "Awarded iF Design — Field of Vision, cane for the blind"
                }
              />
            </Reveal>
          </div>
          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/pitching-1.png"
                alt="MiraclePlus 2025 Spring closing ceremony group photo on stage"
                aspect="4/3"
                caption={
                  isCn
                    ? "获得 MiraclePlus $300K 投资 · 2025 春季结营"
                    : "Funded by MiraclePlus — $300K · 2025 Spring closing ceremony"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/tiktok-intern.png"
                alt="XING Art booth at trade show — three young men with iPad showing in-progress anime drawing"
                aspect="16/10"
                caption={
                  isCn
                    ? "XING Art alpha 测试 —— 第一次带到现场"
                    : "XING Art alpha test — first time on the floor"
                }
              />
            </Reveal>
          </div>

          <div className="shrink-0 snap-start">
            <Reveal>
              <Figure
                src="/about/closing-1.png"
                alt="Group of friends at a restaurant table with burgers, salsa decorations on the wall"
                aspect="4/3"
                caption={
                  isCn
                    ? "TikTok 实习 —— 最好的夏天同伴"
                    : "Intern at TikTok — best summer crew. GOAT."
                }
              />
            </Reveal>
          </div>
          <div className="shrink-0 snap-start">
            <Reveal delay={0.05}>
              <Figure
                src="/about/closing-2.png"
                alt="Holding ID badge in front of tall modern office buildings, ByteDance / Volcano Engine"
                aspect="3/4"
                caption={
                  isCn
                    ? "入职第一天 —— 字节跳动上海"
                    : "First day on campus — ByteDance Shanghai"
                }
              />
            </Reveal>
          </div>
        </div>
      </section>
      </BootReveal>

      <BootReveal delay={0.49}>
      <section className="container-fluid mt-32">
          <div className="border-t border-line pt-12 max-w-3xl">
            <p
              className="font-display font-light italic text-ink leading-[1.05] tracking-[-0.015em]"
              style={{ fontSize: "clamp(28px, 4.5vw, 56px)" }}
            >
              {isCn
                ? "“我在等你看见我的潜力。”"
                : "“I'm waiting for you to find my potential.”"}
            </p>
            <p className="mt-6 font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              {isCn ? "—— Aspen, 21 岁" : "— Aspen, 21 yrs"}
            </p>
          </div>
      </section>
      </BootReveal>

      <BootReveal delay={0.57}>
      <section className="container-fluid mt-32">
          <div className="border-t border-line pt-6 mb-10">
            <span className="font-mono text-soft/70 text-[11px] tracking-[0.24em] uppercase">
              [A-06]
            </span>
            <p className="mt-2 font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              {isCn ? "奖项与认可" : "Awards & recognition"}
            </p>
          </div>
        <ul className="space-y-3 text-[14px] max-w-3xl">
          {localizedAwards.map((a, i) => (
            <Reveal key={a.title + a.project} delay={i * 0.03}>
              <li className="grid grid-cols-12 gap-3 items-baseline border-b border-line/60 pb-3">
                <span className="col-span-12 sm:col-span-5 text-ink/90">
                  {a.title}
                </span>
                <span className="col-span-7 sm:col-span-5 text-mute">
                  {a.project}
                </span>
                <span className="col-span-5 sm:col-span-2 font-mono text-[11px] text-soft uppercase tracking-[0.14em] text-right">
                  {a.year}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>
      </BootReveal>

      <BootReveal delay={0.65}>
      <section className="container-fluid mt-20">
          <div className="border-t border-line pt-6 mb-10">
            <span className="font-mono text-soft/70 text-[11px] tracking-[0.24em] uppercase">
              [A-07]
            </span>
            <p className="mt-2 font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              {isCn ? "更多过往作品" : "Selected past work"}
            </p>
          </div>
        <ul className="space-y-3 text-[14px] max-w-3xl">
          {localizedMoreWork.map((m, i) => (
            <Reveal key={m.client} delay={i * 0.03}>
              <li className="grid grid-cols-12 gap-3 items-baseline border-b border-line/60 pb-3">
                <span className="col-span-12 sm:col-span-5 text-ink/90">
                  {m.client}
                </span>
                <span className="col-span-7 sm:col-span-4 text-mute">
                  {m.role}
                </span>
                <span className="col-span-5 sm:col-span-3 font-mono text-[11px] text-soft uppercase tracking-[0.14em] text-right">
                  {m.period}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>
      </BootReveal>
    </article>
    </PageEntrance>
    </>
  );
}
