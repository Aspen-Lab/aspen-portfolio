export type Project = {
  slug: string;
  title: string;
  client: string;
  role: string;
  period: string;
  year: string;
  date: string;
  category: string;
  summary: string;
  tags: string[];
  cover?: string;
  heroVideo?: string;
  metrics?: { label: string; value: string }[];
  sections?: {
    heading: string;
    body: string;
    images?: string[];
    imageLayout?: "single" | "grid-2" | "grid-3" | "grid-4";
    imageRatio?: "16/10" | "16/9" | "4/3" | "1/1" | "auto";
    chapter?: string;
    carouselAspect?: "16/9" | "16/10" | "4/3" | "1/1";
  }[];
  status?: "live" | "coming-soon";
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "axel",
    title: "Axel — sole designer × bidirectional loop",
    client: "Axel · Gordian Software (YC W19)",
    role: "Sole designer · reports to CEO",
    period: "Dec 2025 — Present",
    year: "Now",
    date: "ongoing",
    category: "Travel · Fintech",
    summary:
      "Sole designer at a YC W19 travel-money startup, reporting directly to the CEO. Built a symmetric Design ⇌ FE delivery protocol with the lead engineer that turns handoff into convergence — three zones, four review tiers, a weekly cadence. Every pixel in Axel goes through one person.",
    tags: ["Sole designer", "Design × FE protocol", "Production React"],
    status: "live",
    liveUrl: "https://helloaxel.com",
    metrics: [
      { label: "Designer of record", value: "Sole" },
      { label: "Reports to", value: "CEO direct" },
      { label: "Target PR cadence", value: "5–10 / theme" },
      { label: "Branch lifespan", value: "1–3 days" },
    ],
    sections: [
      {
        heading: "Ownership",
        body: "Every pixel in Axel goes through one person. I'm the sole designer delivering production design — the entire product comes from me with team discussion, but only I deliver. Reports directly to CEO. The design and the code are the same artifact: Figma → tokens → Tailwind → Vercel preview, no translation loss. helloaxel.com is 100% me; the conversational UI is mine; the design system is mine; the 28 transactional templates on Customer.io are mine.",
      },
      {
        heading: "The Loop · symmetric protocol",
        body: "Most Design ⇌ FE handoffs are asymmetric — design throws specs over the wall, engineering implements. Jesus (the lead engineer) and I built a symmetric protocol instead. I wrote the proposal: three zones, two paths, a weekly rhythm. Jesus wrote the response: a designer-fe-architect-review skill, an /audit-changes command, a four-tier classification. Both directions are now AI-protocolized; translation loss approaches zero. In 2026, most design × FE relationships still don't protocolize each other's work. This one does.",
      },
      {
        heading: "Forward · Aspen → Jesus",
        body: "Three zones, two paths. Playground = source of truth — design lives, evolves, never merges; replaces Figma's role. PR Branch = transit station — themed, short-lived, born to die. Master = production. Path A flows Playground → PR → Master for design-led features (\"what if X\" hi-fi prototypes before spec). Path B flows Master → branch → PR for real-data wiring and bugs that only exist on real data. Branches stay 1–3 days, 5–10 changes per themed PR.",
      },
      {
        heading: "Reverse · Jesus → Aspen",
        body: "Four tiers, one command. /audit-changes classifies every PR by safety. Tier 01 Visual — color, spacing, type, motion — Claude self-audits, ships. Tier 02 Markup — DOM structure, component splits — light review. Tier 03 Behavior — state, effects, API — review with Jesus. Tier 04 Out-of-bounds — money, auth, type changes — pull from PR, Jesus takes it. Halts (\"I'd need to change state shape / a test fails / new dep\") are the system working, not bugs. They don't get overridden; they get escalated.",
      },
      {
        heading: "Weekly cadence · Hotel V1 trial",
        body: "Monday — close decisions, playground ready. Tuesday — open three themed PRs + a 2-minute Loom walkthrough each + scenario links. Wednesday — review (diff + scenario + Loom, three-piece set). Thursday — merge → master → users; rebase playground. Friday — debrief: where PRs got too big, where the loop broke. Hotel V1 this week is the trial run; the goal isn't perfection, it's testability.",
      },
      {
        heading: "Asymmetric advantage",
        body: "We're at ~10% of TikTok / Duolingo's structural completeness. ~40+ approved improvements stuck in the playground waiting on the loop to mature. Structurally we may stay around 40% — that's not a goal. TikTok and Duolingo run 700+ A/B per quarter with 1000+ designers; we can't win that race. What we have is zero-friction handoff, AI-accelerated iteration, and hi-fi prototypes that ARE the production code — flexibility big tech literally can't replicate. In a vertical like travel, that gets us experience parity or better, even at structural underdog.",
      },
      {
        heading: "Methodology, becoming portable",
        body: "The process is documenting itself — turning into a transferable artifact. The 3-zone × 2-path framework, the 4-tier /audit-changes skill, the weekly cadence — these outlive the current collaboration. The deepest output isn't shipping helloaxel.com; it's turning the way I work with engineering into something a future team can pick up and keep running.",
      },
    ],
  },
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
      "Reduced drop-off and integration time for KYC across Vietnam, Malaysia, and Indonesia for TikTok Pay, Shop, and Live. Vietnam new-user completion: 70% → 90%. Vendor docking SOP cut integration cycles by ~40%.",
    tags: ["Fintech", "Compliance", "Multi-region", "Design System"],
    cover: "/work/tiktok.png",
    status: "live",
    metrics: [
      { label: "Vietnam KYC completion", value: "70 → 90%" },
      { label: "Vendor integration cycle", value: "−40%" },
      { label: "Markets shipped", value: "VN · MY · ID" },
    ],
    sections: [
      {
        heading: "Overview",
        body: "TikTok Pay was scaling rapidly across Southeast Asia, where KYC is the gate that decides both compliance and trust. The work focused on information-reuse flows, multi-vendor SDK alignment, and compliance-driven UX — to reduce drop-offs, increase trust, and build scalable systems across markets.",
      },
      {
        heading: "Goals",
        body: "Business → reach cross-market compliance and lift KYC completion. User → make onboarding simpler, clearer, more trustworthy. Design → ship a scalable framework that absorbs multiple SDK vendors and country requirements without falling apart.",
      },
      {
        heading: "UX problem — the missing escape path",
        body: "Users reusing historical identity data had no fallback when they couldn't find their ID, which produced drop-offs and a long tail of support tickets. We added \"Not My ID\" flows, clearer fallback paths, and progress visibility informed by the Goal Gradient Hypothesis — so the user always knew where they were and why it was worth one more step.",
      },
      {
        heading: "Compliance problem — OCR & localization",
        body: "Vendors returned inconsistent OCR fields between Malaysia and Vietnam, forcing users to re-enter data manually and risking non-compliance. We standardized OCR field mappings, partnered with Legal and Risk, and ensured the flow stayed regulator-aligned across markets.",
      },
      {
        heading: "UI problem — vendor SDK vs TUX",
        body: "Vendor SDKs shipped with inconsistent typography, corner radius, icons, and error states. Fragmented UI cratered trust precisely where it mattered most. We built an SDK-AAI Design Style Alignment, unified the components, and delivered reusable UI templates — pushing SDK teams to support secondary UI encapsulation so countries could vary cleanly.",
      },
      {
        heading: "Vendor Docking SOP",
        body: "Authored the first standardized Vendor Docking SOP — workflows, acceptance criteria, UI delivery priorities. Onboarding new SDKs went ~40% faster, and cross-market scalability stopped being a function of who was on shift.",
      },
      {
        heading: "Outcomes",
        body: "Better completion (clearer fallbacks, fewer dead ends). Cross-market consistency (unified SDK UI, OCR mappings). A reusable system (UI templates, component library). And operational lift — the SOP collapsed integration cycles by ~40%.",
      },
      {
        heading: "Reflection",
        body: "Compliance-first UX is its own discipline — you're balancing regulator language with human language. The right answer was less about fixing a single flow and more about making the underlying SDK system modular, configurable, and data-driven. Future me wants to push further on configurable SDK frameworks and data-driven UX enhancements.",
      },
    ],
  },
  {
    slug: "hyundai",
    title: "Hyundai IONIQ 6 — designing for trust at L2+",
    client: "Hyundai · HATCI Lab",
    role: "HMI Designer",
    period: "Jan — May 2025",
    year: "2025",
    date: "9/17/25",
    category: "Sponsored Project",
    summary:
      "How might we improve driver confidence in semi-autonomous scenarios, where control transitions between human and machine? A study across 9 drivers, biometrics, and three UI directions — Green UI lifted confidence by +10% over the baseline.",
    tags: ["HMI", "Semi-autonomous", "Research"],
    cover: "/work/hyundai.png",
    status: "live",
    metrics: [
      { label: "Confidence lift (Green UI vs baseline)", value: "+10%" },
      { label: "Drivers tested", value: "9" },
      { label: "UI directions explored", value: "3" },
    ],
    sections: [
      {
        heading: "Problem",
        body: "How might we increase driver confidence in Hyundai's HDA 2.0 system under semi-Level 2 and Level 2+ autonomy — where control quietly slides between human and machine, and trust is the variable that decides everything?",
      },
      {
        heading: "Method",
        body: "Nine drivers in real and simulated conditions. ECG (heart-rate variability), Tobii eye tracking, and self-report Likert surveys. A custom Unreal Engine simulator with surround sound and highway rendering. A/B UI testing, paired-sample t-test, and a confidence metric synthesized from biometric and behavioral data.",
      },
      {
        heading: "Insight",
        body: "Less information builds trust in partial autonomy; more information reassures in full autonomy. The dose changes with the autonomy level — and the existing HDA UI didn't titrate, so every handoff cost the driver something.",
      },
      {
        heading: "Three directions",
        body: "White UI as a minimal baseline. Green UI as an emotionally calming, trust-oriented direction. Blue UI as a highly technical, information-rich variant. Each was scored on the confidence metric and triangulated against driver feedback.",
      },
      {
        heading: "Result",
        body: "Green UI achieved a +10% improvement in confidence score over the baseline. The final solution layered dynamic icon feedback (paused vs active), adaptive info density tied to driving mode, high-contrast lane keep + distance follow alerts, and a steering-wheel-mounted screen as the North Star concept.",
      },
      {
        heading: "What's next",
        body: "Simulator integration so users can learn the system's behaviors before trusting them. Complex cityscape testing to extend findings beyond highway. Stratified participant selection by Hyundai-vehicle familiarity to isolate prior bias from new design effect.",
      },
    ],
  },
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

export type StackCategory = {
  label: string;
  items: string[];
  note?: string;
};

export const stack: StackCategory[] = [
  {
    label: "Frontend · daily driver",
    items: ["Next.js App Router", "React · TypeScript", "Tailwind", "Motion", "Shiki + Lucide"],
    note: "Lumen, helloaxel.com, internal dashboards.",
  },
  {
    label: "Email engineering",
    items: ["Customer.io", "Liquid templating", "No-fake-defaults pattern", "MJML thinking"],
    note: "28 templates, onboarding through cancellation.",
  },
  {
    label: "Backend & data",
    items: ["Python 3.10+ asyncio", "SQLite + YAML", "Docker Compose", "Postgres / Supabase"],
    note: "Hermes, pawsense, internal services.",
  },
  {
    label: "AI · 3 tiers",
    items: ["Anthropic SDK", "Google GenAI", "Ollama (local)", "TF-IDF (rules)"],
    note: "Tier 0 / 1 / 2 — match cost and capability to the task.",
  },
  {
    label: "Game",
    items: ["Unity + C#", "PlayMaker FSM", "Hollow-Knight stack"],
    note: "2D Metroidvania w/ Skyler, 1–2h/day.",
  },
  {
    label: "Design",
    items: ["Figma + Figma MCP", "Framer", "Rhino + Keyshot", "Adobe CS"],
    note: "Where the form starts.",
  },
  {
    label: "Tooling · the glue",
    items: ["Cursor", "Claude Code", "unity-mcp · Ludo MCP", "Customer.io MCP", "PptxGenJS"],
    note: "CLAUDE.md auto-loads project-specific design system rules per repo.",
  },
];

export const spectrum = [
  "Design",
  "Frontend",
  "Templating",
  "Backend",
  "Game",
];

export type SideProject = {
  name: string;
  blurb: string;
  tech: string;
  href: string;
  status: string;
};

export const sideProjects: SideProject[] = [
  {
    name: "Hermes",
    blurb:
      "Self-hosted information agent. Five-stage pipeline (ingest → score → dedup → distill → output) turns RSS / HN / arXiv / Reddit into ten things I actually care about, written to my Obsidian vault. Tier 0 (rules) → Tier 1 (Ollama local) → Tier 2 (BYOK cloud).",
    tech: "Python 3.10+ · asyncio · SQLite · YAML · Docker · MIT",
    href: "https://github.com/Aspen-Lab/Hermes",
    status: "v0 MVP",
  },
  {
    name: "Lumen",
    blurb:
      "Interactive UI components for AI-native products — reasoning visualization, decision presentation, action confirmation. Two-layer parameters (visual + product semantic) and copyable code.",
    tech: "TypeScript · Next.js · Motion",
    href: "https://github.com/Aspen-Lab/lumen",
    status: "Active",
  },
  {
    name: "Metroidvania",
    blurb:
      "Untitled 2D Metroidvania, Hollow-Knight stack. Engineering full-stack solo; Skyler on art and music. Working in 1–2 hour daily blocks: 2 weeks of greybox, 6 weeks for the first area, 3-month MVP target.",
    tech: "Unity · C# · PlayMaker · Claude Code + unity-mcp",
    href: "",
    status: "WIP",
  },
  {
    name: "CardFlow",
    blurb:
      "Notion-like editor that auto-generates 小红书-style swipeable cards. Five themes, real-time preview, swipe / keyboard / scroll paging.",
    tech: "TypeScript · CN audience",
    href: "https://github.com/Aspen-Lab/cardflow",
    status: "Shipped",
  },
  {
    name: "Itinerary",
    blurb:
      "A lightweight trip itinerary PWA — for the kind of trip you want to remember a year later.",
    tech: "HTML · PWA",
    href: "https://github.com/Aspen-Lab/Itinerary",
    status: "Shipped",
  },
];

export type Combo = {
  index: string;
  label: string;
  body: string;
};

export const combos: Combo[] = [
  {
    index: "01",
    label: "Design × Production code",
    body: "I designed and shipped 100% of helloaxel.com. Figma → tokens → Tailwind components → Vercel preview, no translation loss. The deliverable is commits, not a PDF.",
  },
  {
    index: "02",
    label: "Founder × Designer",
    body: "XING Art: co-founded, raised $300K pre-seed, ran the product, transitioned to shareholder + advisor. I read GMV / MRR / funnels — I find the problem before someone hands me a brief.",
  },
  {
    index: "03",
    label: "Cog Sci × Visual craft",
    body: "iF + Red Dot 2025 for Field of Vision — and the underlying training is HCI / behavioral science. I can explain why a flow works, not just claim that it does.",
  },
  {
    index: "04",
    label: "AI × Cross-domain width",
    body: "Cursor + Claude Code + Figma MCP + unity-mcp + Customer.io MCP. I don't use AI for one-shot acceleration; I use it to fuse design, frontend, email, backend, and game dev into a single delivery chain.",
  },
];
