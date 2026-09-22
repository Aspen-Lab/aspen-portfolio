import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Activity,
  Award,
  Briefcase,
  Building2,
  Camera,
  ChefHat,
  GraduationCap,
  Layers,
  MapPin,
  Monitor,
  Music,
  Rocket,
  Sun,
  UserRound,
} from "lucide-react";
import { siTiktok } from "simple-icons";
import { moreWork, awards } from "@/lib/work";
import type { Locale } from "@/i18n/routing";
import { pageMeta } from "@/lib/seo";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { PhotoReel, type Frame } from "@/components/PhotoReel";
import { Moat } from "@/components/Moat";

/* The About page in the home page's language, with more to touch.
   It used to boot: a loader, a page-entrance wipe, a bevelled ASPEN_W
   window with dots and grooves, glyphs in lit wells, sunken photo tiles
   with an "Inspect" pill that inspected nothing. Aspen: 「about 也是同样
   的设计，但是 rich in UX and icons visual」. So: the same flat paper,
   hairlines, folio heads and Newsreader statement as the home page —
   and, on top of it, a glyph on every head, a dossier with an icon per
   line, the trajectory's actual org marks, and photo reels whose frames
   open in a full-size viewfinder. Every fact, photo and caption is the
   one that was here before. */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cn = locale === "cn";

  return pageMeta(locale, "/about", {
    title: cn ? "关于 — Aspen W." : "About — Aspen W.",
    description: cn
      ? "一半是设计师，一半是心理学者，永远在交付。Aspen W. 是 Georgia Tech 双学位学生，目前在 Axel(Gordian, YC W19)担任 Design Engineer，直接向 CEO 汇报。"
      : "Half designer, half psychologist, always shipping. Aspen W. — dual-degree at Georgia Tech, currently a Design Engineer at Axel (Gordian, YC W19), reporting directly to the CEO.",
  });
}

/* ─── Data ─────────────────────────────────────────────────────────── */

type Bi = { en: string; cn: string };
type CapIcon = "design" | "code" | "brand" | "research";

const CAPABILITIES: ReadonlyArray<{ name: Bi; tag: Bi; desc: Bi; icon: CapIcon }> = [
  {
    name: { en: "Product Design", cn: "产品设计" },
    tag: { en: "0→1 · end-to-end", cn: "0→1 · 端到端" },
    desc: {
      en: "Multi-country KYC, automotive HMI, fintech flows — research through shipped UI.",
      cn: "多国 KYC、汽车 HMI、金融科技流程 —— 从研究到上线 UI。",
    },
    icon: "design",
  },
  {
    name: { en: "Design Engineering", cn: "设计工程" },
    tag: { en: "React · production", cn: "React · 生产环境" },
    desc: {
      en: "I ship my own design as PRs — same tokens, components, and stack as the team.",
      cn: "我把自己的设计直接作为 PR 交付 —— token、组件、技术栈和团队保持一致。",
    },
    icon: "code",
  },
  {
    name: { en: "Brand & Visual", cn: "品牌与视觉" },
    tag: { en: "identity · motion", cn: "identity · motion" },
    desc: {
      en: "Type, systems, packaging, motion — from CDC packaging to product marks.",
      cn: "字体、系统、包装、动效 —— 从 CDC 包装到产品标识。",
    },
    icon: "brand",
  },
  {
    name: { en: "Research × Psychology", cn: "研究 × 心理学" },
    tag: { en: "behavior · cog-sci", cn: "behavior · cog-sci" },
    desc: {
      en: "GT Psych dual degree — usability, trust, the gap between said and done.",
      cn: "Georgia Tech 心理学双学位 —— 可用性、信任，以及说出口与真实行为之间的差距。",
    },
    icon: "research",
  },
];

type Mark = { kind: "img"; src: string; h: number } | { kind: "si"; path: string } | { kind: "text"; text: string };

const TRAJECTORY: ReadonlyArray<{ org: string; role: Bi; period: Bi; mark: Mark }> = [
  {
    org: "Axel · Gordian (YC W19)",
    role: { en: "Sole Designer · reports to CEO", cn: "唯一设计师 · 直接汇报 CEO" },
    period: { en: "Dec 2025 — Now", cn: "2025.12 — 至今" },
    mark: { kind: "img", src: "/logos/axel.svg", h: 12 },
  },
  {
    org: "TikTok · PIPO UED",
    role: { en: "Product Designer (Intern) · TikTok Pay KYC", cn: "产品设计实习生 · TikTok Pay KYC" },
    period: { en: "Jun — Sep 2025", cn: "2025.06 — 09" },
    mark: { kind: "si", path: siTiktok.path },
  },
  {
    org: "Hyundai · HATCI Lab",
    role: { en: "HMI Designer · IONIQ 6 L2+", cn: "HMI 设计师 · IONIQ 6 L2+" },
    period: { en: "Jan — May 2025", cn: "2025.01 — 05" },
    mark: { kind: "img", src: "/logos/hyundai.svg", h: 11 },
  },
  {
    org: "XING Art",
    role: { en: "Co-founder & Product Designer · $300K MiraclePlus", cn: "联合创始人 & 产品设计师 · $300K MiraclePlus" },
    period: { en: "2022 — 2025", cn: "2022 — 2025" },
    mark: { kind: "text", text: "XA" },
  },
  {
    org: "CDC · NWSS Lab",
    role: { en: "Product Designer · CryoSave (IDEA Award)", cn: "产品设计师 · CryoSave(IDEA Award)" },
    period: { en: "Aug — Dec 2023", cn: "2023.08 — 12" },
    mark: { kind: "text", text: "CDC" },
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
  { client: "Vulcan Engineering Solutions", role: "UX 设计师 · 结构工程工作流", period: "2025.01 — 05" },
  { client: "Edison Bike", role: "产品设计师 · Piedmont Park Mammoth 电动货运车", period: "2024.01 — 05" },
  { client: "Refracted Lab", role: "自由设计师 · Web3 界面", period: "2024.06 — 08" },
  { client: "上海交通大学", role: "设计研究员 · AI 船舶识别", period: "2024.06 — 08" },
  { client: "CDC NWSS Lab", role: "产品设计师 · CryoSave 包装系统(IDEA Award)", period: "2023.08 — 12" },
  { client: "XING Art", role: "联合创始人 & 产品设计师 · MiraclePlus '25, $300K, 1K+ 用户", period: "2022.12 — 2025.09" },
];

type Photo = { src: string; alt: string; w: number; h: number; caption?: Bi; priority?: boolean };

const REELS: ReadonlyArray<{ key: string; title: Bi; icon: ReactNode; intro?: Bi; frames: Photo[] }> = [
  {
    key: "life",
    title: { en: "Life Style", cn: "生活方式" },
    icon: <Camera strokeWidth={1.5} />,
    intro: {
      en: "Got my car at 18 · Freshman at Georgia Tech · Dreaming about my future",
      cn: "18 岁拥有第一辆车 · Georgia Tech 大一 · 认真想象自己的未来",
    },
    frames: [
      { src: "/about/car-georgia-tech.jpg", w: 1080, h: 1440, alt: "Aspen with her first car at 18, downtown Atlanta at night", priority: true,
        caption: { en: "Got my car at 18 — freshman at GT, dreaming about my future", cn: "18 岁拥有第一辆车 —— GT 大一，认真想象未来" } },
      { src: "/about/drawing-1.jpg", w: 1184, h: 1776, alt: "Black-and-white photograph of a parking garage alley with trees",
        caption: { en: "Love photograph — daily life through a lens", cn: "喜欢摄影 —— 用镜头看日常" } },
      { src: "/about/sketching-bw.png", w: 1184, h: 1776, alt: "Black-and-white photograph of a brutalist tower against cloudy sky",
        caption: { en: "The everyday, framed in black & white", cn: "把日常放进黑白画面里" } },
      { src: "/about/sketching-2.png", w: 1080, h: 1440, alt: "Charcoal sketch of an eye in progress",
        caption: { en: "Somehow good at drawing", cn: "好像还挺会画" } },
      { src: "/about/cool-stuff-roommate.png", w: 2010, h: 1084, alt: "Multiple charcoal sketches of faces and hands on cream paper",
        caption: { en: "Enjoy B&W sketching", cn: "喜欢黑白素描" } },
      { src: "/about/illuminated-dice-1.png", w: 1080, h: 1620, alt: "Electronics workbench with soldering iron, microphone, mixed cups and wires",
        caption: { en: "Making cool stuff with my roommate", cn: "和室友一起做有意思的东西" } },
      { src: "/about/illuminated-dice-2.png", w: 1080, h: 1002, alt: "Two glowing dice on a red dice tray" },
      { src: "/about/workspace-1.png", w: 1620, h: 1080, alt: "LiPo battery and circuit board feeding a glowing die in a red tray, next to a Polaroid",
        caption: { en: "Wireless illuminated dice for our table game", cn: "给桌游做的无线发光骰子" } },
    ],
  },
  {
    key: "workspace",
    title: { en: "My Workspace", cn: "我的工作台" },
    icon: <Monitor strokeWidth={1.5} />,
    frames: [
      { src: "/about/workspace-2.png", w: 1776, h: 1184, alt: "Aspen's desk with dual monitors showing a flip clock and solar system",
        caption: { en: "My workspace — built to enrich creativity. Less is more.", cn: "我的工作台 —— 为了让创造力更顺。少即是多。" } },
      { src: "/about/bronze-studio-2.png", w: 1680, h: 1080, alt: "A friend at home holding a Sony camera, taking a photo",
        caption: { en: "Always someone with a camera in the room", cn: "房间里总有人拿着相机" } },
      { src: "/about/film-washing-1.png", w: 1080, h: 1620, alt: "Close-up black-and-white photo of someone holding a vintage Edixa Reflex 1000 film camera",
        caption: { en: "Film cameras — the slower kind of seeing", cn: "胶片相机 —— 一种更慢的观看" } },
      { src: "/about/film-washing-2.png", w: 1920, h: 1080, alt: "Drawing class with laptop and projector showing arm sketch references on the wall",
        caption: { en: "Sketching nights — references on the wall, sketchbooks on the table", cn: "素描夜晚 —— 墙上是参考，桌上是本子" } },
      { src: "/about/film-washing-3.png", w: 1080, h: 1440, alt: "Purple-gloved hand holding a film reel under sink water during developing",
        caption: { en: "Film washing by hand — PH14 in the basin", cn: "手洗胶片 —— 盆里的 PH14" } },
      { src: "/about/film-washing-4.png", w: 1080, h: 1483, alt: "Black-and-white film print of a silver SUV parked in front of an old brick building",
        caption: { en: "The print, after", cn: "冲洗后的成片" } },
    ],
  },
  {
    key: "music",
    title: { en: "Love Music", cn: "热爱音乐" },
    icon: <Music strokeWidth={1.5} />,
    frames: [
      { src: "/about/bronze-studio-1.png", w: 1080, h: 1620, alt: "A sunburst acoustic guitar resting on a grey carpet",
        caption: { en: "Love music", cn: "热爱音乐" } },
      { src: "/about/designing-pals-2.png", w: 1080, h: 1620, alt: "Three bronze-and-clay monk sculptures in a workshop with pegboard wall",
        caption: { en: "Working at a Bronze Studio", cn: "在青铜工作室工作" } },
      { src: "/about/designing-pals-1.png", w: 1620, h: 1080, alt: "Wooden desk with iPad of horse-anatomy refs, sketchbook drawings, red sculpted clay animals",
        caption: { en: "Designing with reference — desk, sketchbook, and the clay it ends up as", cn: "带着参考做设计 —— 桌面、速写本，以及最后变成的泥稿" } },
      { src: "/about/neuroscience-1.png", w: 1620, h: 1080, alt: "Three friends in silhouette jumping against a sunset sky" },
      { src: "/about/neuroscience-2.png", w: 1620, h: 1080, alt: "Portrait of three young men in golden-hour light with mountains behind",
        caption: { en: "With my pals — last day before they head to their PhDs", cn: "和朋友们 —— 他们去读 PhD 前的最后一天" } },
    ],
  },
  {
    key: "cooking",
    title: { en: "Enjoy Cooking", cn: "喜欢做饭" },
    icon: <ChefHat strokeWidth={1.5} />,
    frames: [
      { src: "/about/cooking.png", w: 2163, h: 1080, alt: "Jupyter notebook with PSYC 3803 brain-science course materials and downsampling visualization",
        caption: { en: "I love neuro-sci — happy in the cog sci dual degree. Yes I am happy.", cn: "我喜欢神经科学 —— 在认知科学/心理学双学位里很开心。真的开心。" } },
      { src: "/about/rat-apartment.png", w: 1440, h: 1080, alt: "Two plates of steak with asparagus, potatoes, and sauce",
        caption: { en: "Cooking for me and my girlfriend", cn: "给我和女朋友做饭" } },
      { src: "/about/miku-switch.png", w: 1440, h: 1080, alt: "A small mouse inside a clear plastic terrarium with moss, near a window screen",
        caption: { en: "Caught a rat in my apartment — it's cute, but I made it leave eventually", cn: "在公寓里抓到一只小鼠 —— 很可爱，但最后还是请它离开了" } },
      { src: "/about/drawing-app.png", w: 1080, h: 1440, alt: "Teal Nintendo Switch Lite with hand-drawn Hatsune Miku in marker on the back",
        caption: { en: "DIY Miku Switch Lite — Xmas gift for my girl", cn: "手绘 Miku Switch Lite —— 给她的圣诞礼物" } },
      { src: "/about/xing-art-cat.png", w: 1547, h: 1080, alt: "iPad screen showing a stylized anime elf girl in progress in a drawing app",
        caption: { en: "Drawing with the app I designed", cn: "用我自己设计的 App 画画" } },
      { src: "/about/nvidia-line.png", w: 1080, h: 1553, alt: "A tabby cat with white belly, looking up at the camera",
        caption: { en: "My cat — I love him sooooo much", cn: "我的猫 —— 超级超级喜欢他" } },
    ],
  },
  {
    key: "summer",
    title: { en: "Unforgettable Summer", cn: "难忘的夏天" },
    icon: <Sun strokeWidth={1.5} />,
    frames: [
      { src: "/about/gtc-1.png", w: 1080, h: 1080, alt: "Crowd of attendees in winter coats lined up at night outside a convention center",
        caption: { en: "Lined up at 4 AM for a 5090", cn: "凌晨 4 点排队等 5090" } },
      { src: "/about/jensen-sign.png", w: 1080, h: 1440, alt: "Young man at NVIDIA GTC with conference lanyard, holding a tablet",
        caption: { en: "At NVIDIA GTC 2025", cn: "在 NVIDIA GTC 2025" } },
      { src: "/about/if-award-miracleplus.png", w: 1440, h: 1079, alt: "A PC tower at NVIDIA GTC 2025 signed Jensen was here by Jensen Huang",
        caption: { en: "Jensen signed my PC!", cn: "Jensen 在我的 PC 上签名了！" } },
      { src: "/about/pitching-2.png", w: 1080, h: 1258, alt: "iF Design Award page for Field of Vision — cane for the blind",
        caption: { en: "Awarded iF Design — Field of Vision, cane for the blind", cn: "Field of Vision 获得 iF Design Award" } },
      { src: "/about/pitching-1.png", w: 1621, h: 1080, alt: "MiraclePlus 2025 Spring closing ceremony group photo on stage",
        caption: { en: "Funded by MiraclePlus — $300K · 2025 Spring closing ceremony", cn: "获得 MiraclePlus $300K 投资 · 2025 春季结营" } },
      { src: "/about/tiktok-intern.png", w: 1331, h: 1080, alt: "XING Art booth at trade show — three young men with iPad showing in-progress anime drawing",
        caption: { en: "XING Art alpha test — first time on the floor", cn: "XING Art alpha 测试 —— 第一次带到现场" } },
      { src: "/about/closing-1.png", w: 1448, h: 1080, alt: "Group of friends at a restaurant table with burgers, salsa decorations on the wall",
        caption: { en: "Intern at TikTok — best summer crew. GOAT.", cn: "TikTok 实习 —— 最好的夏天同伴" } },
      { src: "/about/closing-2.png", w: 1080, h: 1302, alt: "Holding ID badge in front of tall modern office buildings, ByteDance / Volcano Engine",
        caption: { en: "First day on campus — ByteDance Shanghai", cn: "入职第一天 —— 字节跳动上海" } },
    ],
  },
];

/* ─── Pieces ───────────────────────────────────────────────────────── */

const pad = (n: number) => String(n).padStart(2, "0");

function CapabilityGlyph({ icon }: { icon: CapIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-6 h-6",
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

/** An org's mark in a hairline square: its own artwork where one exists, its initials where not. */
function OrgMark({ mark }: { mark: Mark }) {
  return (
    <span className="grid place-items-center w-9 h-9 shrink-0 border border-line text-mute transition-colors duration-300 group-hover:text-ink group-hover:border-ink/40">
      {mark.kind === "img" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mark.src} alt="" aria-hidden style={{ height: mark.h, width: "auto", filter: "brightness(0) invert(0.8)" }} />
      )}
      {mark.kind === "si" && (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden>
          <path d={mark.path} />
        </svg>
      )}
      {mark.kind === "text" && (
        <span className="font-mono text-[9px] tracking-[0.12em]">{mark.text}</span>
      )}
    </span>
  );
}

function Block({ children }: { children: ReactNode }) {
  return <div className="container-fluid pt-16 sm:pt-24">{children}</div>;
}

/* ─── Page ─────────────────────────────────────────────────────────── */

export default async function About({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const cn = locale === "cn";
  const tr = (b: Bi) => (cn ? b.cn : b.en);
  const localizedAwards = cn ? AWARDS_CN : awards;
  const localizedMoreWork = cn ? MORE_WORK_CN : moreWork;

  const dossier: { icon: ReactNode; k: string; v: string }[] = [
    { icon: <UserRound strokeWidth={1.5} />, k: cn ? "角色" : "Role", v: cn ? "设计工程师" : "Design Engineer" },
    { icon: <Building2 strokeWidth={1.5} />, k: cn ? "公司" : "At", v: "Axel · YC W19" },
    { icon: <GraduationCap strokeWidth={1.5} />, k: cn ? "教育" : "Edu", v: cn ? "GT — 工业设计 + 心理学" : "GT — ID + Psych" },
    { icon: <MapPin strokeWidth={1.5} />, k: cn ? "所在地" : "Base", v: "Bellevue, WA" },
    { icon: <Rocket strokeWidth={1.5} />, k: cn ? "创办" : "Founded", v: "XING Art · $300K" },
    { icon: <Activity strokeWidth={1.5} />, k: cn ? "状态" : "State", v: cn ? "持续交付" : "Shipping" },
  ];

  let folio = 0;
  const next = () => pad(++folio);

  return (
    <article className="pb-24 sm:pb-32">
      {/* ── 00 · Identity: the statement beside the dossier ── */}
      <section className="container-fluid pt-10 sm:pt-16 lg:pt-20">
        <div className="lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-16 xl:gap-24 lg:items-center">
          <Reveal>
            <h1 className="type-display text-ink leading-[1.02]" style={{ fontSize: "clamp(40px, 5.2vw, 72px)" }}>
              {cn ? "一半是设计师，" : "Half designer,"}
              <br />
              {cn ? "一半是心理学者，" : "half psychologist,"}
              <br />
              <span className="italic font-normal">{cn ? "永远在交付。" : "always shipping."}</span>
            </h1>
          </Reveal>

          {/* The dossier — a viewfinder, no box: corners, ticks, readouts, one icon a line */}
          <Reveal delay={0.08}>
            <div className="relative mt-12 lg:mt-0 px-6 py-9 sm:px-8 sm:py-10">
              <span className="reg-mark tl" />
              <span className="reg-mark tr" />
              <span className="reg-mark br" />
              <span className="reg-mark bl" />
              <span className="vf-tick top" />
              <span className="vf-tick bottom" />
              <span className="vf-tick left" />
              <span className="vf-tick right" />
              <span className="absolute left-8 top-3 font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
                ASPEN_W <span className="text-soft/50">·</span> {cn ? "档案" : "dossier"}
              </span>
              <span className="absolute right-8 top-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-soft">
                <span aria-hidden className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
                </span>
                {cn ? "在线" : "Online"}
              </span>

              <dl className="mt-3 border-t border-line">
                {dossier.map((d) => (
                  <div key={d.k} className="group flex items-center gap-4 py-3.5 border-b border-line">
                    <span aria-hidden className="text-soft transition-colors duration-300 group-hover:text-ink [&>svg]:w-4 [&>svg]:h-4">
                      {d.icon}
                    </span>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-soft w-20 shrink-0">{d.k}</dt>
                    <dd className="ml-auto text-right text-[14px] text-ink/90">{d.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-soft/55">
                <span>LAT 47.6101 · LON −122.2015</span>
                <span>{cn ? "REC · 1995 — 至今" : "REC · 1995 — PRESENT"}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <Block>
        <SectionHead folio={next()} title={cn ? "能力" : "Capabilities"} icon={<Layers strokeWidth={1.5} />} meta={pad(CAPABILITIES.length)} />
        <ul className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-line">
          {CAPABILITIES.map((c, i) => (
            <li key={c.icon} className="group border-b border-r border-line p-6 sm:p-8">
              <Reveal delay={i * 0.05}>
                <div className="flex items-start gap-5">
                  <span className="grid place-items-center w-12 h-12 shrink-0 border border-line text-mute transition-colors duration-300 group-hover:text-ink group-hover:border-ink/40">
                    <CapabilityGlyph icon={c.icon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display font-semibold text-[17px] sm:text-[18px] tracking-[-0.01em] text-ink">{tr(c.name)}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft/60 whitespace-nowrap shrink-0">{tr(c.tag)}</span>
                    </div>
                    <p className="mt-2.5 text-[14px] leading-[1.65] text-mute max-w-[44ch]">{tr(c.desc)}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Block>

      {/* ── Trajectory ── */}
      <Block>
        <SectionHead folio={next()} title={cn ? "轨迹" : "Trajectory"} icon={<Briefcase strokeWidth={1.5} />} meta={cn ? `${pad(TRAJECTORY.length)} 站` : `${pad(TRAJECTORY.length)} stops`} />
        <ol className="border-t border-line">
          {TRAJECTORY.map((e, i) => (
            <li key={e.org}>
              <Reveal delay={i * 0.04}>
                <div className="group flex items-center gap-5 sm:gap-6 py-5 border-b border-line">
                  <OrgMark mark={e.mark} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-3 text-[15px] sm:text-[16px] text-ink tracking-[-0.005em]">
                      {e.org}
                      {i === 0 && (
                        <span aria-hidden className="relative flex w-1.5 h-1.5">
                          <span className="absolute inset-0 rounded-full bg-ink opacity-40 animate-ping" />
                          <span className="relative w-1.5 h-1.5 rounded-full bg-ink" />
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-[1.5] text-mute">{tr(e.role)}</p>
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-soft whitespace-nowrap shrink-0">
                    {tr(e.period)}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Block>

      {/* ── The reels ── */}
      {REELS.map((r) => (
        <Block key={r.key}>
          <SectionHead
            folio={next()}
            title={tr(r.title)}
            icon={r.icon}
            meta={cn ? `${pad(r.frames.length)} 张影像` : `${pad(r.frames.length)} frames`}
          />
          {r.intro && (
            <Reveal>
              <p className="font-mono uppercase tracking-[0.18em] text-[11px] text-soft mb-10 max-w-md">{tr(r.intro)}</p>
            </Reveal>
          )}
          <Reveal>
            <PhotoReel
              label={tr(r.title)}
              frames={r.frames.map<Frame>((f) => ({
                src: f.src,
                alt: f.alt,
                w: f.w,
                h: f.h,
                priority: f.priority,
                caption: f.caption ? tr(f.caption) : undefined,
              }))}
            />
          </Reveal>
        </Block>
      ))}

      {/* ── The line ── */}
      <section className="container-fluid pt-20 sm:pt-28">
        <Reveal>
          <div className="border-t border-line pt-12 max-w-3xl">
            <p className="type-display italic text-ink leading-[1.05]" style={{ fontSize: "clamp(30px, 4.5vw, 60px)" }}>
              {cn ? "“我在等你看见我的潜力。”" : "“I'm waiting for you to find my potential.”"}
            </p>
            <p className="mt-6 font-mono uppercase tracking-[0.2em] text-[11px] text-soft">
              {cn ? "—— Aspen, 21 岁" : "— Aspen, 21 yrs"}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Awards ── */}
      <Block>
        <SectionHead folio={next()} title={cn ? "奖项与认可" : "Awards & recognition"} icon={<Award strokeWidth={1.5} />} meta={pad(localizedAwards.length)} />
        <ul className="border-t border-line max-w-3xl">
          {localizedAwards.map((a, i) => (
            <li key={a.title + a.project}>
              <Reveal delay={i * 0.03}>
                <div className="grid grid-cols-12 gap-3 items-baseline border-b border-line py-3.5 text-[14px]">
                  <span className="col-span-12 sm:col-span-5 text-ink/90">{a.title}</span>
                  <span className="col-span-7 sm:col-span-5 text-mute">{a.project}</span>
                  <span className="col-span-5 sm:col-span-2 font-mono text-[11px] text-soft uppercase tracking-[0.14em] text-right tabular-nums">{a.year}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Block>

      {/* ── Past work ── */}
      <Block>
        <SectionHead folio={next()} title={cn ? "更多过往作品" : "Selected past work"} icon={<Briefcase strokeWidth={1.5} />} meta={pad(localizedMoreWork.length)} />
        <ul className="border-t border-line max-w-3xl">
          {localizedMoreWork.map((m, i) => (
            <li key={m.client}>
              <Reveal delay={i * 0.03}>
                <div className="grid grid-cols-12 gap-3 items-baseline border-b border-line py-3.5 text-[14px]">
                  <span className="col-span-12 sm:col-span-5 text-ink/90">{m.client}</span>
                  <span className="col-span-7 sm:col-span-4 text-mute">{m.role}</span>
                  <span className="col-span-5 sm:col-span-3 font-mono text-[11px] text-soft uppercase tracking-[0.14em] text-right">{m.period}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Block>

      {/* ── The combo — six proof points, moved here from the home page ── */}
      <Block>
        <SectionHead folio={next()} title={cn ? "组合技" : "The combo"} icon={<Layers strokeWidth={1.5} />} meta="06" />
        <Moat inPage />
      </Block>
    </article>
  );
}
