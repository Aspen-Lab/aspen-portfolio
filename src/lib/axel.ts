import type { Project } from "./work";

// Business milestones supplied by Aspen, September 2026. GMV is not ARR;
// no currency or annualization is implied. Attribute growth to the team.
export const axelProject: Project = {
  slug: "axel",
  title: "Axel — design, code & growth",
  client: "Axel · Gordian Software (YC W19)",
  role: "Founding Design Engineer · Full-time",
  period: "Dec 2025 — Present",
  year: "Now",
  date: "ongoing",
  category: "Travel · Fintech",
  summary:
    "Founding Design Engineer at Axel (YC W19), building through the team's growth from 0 to 30M GMV and 100K+ users. I own product design and frontend delivery, shipping PRs alongside brand, campaign and email work that supports growth.",
  tags: ["Design engineering", "Frontend PRs", "Brand & growth"],
  cover: "/work/axel.webp",
  coverWidth: 1200,
  coverHeight: 630,
  coverPosition: "0% 50%",
  status: "live",
  liveUrl: "https://helloaxel.com",
  metrics: [
    { label: "Axel GMV · from 0 · team milestone", value: "30M" },
    { label: "Axel users · from 0 · team milestone", value: "100K+" },
    { label: "My primary deliverable", value: "PRs" },
    { label: "Transactional email templates", value: "28" },
  ],
  sections: [
    {
      chapter: "Building Axel",
      heading: "A founding role, from product decisions to production",
      body: "Since December 2025, I've worked full-time as Axel's **Founding Design Engineer**, reporting directly to the CEO. I take product problems from early exploration through interface design, frontend implementation, testing and engineering review. My remit also covers the brand and the creative work that brings people into the product.",
      iconList: {
        items: [
          { icon: "compass", label: "Product design", text: "User journeys, interaction design and the details of booking and membership experiences." },
          { icon: "code", label: "Frontend engineering", text: "Production React, reusable components, responsive layouts, interaction states and motion—delivered as PRs." },
          { icon: "eye", label: "Brand & campaigns", text: "Visual identity, core advertising campaign creative and the landing pages that connect them to the product." },
          { icon: "check", label: "Email & testing", text: "Transactional email design and implementation, product QA and iterative testing." },
        ],
        columns: 2,
      },
    },
    {
      chapter: "Building Axel",
      heading: "Building through 0 → 30M GMV",
      body: "Axel grew from **0 to 30M GMV** and **0 to 100K+ users**. My contribution spans the experience people discover, the product they use and the communications they receive: product design, frontend PRs, brand, campaigns and email. I work with the team to turn growth priorities into changes we can ship, test and refine.",
      callout: {
        variant: "note",
        label: "Business context",
        text: "GMV and user growth are **company milestones achieved by the team**. My contribution is the design and engineering work described here, with a focus on faster iteration and revenue growth.",
      },
    },
    {
      chapter: "Design ⇌ Engineering",
      heading: "I ship pull requests",
      body: "My primary deliverable is a **reviewable PR**. I work in the frontend codebase, building the components, layouts, states and interactions needed to carry an experience into production. On **helloaxel.com**, that includes the landing experience, conversational interface and motion. A working preview lets the team review the actual behavior alongside the code.",
      userFlow: {
        title: "From a product problem to a reviewed change",
        steps: [
          { id: "problem", label: "Frame the problem", caption: "User need, business goal and engineering constraints", kind: "start" },
          { id: "design", label: "Design & prototype", caption: "Flows, visuals and interaction states", kind: "step" },
          { id: "build", label: "Implement & test", caption: "Production frontend, responsive behavior and QA", kind: "step" },
          { id: "pr", label: "Ship a PR", caption: "Focused diff, working preview and review context", kind: "end" },
        ],
      },
    },
    {
      chapter: "Design ⇌ Engineering",
      heading: "The collaboration runs both ways",
      body: "I connect design and engineering in both directions. **Design → engineering:** I turn intent into components, interaction states and PRs that engineers can review. **Engineering → design:** I bring implementation feedback, real data and technical constraints back into the experience. Working with the lead engineer, I help keep the design and the running product aligned as both evolve.",
      visual: "loop-diagram",
      table: {
        headers: ["Direction", "What I bring", "What the team can review"],
        rows: [
          ["Design → engineering", "Flows, visual decisions, components and frontend implementation", "A focused PR with a working preview and scenarios to check"],
          ["Engineering → design", "Constraints, data states, implementation feedback and QA findings", "Updated interactions, states and design decisions"],
        ],
      },
    },
    {
      chapter: "Design ⇌ Engineering",
      heading: "Fast iteration with AI coding tools",
      body: "I use **AI coding tools** throughout prototyping and implementation to move quickly from a design decision to a working change. The shared workflow with engineering gives that speed structure: focused PRs, clear review context and checks appropriate to the change. I stay responsible for the experience, the code I submit and the testing behind it.",
      iconList: {
        items: [
          { icon: "spark", label: "Build quickly", text: "Use AI to explore interactions, implement frontend changes and iterate in the product's existing stack." },
          { icon: "workflow", label: "Make review concrete", text: "Pair the code diff with a preview and the user scenarios the change affects." },
          { icon: "shield", label: "Match review to impact", text: "Work with engineering on behavior, data and sensitive flows; verify visual and interaction details throughout." },
        ],
        columns: 3,
      },
    },
    {
      chapter: "Brand & growth",
      heading: "One experience, from the ad to the product",
      body: "I work across **branding, visual identity and core advertising campaigns**, carrying the same visual direction into landing pages and the product. That scope connects acquisition creative to what a traveler sees next. Within the product, my work includes booking and membership experiences, with attention to how people understand membership value and savings.",
      pullQuote: {
        text: "I connect the brand people discover with the product they actually use.",
      },
    },
    {
      chapter: "Brand & growth",
      heading: "Email is part of the product",
      body: "I design and maintain **28 transactional email templates** in **Customer.io and Liquid**, from onboarding to cancellation. The work combines visual design with implementation: using real event data, handling missing values and checking how messages render. Email carries the same care as the interface because it is often where people learn what happened and what to do next.",
    },
  ],
};

export const axelProjectCn: Project = {
  ...axelProject,
  title: "Axel — 设计、代码与增长",
  role: "Founding Design Engineer · 全职",
  period: "2025 年 12 月 — 至今",
  category: "旅行 · 金融科技",
  summary:
    "作为 Axel（YC W19）的 Founding Design Engineer，参与团队从 0 到 30M GMV、100K+ 用户的增长。我负责产品设计与前端交付，直接提交 PR，同时覆盖品牌、核心广告 campaign 和邮件体验。",
  tags: ["设计工程", "前端 PR 交付", "品牌与增长"],
  metrics: [
    { label: "Axel GMV · 从 0 起步的团队成果", value: "30M" },
    { label: "Axel 用户数 · 从 0 起步的团队成果", value: "100K+" },
    { label: "我的主要交付物", value: "PRs" },
    { label: "交易类邮件模板", value: "28" },
  ],
  sections: [
    {
      chapter: "共建 Axel",
      heading: "从产品决策到生产代码的创始岗位",
      body: "自 2025 年 12 月起，我全职担任 Axel 的 **Founding Design Engineer（创始设计工程师）**，直接向 CEO 汇报。我把产品问题从早期探索推进到界面设计、前端实现、测试和工程评审，同时负责品牌与增长创意，让产品内外的体验保持一致。",
      iconList: {
        items: [
          { icon: "compass", label: "产品设计", text: "用户旅程、交互设计，以及预订和会员体验中的具体细节。" },
          { icon: "code", label: "前端工程", text: "生产级 React、可复用组件、响应式布局、交互状态与动效，直接以 PR 交付。" },
          { icon: "eye", label: "品牌与广告", text: "品牌视觉、核心广告 campaign 创意，以及连接广告和产品的落地页。" },
          { icon: "check", label: "邮件与测试", text: "交易类邮件设计与实现、产品 QA，以及持续的测试迭代。" },
        ],
        columns: 2,
      },
    },
    {
      chapter: "共建 Axel",
      heading: "参与从 0 到 30M GMV 的增长",
      body: "Axel 的 GMV 从 **0 增长到 30M**，用户数从 **0 增长到 100K+**。我的贡献贯穿用户发现产品、使用产品和接收沟通的过程：产品设计、前端 PR、品牌、广告 campaign 与邮件。我和团队一起把增长目标拆成可以交付、测试和持续改进的具体工作。",
      callout: {
        variant: "note",
        label: "业务背景",
        text: "GMV 和用户增长是**团队共同实现的公司成果**。我的贡献是这里呈现的设计与工程交付，工作重点是加快产品迭代、支持收入增长。",
      },
    },
    {
      chapter: "设计 ⇌ 工程",
      heading: "我的主要交付物是 PR",
      body: "我直接在前端代码库中工作，把组件、布局、状态和交互实现为**可评审的 PR**。在 **helloaxel.com**，这包括落地页体验、对话式界面和动效。团队可以通过运行中的预览查看真实交互，再结合代码评审推进上线。",
      userFlow: {
        title: "从产品问题到可评审的改动",
        steps: [
          { id: "problem", label: "明确问题", caption: "用户需求、业务目标和工程约束", kind: "start" },
          { id: "design", label: "设计与原型", caption: "流程、视觉和交互状态", kind: "step" },
          { id: "build", label: "实现与测试", caption: "生产级前端、响应式行为和 QA", kind: "step" },
          { id: "pr", label: "交付 PR", caption: "聚焦的代码改动、预览和评审背景", kind: "end" },
        ],
      },
    },
    {
      chapter: "设计 ⇌ 工程",
      heading: "让设计与工程双向协作",
      body: "我负责连接设计与工程的两个方向。**设计 → 工程：**把设计意图落实为组件、交互状态和可评审的 PR。**工程 → 设计：**把实现反馈、真实数据和技术约束带回设计，调整体验和细节。我与首席工程师共同维护这套协作方式，让设计和实际产品在迭代中保持一致。",
      visual: "loop-diagram",
      table: {
        headers: ["方向", "我带入的内容", "团队可以评审的交付"],
        rows: [
          ["设计 → 工程", "用户流程、视觉决策、组件和前端实现", "聚焦的 PR、运行预览和待验证的用户场景"],
          ["工程 → 设计", "技术约束、数据状态、实现反馈和 QA 发现", "更新后的交互、状态和设计决策"],
        ],
      },
    },
    {
      chapter: "设计 ⇌ 工程",
      heading: "用 AI Coding 加快迭代",
      body: "我在原型和实现过程中使用 **AI 编码工具**，缩短从设计决策到可运行改动的距离。与工程团队共享的工作方式为快速交付提供支撑：聚焦的 PR、清楚的评审背景，以及与改动影响相匹配的检查。我始终负责最终体验、提交的代码和交付前的测试。",
      iconList: {
        items: [
          { icon: "spark", label: "快速实现", text: "用 AI 探索交互、实现前端改动，并在产品已有技术栈中迭代。" },
          { icon: "workflow", label: "让评审有据可依", text: "让代码改动、运行预览和受影响的用户场景一起进入评审。" },
          { icon: "shield", label: "按影响范围协作", text: "涉及行为、数据和敏感流程时与工程师共同检查，持续验证视觉和交互细节。" },
        ],
        columns: 3,
      },
    },
    {
      chapter: "品牌与增长",
      heading: "从广告到产品，保持一致的体验",
      body: "我负责**品牌、视觉体系和核心广告 campaign 创意**，并把同一套视觉方向延续到落地页和产品中，让用户从广告进入产品的过程保持连贯。在产品内部，我也参与预订与会员体验的设计，关注用户如何理解会员价值和节省金额。",
      pullQuote: {
        text: "把用户最初认识的品牌，连接到他们真正使用的产品。",
      },
    },
    {
      chapter: "品牌与增长",
      heading: "邮件也是产品的一部分",
      body: "我在 **Customer.io 和 Liquid** 中设计并维护 **28 个交易类邮件模板**，覆盖从 onboarding 到取消的用户流程。这项工作同时包含视觉与实现：接入真实事件数据、处理缺失值、检查渲染效果。用户经常通过邮件了解发生了什么、下一步该怎么做，因此我用与产品界面相同的标准打磨邮件体验。",
    },
  ],
};
