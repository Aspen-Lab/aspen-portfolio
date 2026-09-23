import { axelProject } from "./axel";
import { hyundaiProject } from "./hyundai";

export type Project = {
  slug: string;
  title: string;
  client: string;
  role: string;
  period: string;
  year: string;
  date: string;
  category: string;
  theme?: "light";
  summary: string;
  tags: string[];
  cover?: string;
  coverWidth?: number;
  coverHeight?: number;
  /** Covers come in every ratio (1.33–2.13) but the frames are fixed
      (16:10 card, 16:9 case-study hero). Say which part must survive:
      coverPosition is a CSS object-position; "contain" shows the whole
      image on coverBg (use the image's own edge colour). */
  coverFit?: "cover" | "contain";
  coverPosition?: string;
  coverBg?: string;
  heroVideo?: string;
  metrics?: { label: string; value: string }[];
  sections?: {
    heading: string;
    body: string;
    images?: string[];
    imageLayout?: "single" | "grid-2" | "grid-3" | "grid-4";
    imageRatio?: "16/10" | "16/9" | "4/3" | "1/1" | "auto";
    figures?: {
      src: string;
      width: number;
      height: number;
      alt: string;
      caption?: string;
    }[];
    videos?: {
      src: string;
      title: string;
      poster?: string;
      width?: number;
      height?: number;
    }[];
    chapter?: string;
    carouselAspect?: "16/9" | "16/10" | "4/3" | "1/1";
    table?: {
      headers: string[];
      rows: string[][];
      caption?: string;
    };
    layers?: {
      label: string;
      problem: string;
      approach: string;
    }[];
    pullQuote?: {
      text: string;
      attribution?: string;
    };
    visual?: "loop-diagram";
    statGrid?: {
      items: {
        value: string;
        label: string;
        icon?: string;
        hint?: string;
      }[];
      cols?: 2 | 3 | 4;
    };
    markets?: {
      code: string;
      name: string;
      regulator: string;
      scope?: string;
    }[];
    iconList?: {
      items: {
        icon?: string;
        label: string;
        text?: string;
      }[];
      columns?: 1 | 2 | 3;
    };
    callout?: {
      variant?: "info" | "warn" | "tip" | "note" | "insight";
      label?: string;
      title?: string;
      text: string;
    };
    chart?: {
      type: "bar" | "funnel";
      title?: string;
      max?: number;
      data: {
        label: string;
        value: number;
        display?: string;
        caption?: string;
      }[];
    };
    userFlow?: {
      title?: string;
      steps: {
        id: string;
        label: string;
        caption?: string;
        kind?: "start" | "step" | "decision" | "end";
      }[];
      branches?: {
        fromId: string;
        label: string;
        destination: string;
        caption?: string;
      }[];
    };
  }[];
  status?: "live" | "coming-soon";
  liveUrl?: string;
};

export const projects: Project[] = [
  axelProject,
  {
    slug: "nutra",
    title: "Nutra — fintech for everyone",
    client: "Aspen Lab · self-initiated",
    role: "UI/UX & Product Design",
    period: "Aug 2024",
    year: "2024",
    date: "8/8/24",
    category: "Fintech",
    summary:
      "A budgeting app for the rest of us. Gamified, friendly, built for people who want to save but can't sustain it. 85% of testers reported higher motivation; 90% loved the play of it.",
    tags: ["Fintech", "Gamification", "UX research"],
    cover: "/work/nutra.png",
    coverWidth: 1024,
    coverHeight: 768,
    heroVideo: "/work/nutra/hero.mp4",
    status: "live",
    metrics: [
      { label: "Self-reported motivation lift", value: "+85%" },
      { label: "Positive feedback on usability", value: "90%" },
      { label: "Design system surfaces", value: "End-to-end" },
    ],
    sections: [
      {
        chapter: "Discovery",
        heading: "Problem",
        body: "Budgeting matters but it's hard, especially for new learners. Most apps are overwhelming because they're built for the highly disciplined. The people who most need help — the ones who want to save but can't stay consistent — are the ones who quietly drop out first.",
        images: [
          "/work/nutra/images/009_9NtIdXzvPDMQtfJa6o3TV2E3LVw.png",
          "/work/nutra/images/010_p03fMvdXv9qlkuEGy2e1IsxVCY.png",
          "/work/nutra/images/011_NBye5onWmCPLKvqzCwSnykmGtY.png",
        ],
      },
      {
        chapter: "Discovery",
        heading: "Research",
        body: "Surveys and in-depth interviews with self-identified low-motivation, low-discipline users surfaced three insights: simple intuitive interactions reduce overwhelm; gamification mechanics significantly boost engagement; and small, personalized nudges drive consistency. We were looking at a large, underserved group whose biggest enemy was friction.",
        images: [
          "/work/nutra/images/012_9yomB4v1D5EZIdYAWpTMgLBZbV0.png",
          "/work/nutra/images/013_ZCyxgLvUHehqpd44CK8aWKk6kPI.png",
          "/work/nutra/images/014_Vb7Gz3n9VxLlxy1PFYuaaHuSj0.png",
          "/work/nutra/images/015_BdOp2AWzf5aVaLvyrrQYj3ONl2Q.png",
        ],
      },
      {
        chapter: "Discovery",
        heading: "Mental model & journey",
        body: "We mapped how target users think about money — separating the cognitive cost of saving from the emotional cost of being told they aren't saving enough. The journey map made the friction points visible.",
        images: [
          "/work/nutra/images/016_gSg4pXbkYOCUbkkrN7YHezfzUc.png",
          "/work/nutra/images/017_4KcO8ZQt1kH5izQWlTG0zFskSE.png",
        ],
      },
      {
        chapter: "Discovery",
        heading: "Market opportunity",
        body: "Mainstream budgeting apps over-index on the disciplined power user. Nutra targets the much larger unmotivated middle — people who already want to save but can't sustain attention without a feedback loop.",
        images: ["/work/nutra/images/018_e2pNzrOBQ8PFD86DXCmr0vvaN0A.png"],
      },
      {
        chapter: "Strategy",
        heading: "Design objectives",
        body: "Lower the entry barrier — minimize cognitive load, frictionless onboarding. Boost engagement through daily saving challenges, interactive rewards, playful rituals. Personalize tasks and suggestions based on individual spending patterns and goals.",
      },
      {
        chapter: "Strategy",
        heading: "Why gamification",
        body: "Budgeting fails when it feels like a chore. Gamification makes the loop short, visible, and rewarding — turning discipline into habit and improving long-term retention by orders of magnitude.",
        images: ["/work/nutra/images/019_dDi2qK1thaNyf7zJYwyeaBPcjE.png"],
      },
      {
        chapter: "Strategy",
        heading: "Why \"Nut\"",
        body: "We chose Nut as the virtual assistant because it symbolizes growth, saving, and potential — a small thing that becomes something bigger. The metaphor makes financial progress feel tangible, approachable, and friendly.",
        images: ["/work/nutra/images/020_YXLh1dAU7VEtFw5m1ymMEBw8WRg.png"],
        carouselAspect: "16/10",
      },
      {
        chapter: "Process",
        heading: "Ideation",
        body: "Two parallel flows: dashboard discovery (where money is going right now) and goal setting (where it should be going). Sketched dozens of variations to find the smallest viable interaction loop.",
        images: [
          "/work/nutra/images/021_TgcWfVt04AqnX9GWQJU498XfxW0.png",
          "/work/nutra/images/022_ZW4XL91heR9aEEAAqxlQzGxo8U.png",
          "/work/nutra/images/023_0KX9JJDrKf4MOV5AJNJ7c3N5g1E.png",
          "/work/nutra/images/024_ozU3om54jWs3CcbkYNsa7CS2k4Y.png",
          "/work/nutra/images/025_JiZ8IL59qsd64kS5EG1QUcVpB0.png",
          "/work/nutra/images/026_CBULa0micCCsY9eS8lcwJEoABE.png",
          "/work/nutra/images/027_DDGCerpoBV6cOO8VOxDIyAQK2g.png",
          "/work/nutra/images/028_zm6mTpY4u7XDyhmwA5knnxEiP7c.png",
          "/work/nutra/images/029_AbUxZ2ZiXDoxvEElWVg7XflNU.png",
        ],
      },
      {
        chapter: "Process",
        heading: "First user test",
        body: "A low-fi clickable prototype, run with target users to validate the underlying UX bones before any visual investment.",
        images: ["/work/nutra/images/030_Xuclgz5r0pjEVynKwvs8GtQxqU.png"],
      },
      {
        chapter: "Process",
        heading: "Refinement",
        body: "First-test friction points: the goal flow asked for too much upfront, the dashboard buried the next action. We rewrote the onboarding sequence and gave the daily challenge top billing.",
        images: [
          "/work/nutra/images/031_TCBVvtth2bVy6tOdtviscAGYxwg.png",
          "/work/nutra/images/032_KtFeT1n8GKPuFhG4n7yLT6XO5c.png",
          "/work/nutra/images/033_jqQj1TvmimI7MCDeM23h52ZUHjA.png",
          "/work/nutra/images/034_RhDJCQEcj1jiRTc5Ab773B3G060.png",
        ],
      },
      {
        chapter: "Process",
        heading: "Lo-fi summary",
        body: "Final lo-fi structure: dashboard, daily challenge, goal setter, Nut assistant, financial overview. Once this held, the brand layer could go on top.",
        images: ["/work/nutra/images/035_JevRW6DPyVFAzcYOT94FnNVJKjk.png"],
      },
      {
        chapter: "Process",
        heading: "User journey, after",
        body: "Post-test, the journey collapsed: fewer screens between intent and feedback, fewer dead ends, a clear path from open-app to saved-money.",
        images: ["/work/nutra/images/036_LGa2Jxxa3wti4K35rPTIvjF8k.png"],
      },
      {
        chapter: "Execution",
        heading: "Mid-fi & branding",
        body: "Layered the brand voice on once the structure held. Nut got a personality. Color and motion stayed restrained so the play felt warm, not loud.",
        images: ["/work/nutra/images/037_iSj6b1ENv3TQ41cy3g9IGtahbvE.png"],
      },
      {
        chapter: "Execution",
        heading: "Mockup",
        body: "Hero composition for the launch page — Nut, dashboard, daily challenge, all visible in a single read.",
        images: [
          "/work/nutra/images/038_U1IP9FWWdtoZ1YniN5wmod3Wk.png",
          "/work/nutra/images/039_NWqD05VZVBpOgqCJ6nLqIta7c2o.png",
          "/work/nutra/images/040_ZNNvF1x53nHJo2s5cdZmlZL1zA.png",
        ],
      },
      {
        chapter: "Execution",
        heading: "Branding 2.0",
        body: "Second pass on visual identity. Tightened the mascot proportions, locked the color system, and built out a small expressive set of emotional states for Nut.",
        images: [
          "/work/nutra/images/041_KKamaeoBojXtMJdnULz0XK99H0.png",
          "/work/nutra/images/042_HccGSSckUFus5nCuC6IlhjgqM.png",
          "/work/nutra/images/043_Ps4zyaEEnRGOxDBw7h2mG6hooU.png",
        ],
        carouselAspect: "16/10",
      },
      {
        chapter: "Execution",
        heading: "Hi-fi user flow",
        body: "End-to-end flow for the hi-fi prototype, covering onboarding, goal setting, daily check-in, and the financial overview.",
        images: ["/work/nutra/images/044_qBXtfF9RaHuFnN0Y9RqbNuG5WQk.png"],
      },
      {
        chapter: "Execution",
        heading: "What shipped",
        body: "Goal Setting (personalized, manageable steps). Daily challenges based on the user's spending pattern. The Nut assistant for visual reward and emotional feedback. A clear financial overview as honest data viz of habits, budgets, and progress. A full design system to keep it coherent across surfaces.",
        images: [
          "/work/nutra/images/045_CUMADf13Hswh07v9fzADNWsAmJE.png",
          "/work/nutra/images/046_x6YgdjgHlSnrM4Ub4omotROYM.png",
          "/work/nutra/images/047_GgNve27me3IEChDkzin6eqykQU.png",
        ],
      },
      {
        chapter: "Execution",
        heading: "Design system",
        body: "Comprehensive guidelines to keep visual and interactive consistency across surfaces — color, type, components, motion tokens, and the rules for Nut as a system primitive.",
        images: [
          "/work/nutra/images/048_WmV727HxTIiMFthlQokx4f0bnFQ.png",
          "/work/nutra/images/049_4wITjb4UkY4GW37W40aUKngM.png",
        ],
      },
      {
        chapter: "Outcome",
        heading: "Validation",
        body: "Multiple rounds of usability testing with target users refined the interactions. The result: stronger retention through play, observable improvements in saving behavior among users who'd previously bounced off discipline-heavy apps, and overwhelmingly positive feedback.",
      },
      {
        chapter: "Outcome",
        heading: "Reflection",
        body: "Designing Nutra deepened my understanding of behavioral psychology and how gamification really works in motivation. It strengthened my UX research, iterative prototyping, and visual-system muscles — and showed how care plus play can ship something both effective and joyful.",
      },
    ],
  },
  {
    slug: "tiktok",
    title: "TikTok Pay KYC, scaled across markets",
    client: "TikTok · PIPO UED",
    role: "Product Designer (Intern)",
    period: "Jun — Sep 2025",
    year: "2025",
    date: "9/10/25",
    category: "Fintech",
    summary:
      "KYC across Vietnam, Malaysia, Indonesia, and the US for TikTok Pay, Shop, and Live. Vietnam new-user completion 70% → 90%. Vendor docking SOP cut integration cycles by ~40%.",
    tags: ["Fintech", "Compliance", "Multi-region", "Design System"],
    cover: "/work/tiktok.png",
    coverWidth: 2894,
    coverHeight: 1628,
    coverFit: "contain",
    coverPosition: "50% 100%",
    coverBg: "#000",
    status: "live",
    metrics: [
      { label: "Vietnam KYC completion", value: "70 → 90%" },
      { label: "Vendor integration cycle", value: "−40%" },
      { label: "Markets shipped", value: "VN · MY · ID · US" },
    ],
    sections: [
      {
        chapter: "Background",
        heading: "What KYC is",
        body: "**Regulatory gate** before any payment can run. Break it, users drop off. Loosen it, the *regulator* does.",
        iconList: {
          items: [
            { icon: "id", label: "Identity verification", text: "Local ID + selfie + liveness check, per market." },
            { icon: "lock", label: "Compliance contract", text: "Each regulator audits the flow, the data, the SDK." },
            { icon: "globe", label: "4 frameworks", text: "SBV · BNM · OJK · FinCEN — same gate, different rulebooks." },
          ],
          columns: 3,
        },
        callout: {
          variant: "insight",
          label: "Why design has leverage here",
          text: "KYC sits at the **front of the funnel**. A 10-point completion lift across 4 markets compounds into hundreds of millions of payment volume. That's the slot where one designer × one engineer can move the entire business curve.",
        },
        pullQuote: {
          text: "When KYC breaks, users drop off. When it's loose, the regulator does.",
          attribution: "the design constraint, in one sentence",
        },
      },
      {
        chapter: "Background",
        heading: "Where the work landed",
        body: "Four markets. One design system. TikTok Pay · Shop · Live across all.",
        markets: [
          { code: "VN", name: "Vietnam", regulator: "SBV", scope: "Pay · Shop · Live" },
          { code: "MY", name: "Malaysia", regulator: "BNM", scope: "Pay · Shop" },
          { code: "ID", name: "Indonesia", regulator: "OJK", scope: "Pay · Shop" },
          { code: "US", name: "United States", regulator: "BSA · FinCEN · CIP", scope: "Pay · Shop · Live" },
        ],
      },
      {
        chapter: "Strategy",
        heading: "Three layers of the problem",
        body: "**UX · Compliance · UI** — three distinct failures, three distinct fixes. None solvable alone.",
        layers: [
          {
            label: "UX",
            problem:
              "Users reusing historical identity data had no fallback when their ID couldn't be found — flow forked into silent drop-offs.",
            approach:
              "\"Not My ID\" escape path + Goal Gradient progress visibility — the user always knows where they are.",
          },
          {
            label: "Compliance",
            problem:
              "OCR fields inconsistent MY ↔ VN. Manual re-entry. Regulatory risk in the inconsistency itself.",
            approach:
              "Standardized field schema, co-authored with Legal + Risk, regulator-aligned across all four markets.",
          },
          {
            label: "UI",
            problem:
              "Vendor SDK type, radius, icons, errors fragmented. Trust collapsed at the handoff to vendor UI.",
            approach:
              "SDK-AAI Style Alignment + reusable templates + secondary UI encapsulation for clean country variants.",
          },
        ],
      },
      {
        chapter: "Strategy",
        heading: "Three audiences, one flow",
        body: "Each KYC change had to satisfy *all three* at once.",
        iconList: {
          items: [
            { icon: "briefcase", label: "Business", text: "Lift completion to unlock payment volume across markets." },
            { icon: "user", label: "User", text: "Onboarding that feels simpler, clearer, more trustworthy." },
            { icon: "layers", label: "Design", text: "Framework that absorbs many SDKs without falling apart." },
          ],
          columns: 3,
        },
      },
      {
        chapter: "Execution",
        heading: "The flow, with the escape path",
        body: "Most flows assume the happy path. KYC's failure mode is the **silent fork** — a user who can't proceed but doesn't know why. We surfaced the alternate route as a first-class step.",
        userFlow: {
          title: "Vietnam KYC · v2 · with \"Not My ID\" escape",
          steps: [
            { id: "s1", label: "Open TikTok Pay", caption: "Entry · prefilled identity from history", kind: "start" },
            { id: "s2", label: "Choose ID type", caption: "Citizen ID · passport · DL", kind: "step" },
            { id: "s3", label: "Verify identity", caption: "OCR + liveness", kind: "decision" },
            { id: "s4", label: "Confirm match", caption: "Goal Gradient progress · 3 of 4 done", kind: "step" },
            { id: "s5", label: "KYC approved", caption: "Pay unlocked", kind: "end" },
          ],
          branches: [
            {
              fromId: "s3",
              label: "Not My ID",
              destination: "Re-enter manually",
              caption: "Surfaces the alternate route — drop-offs collapse from 30% to ~10%.",
            },
          ],
        },
        callout: {
          variant: "tip",
          label: "Goal Gradient Hypothesis",
          text: "When users see *how close they are to done*, completion goes up. We show progress as **3 of 4** explicitly, and the last step always reads as the smallest one.",
        },
      },
      {
        chapter: "Execution",
        heading: "Completion across markets",
        body: "Vietnam was the trial — once it landed, the same pattern (escape path + Goal Gradient + standardized OCR) ported to MY · ID · US.",
        chart: {
          type: "funnel",
          title: "KYC funnel · Vietnam · v1 → v2",
          data: [
            { label: "Open KYC", value: 100, display: "100%" },
            { label: "Upload ID", value: 92, display: "92%" },
            { label: "Pass OCR", value: 88, display: "88%", caption: "OCR taxonomy standardized · MY/VN aligned" },
            { label: "Liveness", value: 90, display: "90%" },
            { label: "Approved", value: 90, display: "90%", caption: "Up from 70% in v1 — \"Not My ID\" + progress." },
          ],
        },
      },
      {
        chapter: "Execution",
        heading: "Vendor Docking SOP",
        body: "First standardized SOP for TikTok PIPO — workflows, acceptance criteria, UI delivery priorities. The artifact I'm proudest of.",
        iconList: {
          items: [
            { icon: "workflow", label: "Workflow", text: "Stages, owners, acceptance gates per SDK vendor." },
            { icon: "check", label: "Acceptance", text: "Checklist tied to OCR mapping + UI templates + halts." },
            { icon: "spark", label: "Delivery", text: "UI tokens, component library, country-variant rules." },
          ],
          columns: 3,
        },
        pullQuote: {
          text: "Cross-market scalability stopped being a function of who was on shift.",
          attribution: "what the SOP changed",
        },
      },
      {
        chapter: "Outcome",
        heading: "Results",
        body: "What shipped, what stuck.",
        statGrid: {
          items: [
            { value: "70 → 90%", label: "VN new-user KYC", icon: "gauge", hint: "Vietnam completion lift." },
            { value: "−40%", label: "Vendor cycle", icon: "arrow-up-right", hint: "Onboarding new SDKs, faster." },
            { value: "4", label: "Markets shipped", icon: "globe", hint: "VN · MY · ID · US." },
            { value: "1", label: "OCR taxonomy", icon: "shield", hint: "Co-authored with Legal + Risk." },
          ],
          cols: 4,
        },
      },
      {
        chapter: "Outcome",
        heading: "Reflection",
        body: "Compliance-first UX is its **own discipline** — regulator language and human language don't compromise. The right answer was less about fixing one flow, more about making the SDK system *modular, configurable, data-driven*.",
      },
    ],
  },
  hyundaiProject,
  {
    slug: "cone",
    title: "Field of Vision — wearable for visually impaired pedestrians",
    client: "Aspen Lab · iF + Red Dot 2025",
    role: "Product Designer & Researcher",
    period: "2024 — 2025",
    year: "2024",
    date: "6/20/24",
    category: "Design for Disabled",
    summary:
      "A wearable + interface system designed for visually impaired pedestrians. Winner of both iF Design Award and Red Dot Design Award in 2025.",
    tags: ["Accessibility", "Wearable", "Service design"],
    cover: "/work/cone.png",
    coverWidth: 2048,
    coverHeight: 1328,
    coverPosition: "50% 100%", // keep the iF badge in the corner
    status: "coming-soon",
    metrics: [
      { label: "iF Design Award", value: "2025" },
      { label: "Red Dot Design Award", value: "2025" },
    ],
    sections: [
      {
        heading: "Status",
        body: "Detailed case study coming soon. Field of Vision (working title: Cone Walk Safe) is a navigation aid system for visually impaired pedestrians — recognized with both the iF Design Award and Red Dot Design Award in 2025. Reach out if you'd like to dig into the design and research now.",
      },
    ],
  },
];

export const moreWork = [
  {
    client: "Vulcan Engineering Solutions",
    role: "UX Designer · structural engineering workflows",
    period: "Jan — May 2025",
  },
  {
    client: "Edison Bike",
    role: "Product Designer · Mammoth e-cargo for Piedmont Park",
    period: "Jan — May 2024",
  },
  {
    client: "Refracted Lab",
    role: "Freelance Designer · Web3 interfaces",
    period: "Jun — Aug 2024",
  },
  {
    client: "Shanghai Jiao Tong University",
    role: "Design Researcher · AI ship recognition",
    period: "Jun — Aug 2024",
  },
  {
    client: "CDC NWSS Lab",
    role: "Product Designer · CryoSave packaging system (IDEA Award)",
    period: "Aug — Dec 2023",
  },
  {
    client: "XING Art",
    role: "Co-founder & Product Designer · MiraclePlus '25, $300K, 1K+ users",
    period: "Dec 2022 — Sep 2025",
  },
];

export const awards = [
  { title: "iF Design Award", project: "Field of Vision", year: "2025" },
  { title: "Red Dot Design Award", project: "Field of Vision", year: "2025" },
  { title: "IDEA Student Award", project: "CryoSave for CDC NWSS", year: "2025" },
  { title: "Bredendieck Award", project: "Georgia Tech (×2)", year: "" },
  { title: "Humanitarian Award", project: "", year: "" },
  { title: "Atlanta Design Festival", project: "Recognition", year: "" },
];

export type StackIcon =
  | "frontend"
  | "email"
  | "backend"
  | "ai"
  | "game"
  | "design"
  | "tooling";

export type StackCategory = {
  label: string;
  items: string[];
  note?: string;
  icon?: StackIcon;
  link?: { label: string; href: string };
};

export const stack: StackCategory[] = [
  {
    icon: "design",
    label: "Design",
    items: ["Figma + Figma MCP", "Framer", "Rhino + Keyshot", "Adobe CS"],
    note: "Where every project starts — Figma is the desk",
  },
  {
    icon: "frontend",
    label: "Frontend · daily driver",
    items: [
      "Next.js App Router",
      "React · TypeScript",
      "Tailwind",
      "Motion",
      "Shiki + Lucide",
    ],
    note: "helloaxel.com · Lumen · this portfolio · Pado",
    link: { label: "See Lumen", href: "https://github.com/Aspen-Lab/lumen" },
  },
  {
    icon: "email",
    label: "Email engineering",
    items: [
      "Customer.io",
      "Liquid templating",
      "No-fake-defaults pattern",
      "MJML thinking",
    ],
    note: "28 transactional templates at Axel — onboarding to cancellation",
  },
  {
    icon: "backend",
    label: "Backend & data",
    items: [
      "Python 3.10+ asyncio",
      "SQLite + YAML",
      "Docker Compose",
      "Postgres / Supabase",
    ],
    note: "Peer (open-source research briefing) · Pado",
    link: { label: "See Peer", href: "https://peer.homes" },
  },
  {
    icon: "ai",
    label: "AI · 3 tiers",
    items: [
      "Anthropic SDK",
      "Google GenAI",
      "Ollama (local)",
      "TF-IDF (rules)",
    ],
    note: "Tier 0 / 1 / 2 — match cost and capability to the task",
    link: {
      label: "Peer pipeline",
      href: "https://peer.homes",
    },
  },
  {
    icon: "game",
    label: "Game",
    items: ["Unity + C#", "PlayMaker FSM", "Hollow-Knight stack"],
    note: "2D Metroidvania w/ Skyler · 1–2h/day, Hollow-Knight stack",
  },
  {
    icon: "tooling",
    label: "Tooling · the glue",
    items: [
      "Cursor",
      "Claude Code",
      "unity-mcp · Ludo MCP",
      "Customer.io MCP",
      "PptxGenJS",
    ],
    note: "CLAUDE.md per repo · MCP chain · Vercel preview as handoff",
  },
];

export const spectrum = [
  "Design",
  "Frontend",
  "Templating",
  "Backend",
  "Game",
];

/* Six capabilities for the radar (components/CapabilityRadar.tsx).
   Self-assessed, 0–100; the hint is the evidence and must stay true.
   Aspen owns these numbers — change them here, nowhere else. */
export type Capability = {
  key: string;
  label: { en: string; cn: string };
  value: number;
  hint: { en: string; cn: string };
};

export const capabilities: Capability[] = [
  {
    key: "design",
    label: { en: "Design", cn: "设计" },
    value: 92,
    hint: {
      en: "Where every project starts — Figma is the desk. iF Design Award and Red Dot 2025 for Field of Vision.",
      cn: "每个项目开始的地方，Figma 是工作台。Field of Vision 拿到 2025 年 iF 与 Red Dot。",
    },
  },
  {
    key: "frontend",
    label: { en: "Frontend", cn: "前端" },
    value: 85,
    hint: {
      en: "Founding Design Engineer at Axel, shipping frontend PRs; helloaxel.com, this portfolio, Pado.",
      cn: "在 Axel 担任 Founding Design Engineer，直接交付前端 PR；helloaxel.com、这个作品集、Pado。",
    },
  },
  {
    key: "email",
    label: { en: "Email", cn: "邮件" },
    value: 80,
    hint: {
      en: "28 transactional templates at Axel, onboarding to cancellation — Customer.io and Liquid.",
      cn: "Axel 的 28 个交易类邮件模板，从 onboarding 到 cancellation —— Customer.io 与 Liquid。",
    },
  },
  {
    key: "backend",
    label: { en: "Backend", cn: "后端" },
    value: 62,
    hint: {
      en: "Peer's five-stage pipeline in Python asyncio; Supabase behind Pado and Peer.",
      cn: "Peer 的五阶段管线（Python asyncio）；Pado 与 Peer 背后的 Supabase。",
    },
  },
  {
    key: "ai",
    label: { en: "AI", cn: "AI" },
    value: 74,
    hint: {
      en: "Three-tier model routing in Peer — rules, then Gemini, then Anthropic, matched to cost.",
      cn: "Peer 的三层模型路由 —— 规则、Gemini、Anthropic，按成本匹配任务。",
    },
  },
  {
    key: "game",
    label: { en: "Game", cn: "游戏" },
    value: 45,
    hint: {
      en: "Nineteen browser games on Aspen Play; Unity and PlayMaker on the side.",
      cn: "Aspen Play 上的十九款网页游戏；业余在用 Unity 和 PlayMaker。",
    },
  },
];

type Bilingual = { en: string; cn: string };

/* Side projects render as cards (components/SideProjects.tsx). Every
   claim below, except Metroidvania (carried over from the old copy; no
   public build to check), was checked against the live site and repo on
   2026-09-17 — keep it that way: a card is a public statement.
   Thumbnails are 16:10 captures of the live site in public/side/. */
export type SideProject = {
  slug: string;
  name: string;
  /** product = flagship card row; build = smaller grid below it */
  tier: "product" | "build";
  /** archive = finished and frozen (the moment it was built for has passed) */
  status: "live" | "early" | "wip" | "archive";
  category: Bilingual;
  tagline: Bilingual;
  blurb: Bilingual;
  /** Where the product runs, e.g. "Web", "iPhone · coming to the App Store" */
  platforms: Bilingual[];
  tech: string[];
  /** The live product — the whole card links here. None = private build. */
  href?: string;
  /** Secondary links shown on the card (repo, downloads, docs) */
  links?: { label: Bilingual; href: string }[];
  thumb?: string;
  /** Kept in the data, left off the page (Aspen, 2026-09-21: 「lumen和小游戏拿掉」). */
  hidden?: boolean;
};

export const sideProjects: SideProject[] = [
  {
    slug: "peer",
    name: "Peer",
    tier: "product",
    status: "live",
    category: { en: "Research tool", cn: "科研工具" },
    tagline: {
      en: "Ten papers a day, chosen for your work.",
      cn: "每天十篇论文，按你的研究挑选",
    },
    blurb: {
      en: "Open-source research briefing. Name your field; a five-stage pipeline reads OpenAlex, arXiv and Semantic Scholar, scores every paper against your work, and keeps ten a day.",
      cn: "替你读文献的开源论文晨报——按你的研究领域从 OpenAlex、arXiv 等学术源抓取、去重、打分，每天只留十篇。",
    },
    platforms: [{ en: "Web", cn: "网页" }],
    tech: ["Next.js", "Supabase", "Gemini API", "Tailwind"],
    href: "https://peer.homes",
    links: [{ label: { en: "GitHub · MIT", cn: "GitHub · MIT" }, href: "https://github.com/Aspen-Lab/peer" }],
    thumb: "/side/peer.jpg",
  },
  {
    slug: "pado",
    // The product's own name; "Pado Pet" is only the App Store listing
    name: "Pado",
    tier: "product",
    status: "live",
    category: { en: "Pet care", cn: "宠物照护" },
    tagline: {
      en: "Your cat's everyday notebook.",
      cn: "家里这只猫，每天的本子",
    },
    blurb: {
      en: "Cat-care notebook the whole household shares: meals, meds, anything off. Paw, its AI, answers everyday questions with this cat's last few days in view, not internet articles.",
      cn: "全家共用的养猫本子：吃了没、药吃了没、今晚正不正常，谁看到谁记。AI 助手 Paw 答日常问题，带着它这几天的记录。",
    },
    platforms: [
      { en: "Web", cn: "网页" },
      { en: "iPhone · coming to the App Store", cn: "iPhone · 即将上架 App Store" },
    ],
    tech: ["Next.js", "Supabase", "SwiftUI", "Electron"],
    href: "https://www.pado.pet",
    links: [
      {
        label: { en: "macOS · early build", cn: "macOS · 早期版" },
        href: "https://github.com/Aspen-Lab/pado-releases/releases/latest",
      },
    ],
    thumb: "/side/pado.jpg",
  },
  {
    slug: "aspenplay",
    name: "Aspen Play",
    tier: "product",
    status: "live",
    category: { en: "Browser games", cn: "网页游戏" },
    tagline: {
      en: "Nineteen browser games, solo or with friends.",
      cn: "十九款网页游戏，单人或约朋友玩",
    },
    blurb: {
      en: "Nineteen browser games, from Blocks and chess to Dou Dizhu and hold'em, with friends, online rooms and rankings. Its design system, Aspen Origin, has public docs.",
      cn: "十九款网页游戏，从俄罗斯方块、国际象棋到斗地主、德州扑克；可加好友、开房间联机、冲排行榜，设计系统文档也已公开。",
    },
    platforms: [{ en: "Web · installable", cn: "网页 · 可添加到主屏幕" }],
    tech: ["Vanilla JS", "Supabase Realtime", "Three.js", "Web Audio"],
    href: "https://www.aspenplay.dev",
    links: [
      {
        label: { en: "Design system", cn: "设计系统" },
        href: "https://www.aspenplay.dev/design-system",
      },
    ],
    thumb: "/side/aspenplay.jpg",
  },
  {
    slug: "cardflow",
    name: "CardFlow",
    tier: "build",
    status: "live",
    category: { en: "Content tool", cn: "内容工具" },
    tagline: {
      en: "Notion-style writing, 小红书-style cards.",
      cn: "写成文档，排成小红书卡片",
    },
    blurb: {
      en: "Notion-like editor that auto-generates 小红书-style swipeable cards: H1 becomes the cover, a divider starts the next card. Five themes, live preview.",
      cn: "像写 Notion 一样写内容，自动排成小红书风格的翻页卡片——H1 成封面，分隔线即分页。五套主题，实时预览。",
    },
    platforms: [{ en: "Web · Chinese UI", cn: "网页 · 中文界面" }],
    tech: ["Next.js", "TypeScript", "TipTap", "Tailwind"],
    href: "https://cardflow-chi.vercel.app",
    links: [{ label: { en: "GitHub", cn: "GitHub" }, href: "https://github.com/Aspen-Lab/cardflow" }],
    thumb: "/side/cardflow.jpg",
  },
  {
    slug: "skyler",
    name: "SKYLER Visual Archive",
    tier: "build",
    status: "live",
    category: { en: "Artist portfolio", cn: "作品集网站" },
    tagline: {
      en: "HUD-style portfolio built for concept artist Skyler.",
      cn: "为概念美术 Skyler 搭的作品集",
    },
    blurb: {
      en: "Portfolio built for concept artist Skyler (SECAL72): HUD-style black-and-line interface, auto-scrolling project strips, a zoom loupe for full-resolution art, all content edited from one file.",
      cn: "为概念美术 Skyler 做的作品集：黑底 HUD 风界面，作品条自动滚动，原图可用放大镜细看，改一个文件即可更新。",
    },
    platforms: [{ en: "Web", cn: "网页" }],
    tech: ["HTML", "CSS", "Vanilla JS"],
    href: "https://www.secal72.com",
    links: [{ label: { en: "GitHub", cn: "GitHub" }, href: "https://github.com/Aspen-Lab/skyler-portfolio" }],
    thumb: "/side/skyler.jpg",
  },
  {
    slug: "lumen",
    hidden: true,
    name: "Lumen",
    tier: "build",
    status: "early",
    category: { en: "UI components", cn: "UI 组件库" },
    tagline: {
      en: "UI components for AI-native products.",
      cn: "为 AI 产品做的交互组件库",
    },
    blurb: {
      en: "Showcase of UI components for AI products, broken down into reusable atoms. Tune each live, flip desktop/mobile, copy the TSX. Early: one component, seven atoms so far.",
      cn: "面向 AI 产品的组件展示站，组件拆成可复用的原子——实时调参、切换桌面/移动端、一键复制代码。目前一个组件、七个原子。",
    },
    platforms: [{ en: "Web", cn: "网页" }],
    tech: ["Next.js", "TypeScript", "Framer Motion", "Shiki"],
    href: "https://lumen-nu-blond.vercel.app",
    links: [{ label: { en: "GitHub", cn: "GitHub" }, href: "https://github.com/Aspen-Lab/lumen" }],
    thumb: "/side/lumen.jpg",
  },
  {
    slug: "typhoon",
    name: "Typhoon Bavi × HX253",
    tier: "build",
    status: "archive",
    category: { en: "Data visualization", cn: "数据可视化" },
    tagline: {
      en: "Typhoon Bavi's track, measured against one flight.",
      cn: "台风巴威路径 × 一班航班",
    },
    blurb: {
      en: "Interactive map of Typhoon Bavi based on a Hong Kong Observatory bulletin: drag a daily timeline and see how close the storm comes to the HKG–SHA flight route.",
      cn: "根据香港天文台的一份公报画出台风巴威的路径——拖动每日时间轴，看风暴每天离香港飞上海的航线有多近。",
    },
    platforms: [{ en: "Web · Chinese UI", cn: "网页 · 中文界面" }],
    tech: ["D3.js", "TopoJSON", "Single HTML"],
    href: "https://typhoon-rho.vercel.app",
    // New file name, not a re-used one: image caches key on the URL
    thumb: "/side/typhoon-map.jpg",
  },
  {
    slug: "metroidvania",
    hidden: true,
    name: "Metroidvania",
    tier: "build",
    status: "wip",
    category: { en: "Game", cn: "游戏" },
    tagline: {
      en: "An untitled 2D Metroidvania.",
      cn: "一款未命名的 2D 银河城游戏",
    },
    blurb: {
      en: "Untitled 2D Metroidvania in Unity, Hollow-Knight stack. Engineering solo; Skyler on art and music. Built in one-to-two-hour daily blocks.",
      cn: "未命名的 2D 银河城游戏，Unity 开发，Hollow Knight 同款技术栈。工程我一人包办，Skyler 负责美术和音乐；每天推进一到两小时。",
    },
    platforms: [{ en: "Unity · in development", cn: "Unity · 开发中" }],
    tech: ["Unity", "C#", "PlayMaker"],
  },
];

/* Aspen Origin — the design system behind Aspen Play (home tab
   "Design system"). One entry that opens the live docs. Copy checked on
   2026-09-18 against the repo (public/design-system/**) and the live site
   by a research pass + an independent verifier. Say "the design system
   of Aspen Play", not "powers Aspen Play": the game pages don't use it
   yet. The numbers are counts from source; re-check when it changes. */
export const designSystem = {
  name: "Aspen Origin",
  version: "0.3",
  href: "https://www.aspenplay.dev/design-system.html#overview",
  thumb: "/system/aspen-origin.jpg",
  tagline: {
    en: "Aspen Play's design system, documented as a working tool.",
    cn: "Aspen Play 的设计系统，本身就是一件能上手的工具。",
  },
  intro: {
    en: "Aspen Origin is the design system of Aspen Play, a collection of browser games. Graphite surfaces, Geist type and three motion tempos keep the interface quiet so the game leads. Each page is a working tool: a contrast lab, a type tester, an inspector that measures real components. It also ships as an agent skill.",
    cn: "Aspen Origin 是网页游戏合集 Aspen Play 的设计系统。石墨灰、Geist 字体和三档动效让界面退后，把舞台留给游戏。每页都能上手：对比度实验台、字体测试器、实时测量组件的检查器。它还是一份给 AI 编码助手用的 skill。",
  },
  numbers: [
    { value: "8", label: { en: "components", cn: "个组件" } },
    { value: "68", label: { en: "design tokens", cn: "个 design token" } },
    { value: "38", label: { en: "icons, one 24 × 24 grid", cn: "个图标 · 24×24 网格" } },
    { value: "70/180/240", label: { en: "ms · motion tempos", cn: "毫秒 · 三档动效" } },
  ],
};

export type Combo = {
  index: string;
  title: string;
  proof: string;
  body: string;
};

export const combos: Combo[] = [
  {
    index: "01",
    title: "World-class Figma",
    proof: "40% faster integration",
    body: "The vendor docking SOP I wrote at TikTok Pay PIPO UED became the cross-market standard — integration cycles cut ~40% across VN / MY / ID. Tokens, components, error states, edge cases, all in.",
  },
  {
    index: "02",
    title: "Endorsed by TikTok",
    proof: "70 → 90% completion",
    body: "Vietnam KYC new-user completion lifted 20 points. The system outlasted my internship and became the team's default playbook. When your design ships as policy, that's the endorsement.",
  },
  {
    index: "03",
    title: "Frontend, shipped as PRs",
    proof: "Founding Design Engineer · Axel",
    body: "Product design through production frontend, delivered as reviewable PRs. At Axel, I connect design and engineering in both directions and carry the experience across branding, campaigns and 28 transactional email templates.",
  },
  {
    index: "04",
    title: "iF + Red Dot + IDEA",
    proof: "Three awards, one year",
    body: "iF Design + Red Dot + IDEA Student Award, all 2025 — for Field of Vision (cane for the blind) and CryoSave (CDC NWSS packaging). HCI + behavioral training underwrite the craft.",
  },
  {
    index: "05",
    title: "Founder's product judgment",
    proof: "$300K · 1K+ users",
    body: "XING Art: co-founded, raised $300K pre-seed at MiraclePlus '25, ran the product to scale, transitioned to shareholder + advisor. I read GMV / MRR / funnels — I find the problem before someone writes the brief.",
  },
  {
    index: "06",
    title: "Market taste, proven by P&L",
    proof: "200%+ annualized",
    body: "Personal portfolio, 200%+ annualized return. Products and markets are the same problem — what compounds, what's noise, what's mispriced. The instinct that finds alpha finds the concept worth shipping.",
  },
];
