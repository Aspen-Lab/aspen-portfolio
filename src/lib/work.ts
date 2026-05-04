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
  cover: string;
  metrics?: { label: string; value: string }[];
  sections?: { heading: string; body: string }[];
  status?: "live" | "coming-soon";
};

export const projects: Project[] = [
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
    status: "live",
    metrics: [
      { label: "Self-reported motivation lift", value: "+85%" },
      { label: "Positive feedback on usability", value: "90%" },
      { label: "Design system surfaces", value: "End-to-end" },
    ],
    sections: [
      {
        heading: "Problem",
        body: "Budgeting matters but it's hard, especially for new learners. Most apps are overwhelming because they're built for the highly disciplined. The people who most need help — the ones who want to save but can't stay consistent — are the ones who quietly drop out first.",
      },
      {
        heading: "Research",
        body: "Surveys and in-depth interviews with self-identified low-motivation, low-discipline users surfaced three insights: simple intuitive interactions reduce overwhelm; gamification mechanics significantly boost engagement; and small, personalized nudges drive consistency. We were looking at a large, underserved group whose biggest enemy was friction.",
      },
      {
        heading: "Design objectives",
        body: "Lower the entry barrier — minimize cognitive load, frictionless onboarding. Boost engagement through daily saving challenges, interactive rewards, playful rituals. Personalize tasks and suggestions based on individual spending patterns and goals.",
      },
      {
        heading: "Why \"Nut\"",
        body: "We chose Nut as the virtual assistant because it symbolizes growth, saving, and potential — a small thing that becomes something bigger. The metaphor makes financial progress feel tangible, approachable, and friendly.",
      },
      {
        heading: "What shipped",
        body: "Goal Setting (personalized, manageable steps). Daily challenges based on the user's spending pattern. The Nut assistant for visual reward and emotional feedback. A clear financial overview as honest data viz of habits, budgets, and progress. A full design system to keep it coherent across surfaces.",
      },
      {
        heading: "Validation",
        body: "Multiple rounds of usability testing with target users refined the interactions. The result: stronger retention through play, observable improvements in saving behavior among users who'd previously bounced off discipline-heavy apps, and overwhelmingly positive feedback.",
      },
      {
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
    title: "Cone Walk Safe",
    client: "Aspen Lab · iF Design Award 2025",
    role: "Product Designer & Researcher",
    period: "Jun 2024",
    year: "2024",
    date: "6/20/24",
    category: "Design for Disabled",
    summary:
      "A wearable + interface system designed for visually impaired pedestrians. iF Design Award 2025 winner.",
    tags: ["Accessibility", "Wearable", "Service design"],
    cover: "/work/cone.png",
    status: "coming-soon",
    metrics: [
      { label: "Recognition", value: "iF Design 2025" },
    ],
    sections: [
      {
        heading: "Status",
        body: "Detailed case study coming soon. Cone Walk Safe is a navigation aid system for visually impaired pedestrians — recognized with the iF Design Award in 2025 for its approach to accessibility. Reach out if you'd like to dig into the design and research now.",
      },
    ],
  },
  {
    slug: "kindly",
    title: "Kindly — e-commerce, with care",
    client: "Aspen Lab",
    role: "UI/UX Design & Product Manager",
    period: "Aug 2025",
    year: "2025",
    date: "8/1/25",
    category: "E-Commerce",
    summary:
      "An AI-assisted household e-commerce platform — designed end-to-end across discovery, decision, and follow-up.",
    tags: ["E-Commerce", "AI", "Design System"],
    cover: "/work/kindly.png",
    status: "coming-soon",
    metrics: [],
    sections: [
      {
        heading: "Status",
        body: "Detailed case study coming soon. Kindly is an AI-assisted household e-commerce platform designed end-to-end across discovery, decision, and follow-up. Reach out if you'd like to dig in now.",
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
  { title: "iF Design Award", project: "Cone Walk Safe", year: "2025" },
  { title: "IDEA Student Award", project: "CryoSave for CDC NWSS", year: "2025" },
  { title: "Bredendieck Award", project: "Georgia Tech (×2)", year: "" },
  { title: "Humanitarian Award", project: "", year: "" },
  { title: "Atlanta Design Festival", project: "Recognition", year: "" },
];
