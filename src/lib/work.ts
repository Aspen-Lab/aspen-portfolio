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
    cover: "/work/axel.webp",
    status: "live",
    liveUrl: "https://helloaxel.com",
    metrics: [
      { label: "Designer of record", value: "Sole" },
      { label: "Reports to", value: "CEO direct" },
      { label: "Target PR cadence", value: "5–10 / theme" },
      { label: "Branch lifespan", value: "1–3 days" },
    ],
    sections: [
      // ──────── CHAPTER 01 · OWNERSHIP ────────
      {
        chapter: "Ownership",
        heading: "Designer of record",
        body: "**Every pixel in Axel goes through one person.** Sole designer delivering production — the product comes from me with team discussion, but only I deliver. Reports directly to the CEO. Design and code are the *same artifact*: `Figma → tokens → Tailwind → Vercel preview`, no translation loss.",
        iconList: {
          items: [
            { icon: "globe", label: "helloaxel.com", text: "100% mine — landing, conversational UI, motion." },
            { icon: "layers", label: "Design system", text: "蓝绿粉 tokens · opacity ladder · rounded-xl · tabular-nums." },
            { icon: "spark", label: "28 email templates", text: "Customer.io · Liquid · \"no-fake-defaults\" pattern." },
            { icon: "code", label: "Production React", text: "Same repo as eng. Vercel preview is the handoff." },
          ],
          columns: 2,
        },
        callout: {
          variant: "insight",
          label: "Why this shape works pre-20",
          text: "A normal design layer **needs translation** to reach production — Figma → spec → tickets → eng → review → ship. Each translation drops fidelity and adds days. When the designer ships the React, the *handoff is the deploy*. Org chart can stay flat because there's nothing to mediate.",
        },
      },
      {
        chapter: "Ownership",
        heading: "Why a YC CEO would hire this shape",
        body: "Before 20 people you can't afford a design layer that needs translation. You need one person who can take an *ambiguous CEO ask*, ship a working prototype against real data by **Friday**, and have engineering trust the output. That's the slot. **No PMs to mediate.** No design-eng meetings to schedule. No specs to write twice.",
        pullQuote: {
          text: "The handoff is the deploy. There is no separate design environment to maintain.",
        },
      },
      {
        chapter: "Ownership",
        heading: "The stack I actually run",
        body: "Design and production *share* a stack. Same fonts, same tokens, same components. Adding a tool means I've already evaluated three.",
        table: {
          headers: ["Layer", "What's running"],
          rows: [
            ["Frontend", "Next.js 16 · React 19 · TypeScript · Tailwind 4 · Motion"],
            ["Email", "Customer.io · Liquid · \"no-fake-defaults\" guards · MJML thinking"],
            ["Decks", "PptxGenJS — dark + #0BE09B + Lato"],
            ["AI tooling", "Cursor · Claude Code · Figma MCP · Customer.io MCP · CLAUDE.md/repo"],
            ["Tokens", "蓝绿粉 palette · white/85 → 55 → 35 → 25 · rounded-xl · tabular-nums"],
            ["Glue", "Vercel preview as handoff · git as design history · Loom"],
          ],
          caption: "Same toolchain both sides — there is no \"design environment\" separate from production.",
        },
      },

      // ──────── CHAPTER 02 · THE PROTOCOL ────────
      {
        chapter: "The protocol",
        heading: "The Loop · symmetric, not asymmetric",
        body: "Most Design ⇌ FE handoffs are *asymmetric* — design throws specs over the wall, eng implements, friction lives in the gap. **Jesus** (lead engineer) and I built a *symmetric* protocol. I wrote the forward — three zones, two paths, a weekly rhythm. Jesus wrote the reverse — a `designer-fe-architect-review` skill, an `/audit-changes` command, four-tier safety routing. Both directions AI-protocolized. Translation loss → ~0.",
        visual: "loop-diagram",
        callout: {
          variant: "insight",
          label: "Asymmetric vs symmetric",
          text: "In **2026**, most design × FE relationships still don't protocolize *each other's* work — only their own. Symmetric means: I model how my work lands on Jesus, Jesus models how his work lands on me. The interface is the deliverable.",
        },
      },
      {
        chapter: "The protocol",
        heading: "Forward · Aspen → Jesus",
        body: "Three zones, two paths. **Playground** is source of truth — design lives, evolves, never merges; replaces Figma's role. **PR Branch** is transit — themed, short-lived, born to die. **Master** is production. Branches stay `1–3 days`, `5–10 changes` per themed PR.",
        userFlow: {
          title: "3 zones × 2 paths · the forward protocol",
          steps: [
            { id: "play", label: "Playground", caption: "source of truth · design lives, never merges", kind: "start" },
            { id: "choose", label: "Choose path", caption: "design-led or data-led trigger?", kind: "decision" },
            { id: "pr", label: "PR Branch", caption: "transit · themed · 1–3 days · 5–10 changes", kind: "step" },
            { id: "master", label: "Master", caption: "production · users see it", kind: "end" },
          ],
          branches: [
            {
              fromId: "choose",
              label: "Path A · design-led",
              destination: "Playground → PR → Master",
              caption: "\"What if X\" hi-fi prototypes before spec.",
            },
            {
              fromId: "choose",
              label: "Path B · data-led",
              destination: "Master → branch → PR",
              caption: "Real-data wiring + bugs only on real data.",
            },
          ],
        },
      },
      {
        chapter: "The protocol",
        heading: "Reverse · Jesus → Aspen — `/audit-changes`",
        body: "Four tiers, one command. **`/audit-changes`** classifies every PR by safety so I move fast on safe things and the right work gets eyes from the right person.",
        table: {
          headers: ["Tier", "Type", "Examples", "Action"],
          rows: [
            ["01", "Visual", "color · spacing · type · motion", "Claude self-audit → ship it"],
            ["02", "Markup", "DOM · component splits · props", "Light review"],
            ["03", "Behavior", "state · effects · API · interaction", "Review with Jesus"],
            ["04", "Out-of-bounds", "money · auth · type changes", "Pull from PR — Jesus owns"],
          ],
          caption: "Default safety routing. Designer never has to ask \"can I ship this?\" — the tier tells me.",
        },
        callout: {
          variant: "tip",
          label: "Halts are the system working",
          text: "When `/audit-changes` says *\"I'd need to change state shape / a test fails / I need a new dep\"*, that's the system **working**, not breaking. Halts don't get overridden — they get **escalated**. Designer trust comes from this.",
        },
      },
      {
        chapter: "The protocol",
        heading: "Weekly cadence · Hotel V1 trial",
        body: "The *rhythm* is the point. Make it visible so the team compounds on it instead of rebuilding habits each sprint.",
        table: {
          headers: ["Day", "Action"],
          rows: [
            ["Mon", "Close decisions · playground ready"],
            ["Tue", "3 themed PRs + 2-min Loom each + scenario links"],
            ["Wed", "Review — diff + scenario + Loom (three-piece set)"],
            ["Thu", "Merge → master → users · rebase playground"],
            ["Fri", "Debrief — where PRs got too big, where the loop broke"],
          ],
          caption: "Hotel V1 is this week's trial. Goal isn't perfection — it's *testability*.",
        },
      },

      // ──────── CHAPTER 03 · STATE & MOAT ────────
      {
        chapter: "State & moat",
        heading: "Where we are today",
        body: "Structurally **~10%** of the TikTok / Duolingo tier. ~40+ approved improvements stuck in the playground waiting on the loop to mature. We may settle around `40%` — *not a goal, a constraint*. TikTok and Duolingo run 700+ A/B per quarter with 1000+ designers. We can't win that race; we shouldn't try.",
        chart: {
          type: "bar",
          title: "Structural completeness · today vs ceiling",
          max: 100,
          data: [
            { label: "TikTok", value: 100, display: "100%", caption: "~1000 designers · 700+ A/B per quarter" },
            { label: "Duolingo", value: 95, display: "95%", caption: "Mature org · structural maturity ceiling" },
            { label: "Axel · target", value: 40, display: "40%", caption: "Realistic ceiling for our shape" },
            { label: "Axel · today", value: 10, display: "10%", caption: "~40 approved changes queued in playground" },
          ],
        },
      },
      {
        chapter: "State & moat",
        heading: "What we have that they can't replicate",
        body: "We can't outscale TikTok. We *can* out-iterate them on the per-decision quality of every keystroke.",
        iconList: {
          items: [
            { icon: "loop", label: "Zero-friction handoff", text: "Vercel preview = the deliverable. No translation, no spec, no tickets." },
            { icon: "spark", label: "AI-accelerated iteration", text: "Same repo, same prompt history, same `/audit-changes` skill across designer and engineer." },
            { icon: "code", label: "Hi-fi prototypes ARE production", text: "What I build in playground is what users get — same React, same tokens." },
            { icon: "compass", label: "Tight ownership routing", text: "Every decision has one named owner. No \"who decides this?\" cycles." },
          ],
          columns: 2,
        },
        callout: {
          variant: "note",
          label: "Why structural underdog still wins in travel",
          text: "Travel is a vertical where **experience density** beats **A/B volume**. A traveler interacts with a booking flow once; the moment has to be right. Big tech wins on volume tests; we win on every-detail-considered.",
        },
      },
      {
        chapter: "State & moat",
        heading: "What I leave behind",
        body: "The process is documenting itself — *turning into a transferable artifact*. These outlive the current collaboration.",
        iconList: {
          items: [
            { icon: "split", label: "3-zone × 2-path framework", text: "Playground · PR · Master with design-led / data-led triggers." },
            { icon: "shield", label: "4-tier `/audit-changes` skill", text: "Default safety routing baked into the command. Tier tells me what to do." },
            { icon: "loop", label: "Weekly cadence template", text: "Mon decisions · Tue PRs · Wed review · Thu merge · Fri debrief." },
            { icon: "workflow", label: "AI prompt library", text: "Per-repo `CLAUDE.md` + Figma MCP + Customer.io MCP wired together." },
          ],
          columns: 2,
        },
        callout: {
          variant: "insight",
          label: "What a YC CEO actually wants",
          text: "Not just `helloaxel.com` shipped — **repeatable structure**. The deepest output is turning the way I work with engineering into something a future team can pick up and keep running.",
        },
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
      "KYC across Vietnam, Malaysia, Indonesia, and the US for TikTok Pay, Shop, and Live. Vietnam new-user completion 70% → 90%. Vendor docking SOP cut integration cycles by ~40%.",
    tags: ["Fintech", "Compliance", "Multi-region", "Design System"],
    cover: "/work/tiktok.png",
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
    icon: "frontend",
    label: "Frontend · daily driver",
    items: [
      "Next.js App Router",
      "React · TypeScript",
      "Tailwind",
      "Motion",
      "Shiki + Lucide",
    ],
    note: "helloaxel.com · Lumen · this portfolio · pawsense",
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
    note: "Hermes (self-hosted information agent) · pawsense",
    link: { label: "See Hermes", href: "https://github.com/Aspen-Lab/Hermes" },
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
      label: "Hermes pipeline",
      href: "https://github.com/Aspen-Lab/Hermes",
    },
  },
  {
    icon: "game",
    label: "Game",
    items: ["Unity + C#", "PlayMaker FSM", "Hollow-Knight stack"],
    note: "2D Metroidvania w/ Skyler · 1–2h/day, Hollow-Knight stack",
  },
  {
    icon: "design",
    label: "Design",
    items: ["Figma + Figma MCP", "Framer", "Rhino + Keyshot", "Adobe CS"],
    note: "Where every project starts — Figma is the desk",
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
    proof: "100% of helloaxel.com",
    body: "Figma → tokens → Tailwind components → Vercel pull requests, no translation loss. Plus 28 transactional templates on Customer.io. The deliverable is commits, not a PDF.",
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
