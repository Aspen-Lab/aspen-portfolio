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
    "Founding Design Engineer at Axel (YC W19), building through the team's growth from 0 to 30M GMV and 150K users, with revenue growing fast. I own product design and frontend delivery, shipping PRs alongside brand, campaign and email work that supports growth.",
  tags: ["Design engineering", "Frontend PRs", "Brand & growth"],
  // The helloaxel.com hero as published in Render's customer story
  // (render.com/customers/axel). Pinned to the top: the frames crop only
  // the dark ground under the mountains.
  cover: "/work/axel-home.webp",
  coverWidth: 2000,
  coverHeight: 1333,
  coverPosition: "50% 0%",
  // helloaxel.com's pink (its FOUND sign): the one accent on this page
  accent: "#ff6f93",
  // In % of the 16:9 hero, which shows the top 84% of the 3:2 shot.
  coverNotes: [
    { box: [36.5, 15.5, 27.5, 14.5], at: [34, 22.5], title: "One promise", text: "The headline makes a single claim, the best price, and the result card right below backs it up." },
    { box: [69.5, 16.5, 19, 19], at: [67.5, 26], title: "A pixel night sky", text: "Moon, clouds and mountains drawn in pixels. Inside the app, the same night continues as a pixel city." },
    { box: [32.3, 32.3, 8.2, 10], at: [30.3, 37.3], title: "A face for the agent", text: "The axolotl peeks over the result. In the app, it is the one that answers." },
    { box: [30.7, 37.8, 39.1, 38.6], at: [28.7, 52], title: "Proof before sign-up", text: "A sample result (route, times, fare) with a dot-matrix FOUND sign on its edge shows what a search returns." },
    { box: [32, 66.3, 36.6, 7.6], at: [28.7, 70.1], title: "The saving, stated", text: "The fare sits next to the usual price, struck through, and the difference gets its own green tag." },
  ],
  status: "live",
  liveUrl: "https://helloaxel.com",
  metrics: [
    { label: "Axel GMV · from 0 · team milestone", value: "30M" },
    { label: "Axel users · from 0 · team milestone", value: "150K" },
    { label: "My primary deliverable", value: "PRs" },
    { label: "Transactional email templates", value: "79" },
  ],
  sections: [
    {
      chapter: "Building Axel",
      heading: "A founding role, from product decisions to production",
      body: "Since December 2025, I've worked full-time as Axel's **Founding Design Engineer**, reporting directly to the CEO. I take product problems from early exploration through interface design, frontend implementation, testing and engineering review. My remit also covers the brand and the creative work that brings people into the product.",
      // What the role covers, drawn on the chain from problem to production:
      // each area spans the stages the copy says it covers.
      span: {
        stages: ["Explore", "Design", "Build", "Test", "Ship"],
        total: "One role, problem to production",
        rows: [
          { kicker: "Product design", title: "Journeys, booking and membership", text: "User journeys, interaction design and the details of booking and membership experiences.", from: 0, to: 1, items: ["Journeys", "Booking", "Membership"] },
          { kicker: "Frontend engineering", title: "Delivered as pull requests", text: "Production React, reusable components, responsive layouts, interaction states and motion—delivered as PRs.", from: 2, to: 4, items: ["React", "States & motion", "PRs"] },
          { kicker: "Brand & campaigns", title: "From the ad to the product", text: "Visual identity, core advertising campaign creative and the landing pages that connect them to the product.", from: 0, to: 2, items: ["Identity", "Campaigns", "Landing pages"] },
          { kicker: "Email & testing", title: "79 transactional templates", text: "Transactional email design and implementation, product QA and iterative testing.", from: 1, to: 4, items: ["79 templates", "QA", "Customer.io + Liquid"] },
        ],
      },
    },
    {
      chapter: "Building Axel",
      heading: "Building through 0 → 30M GMV",
      body: "Axel grew from **0 to 30M GMV** and **0 to 150K users**, and revenue is growing fast. My contribution spans the experience people discover, the product they use and the communications they receive: product design, frontend PRs, brand, campaigns and email. I work with the team to turn growth priorities into changes we can ship, test and refine.",
      // Where Axel is now, and where along a traveler's path my work sits.
      growth: {
        figures: [
          { value: "150K", label: "Users, from 0" },
          { value: "30M", label: "GMV, from 0" },
          { value: "", label: "Revenue", note: "Growing fast" },
        ],
        journey: [
          { stage: "Discover", work: "Brand, ad campaigns and landing pages" },
          { stage: "Search & book", work: "Product design and frontend PRs" },
          { stage: "After booking", work: "79 transactional email templates" },
        ],
        tag: "Team milestones",
      },
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
        variant: "route",
        title: "From a product problem to a reviewed change",
        steps: [
          { id: "problem", label: "Frame the problem", caption: "User need, business goal and engineering constraints", kind: "start" },
          { id: "design", label: "Design & prototype", caption: "Flows, visuals and interaction states", kind: "step" },
          { id: "build", label: "Implement & test", caption: "Production frontend, responsive behavior and QA", kind: "step" },
          { id: "pr", label: "Ship a PR", caption: "Focused diff, working preview and review context", kind: "end" },
        ],
      },
      // Second image of Render's customer story (render.com/customers/axel)
      figures: [
        {
          src: "/work/axel/search-iphone.webp",
          width: 2000,
          height: 1406,
          alt: "Axel on iPhone: flight results for a Seattle to Los Angeles search",
          caption: "Travelers describe a trip in plain language; Axel searches flight and hotel deals.",
          notes: [
            { box: [36.5, 80.8, 27, 11], at: [30.5, 86.3], title: "Ask in a sentence", text: "“Seattle to LA, Friday morning”: the trip, typed the way you would say it." },
            { box: [36.5, 12.4, 27, 7], at: [30.5, 15.9], title: "The trip, read back", text: "What Axel understood sits on top (route, date, travelers) with a pencil to change it." },
            { box: [33.5, 21, 33, 9.8], at: [30.5, 25.9], title: "A verdict first", text: "Each option opens with a one-line reason from the axolotl and a rating: Great, Good." },
            { box: [33.5, 40.4, 33, 9.4], at: [30.5, 45.1], title: "Savings beside Book", text: "The fare, the usual price struck through and the difference sit right next to the Book button." },
            { box: [36.5, 52.5, 27, 24.5], at: [30.5, 57], title: "Trade-offs in plain words", text: "The next option says what you give up: later, for a little more." },
          ],
        },
      ],
    },
    {
      chapter: "Design ⇌ Engineering",
      heading: "The collaboration runs both ways",
      body: "I connect design and engineering in both directions. **Design → engineering:** I turn intent into components, interaction states and PRs that engineers can review. **Engineering → design:** I bring implementation feedback, real data and technical constraints back into the experience. Working with the lead engineer, I help keep the design and the running product aligned as both evolve.",
      visual: "loop-diagram",
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
        variant: "charts",
      },
    },
    {
      chapter: "Brand & growth",
      heading: "One experience, from the ad to the product",
      body: "I work across **branding, visual identity and core advertising campaigns**, carrying the same visual direction into landing pages and the product. That scope connects acquisition creative to what a traveler sees next. Within the product, my work includes booking and membership experiences, with attention to how people understand membership value and savings.",
      pullQuote: {
        text: "I connect the brand people discover with the product they actually use.",
      },
      visual: "touchpoints",
    },
    {
      chapter: "Brand & growth",
      heading: "Email is part of the product",
      body: "I design and maintain **79 transactional email templates** in **Customer.io and Liquid**, from onboarding to cancellation. The work combines visual design with implementation: using real event data, handling missing values and checking how messages render. Email carries the same care as the interface because it is often where people learn what happened and what to do next.",
      visual: "email-render",
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
    "作为 Axel（YC W19）的 Founding Design Engineer，参与团队从 0 到 30M GMV、150K 用户的增长，收入仍在快速增长。我负责产品设计与前端交付，直接提交 PR，同时覆盖品牌、核心广告 campaign 和邮件体验。",
  tags: ["设计工程", "前端 PR 交付", "品牌与增长"],
  coverNotes: [
    { box: [36.5, 15.5, 27.5, 14.5], at: [34, 22.5], title: "一个承诺", text: "标题只说一件事：最低价。紧接着的结果卡片就是证明。" },
    { box: [69.5, 16.5, 19, 19], at: [67.5, 26], title: "像素夜空", text: "月亮、云和山都用像素画成；进入应用后，同一片夜色延续成像素城市。" },
    { box: [32.3, 32.3, 8.2, 10], at: [30.3, 37.3], title: "给 AI 一张脸", text: "美西螈从结果卡片后面探出头；在应用里，回答你的也是它。" },
    { box: [30.7, 37.8, 39.1, 38.6], at: [28.7, 52], title: "注册前先看结果", text: "一张示例结果：航线、时间、票价，边上亮着点阵字 FOUND，先让人看到搜索能找到什么。" },
    { box: [32, 66.3, 36.6, 7.6], at: [28.7, 70.1], title: "省多少，写清楚", text: "票价旁边是划掉的原价，差价单独放进绿色标签。" },
  ],
  metrics: [
    { label: "Axel GMV · 从 0 起步的团队成果", value: "30M" },
    { label: "Axel 用户数 · 从 0 起步的团队成果", value: "150K" },
    { label: "我的主要交付物", value: "PRs" },
    { label: "交易类邮件模板", value: "79" },
  ],
  sections: [
    {
      chapter: "共建 Axel",
      heading: "从产品决策到生产代码的创始岗位",
      body: "自 2025 年 12 月起，我全职担任 Axel 的 **Founding Design Engineer（创始设计工程师）**，直接向 CEO 汇报。我把产品问题从早期探索推进到界面设计、前端实现、测试和工程评审，同时负责品牌与增长创意，让产品内外的体验保持一致。",
      span: {
        stages: ["探索", "设计", "实现", "测试", "上线"],
        total: "一个岗位，从问题到上线",
        rows: [
          { kicker: "产品设计", title: "旅程、预订与会员", text: "用户旅程、交互设计，以及预订和会员体验中的具体细节。", from: 0, to: 1, items: ["用户旅程", "预订", "会员"] },
          { kicker: "前端工程", title: "直接以 PR 交付", text: "生产级 React、可复用组件、响应式布局、交互状态与动效，直接以 PR 交付。", from: 2, to: 4, items: ["React", "状态与动效", "PR"] },
          { kicker: "品牌与广告", title: "从广告到产品", text: "品牌视觉、核心广告 campaign 创意，以及连接广告和产品的落地页。", from: 0, to: 2, items: ["品牌视觉", "广告 campaign", "落地页"] },
          { kicker: "邮件与测试", title: "79 个交易类邮件模板", text: "交易类邮件设计与实现、产品 QA，以及持续的测试迭代。", from: 1, to: 4, items: ["79 个模板", "QA", "Customer.io + Liquid"] },
        ],
      },
    },
    {
      chapter: "共建 Axel",
      heading: "参与从 0 到 30M GMV 的增长",
      body: "Axel 的 GMV 从 **0 增长到 30M**，用户数从 **0 增长到 150K**，收入也在快速增长。我的贡献贯穿用户发现产品、使用产品和接收沟通的过程：产品设计、前端 PR、品牌、广告 campaign 与邮件。我和团队一起把增长目标拆成可以交付、测试和持续改进的具体工作。",
      growth: {
        figures: [
          { value: "150K", label: "用户，从 0 起步" },
          { value: "30M", label: "GMV，从 0 起步" },
          { value: "", label: "收入", note: "快速增长中" },
        ],
        journey: [
          { stage: "发现", work: "品牌、广告 campaign 与落地页" },
          { stage: "搜索与预订", work: "产品设计与前端 PR" },
          { stage: "预订之后", work: "79 个交易类邮件模板" },
        ],
        tag: "团队成果",
      },
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
        variant: "route",
        title: "从产品问题到可评审的改动",
        steps: [
          { id: "problem", label: "明确问题", caption: "用户需求、业务目标和工程约束", kind: "start" },
          { id: "design", label: "设计与原型", caption: "流程、视觉和交互状态", kind: "step" },
          { id: "build", label: "实现与测试", caption: "生产级前端、响应式行为和 QA", kind: "step" },
          { id: "pr", label: "交付 PR", caption: "聚焦的代码改动、预览和评审背景", kind: "end" },
        ],
      },
      figures: [
        {
          src: "/work/axel/search-iphone.webp",
          width: 2000,
          height: 1406,
          alt: "iPhone 上的 Axel：西雅图飞洛杉矶的航班搜索结果",
          caption: "用一句话描述行程，Axel 就去搜机票和酒店的好价。",
          notes: [
            { box: [36.5, 80.8, 27, 11], at: [30.5, 86.3], title: "一句话说行程", text: "“Seattle to LA, Friday morning”：像平时说话一样输入行程。" },
            { box: [36.5, 12.4, 27, 7], at: [30.5, 15.9], title: "先复述一遍", text: "Axel 理解到的行程放在顶部：航线、日期、人数，点铅笔就能改。" },
            { box: [33.5, 21, 33, 9.8], at: [30.5, 25.9], title: "先给结论", text: "每个选项先由美西螈用一句话说理由，再给评级：Great、Good。" },
            { box: [33.5, 40.4, 33, 9.4], at: [30.5, 45.1], title: "省多少，就在预订旁", text: "票价、划掉的原价和差价，紧挨着 Book 按钮。" },
            { box: [36.5, 52.5, 27, 24.5], at: [30.5, 57], title: "取舍直说", text: "第二个选项直接说代价：晚一点，贵一点。" },
          ],
        },
      ],
    },
    {
      chapter: "设计 ⇌ 工程",
      heading: "让设计与工程双向协作",
      body: "我负责连接设计与工程的两个方向。**设计 → 工程：**把设计意图落实为组件、交互状态和可评审的 PR。**工程 → 设计：**把实现反馈、真实数据和技术约束带回设计，调整体验和细节。我与首席工程师共同维护这套协作方式，让设计和实际产品在迭代中保持一致。",
      visual: "loop-diagram",
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
        variant: "charts",
      },
    },
    {
      chapter: "品牌与增长",
      heading: "从广告到产品，保持一致的体验",
      body: "我负责**品牌、视觉体系和核心广告 campaign 创意**，并把同一套视觉方向延续到落地页和产品中，让用户从广告进入产品的过程保持连贯。在产品内部，我也参与预订与会员体验的设计，关注用户如何理解会员价值和节省金额。",
      pullQuote: {
        text: "把用户最初认识的品牌，连接到他们真正使用的产品。",
      },
      visual: "touchpoints",
    },
    {
      chapter: "品牌与增长",
      heading: "邮件也是产品的一部分",
      body: "我在 **Customer.io 和 Liquid** 中设计并维护 **79 个交易类邮件模板**，覆盖从 onboarding 到取消的用户流程。这项工作同时包含视觉与实现：接入真实事件数据、处理缺失值、检查渲染效果。用户经常通过邮件了解发生了什么、下一步该怎么做，因此我用与产品界面相同的标准打磨邮件体验。",
      visual: "email-render",
    },
  ],
};
