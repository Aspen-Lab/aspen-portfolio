import type { Project } from "./work";

/** Holds a run of hanzi whole: a word joiner (U+2060, renders as nothing)
    between every character, so a line never breaks inside it, whether or
    not the component also cuts the copy into words. */
const keep = (run: string) => Array.from(run).join("\u2060");

// Business milestones supplied by Aspen, September 2026. GMV is not ARR;
// no currency or annualization is implied. Attribute growth to the team.
//
// The editorial layout in the one dark system: five numbered sections,
// each one claim in its heading, one or two plain sentences, and one piece
// of Axel's own evidence. No chapters, callouts, pull quotes or bold. Team
// figures live only in the first-screen tiles, each carrying a 'Team
// milestone' tag. Every heading, figure and label is set in ink; the
// accent appears only as a chart's single focus mark.
export const axelProject: Project = {
  slug: "axel",
  // No-break spaces hold the dash to the name and the claim together: a
  // narrow H1 reads "Axel —" / "design that ships", never opens on "—".
  title: "Axel\u00a0— design\u00a0that\u00a0ships",
  // The banded case-study layout (one dark system)
  bands: true,
  client: "Axel · Gordian Software (YC W19)",
  role: "Founding Design Engineer · Full-time",
  period: "Dec 2025 — Present",
  year: "Now",
  date: "ongoing",
  category: "Travel · Fintech",
  layout: "editorial",
  summary:
    "Founding Design Engineer at Axel, reporting to the CEO. I own product design and frontend delivery, from prototype to reviewable PR, and I design the brand, ad creative and email too.",
  tags: ["Design engineering", "Production React", "Brand & email"],
  // The helloaxel.com hero as published in Render's customer story
  // (render.com/customers/axel). Pinned to the top: the frames crop only
  // the dark ground under the mountains.
  cover: "/work/axel-home.webp",
  coverWidth: 2000,
  coverHeight: 1333,
  coverPosition: "50% 0%",
  // helloaxel.com's pink (its FOUND sign): drawn only as a chart's single
  // focus mark, never in headings, figures or labels
  accent: "#ff6f93",
  coverCaption: "helloaxel.com — the landing experience I design and build.",
  // In % of the 16:9 hero, which shows the top 84% of the 3:2 shot.
  coverNotes: [
    { box: [36.5, 15.5, 27.5, 14.5], at: [34, 22.5], title: "One promise", text: "Best price, said once; the sample result below backs it." },
    { box: [69.5, 16.5, 19, 19], at: [67.5, 26], title: "A pixel night", text: "Moon and mountains in square pixels; in the app, the night continues." },
    { box: [32, 66.3, 36.6, 7.6], at: [28.7, 70.1], title: "The saving, stated", text: "Usual fare struck through; the difference gets its own green tag." },
  ],
  status: "live",
  liveUrl: "https://helloaxel.com",
  metrics: [
    { label: "GMV from 0", value: "30M", tag: "Team milestone" },
    { label: "Users from 0", value: "150K", tag: "Team milestone" },
    // Owner, 2026-10-19: revenue is growing fast — no figure given, so none is shown
    { label: "Revenue, growing fast", value: "↑", tag: "Team milestone" },
    { label: "Email templates I design and build", value: "79", viz: "matrix", href: "#s-04" },
  ],
  sections: [
    {
      heading: "My handoff is a pull request",
      body: "From a product problem to production React, I design, build and test the change myself. My PRs carry a working preview, so the team reviews real behavior, not a picture of it.",
      // The PR as the figure: one unbroken lane, no handoff, and its
      // working preview running as Axel's flight card.
      route: {
        meta: "Aspen · Nonstop",
        from: "Problem",
        to: "PR",
        stops: ["Design", "Build", "Test"],
        cargoLabel: "In the PR",
        cargo: ["Reusable components", "Responsive layouts", "Interaction states", "Motion", "Working preview"],
        // The traveller's own words in §02's quote marks: Book turns the
        // request into §04's confirmation
        preview: {
          query: ["“Seattle to LA,", "Friday morning”"],
          booked: ["Your Los Angeles", "flight is booked"],
          book: "Book",
          view: "View trip",
        },
        caption: "One owner from problem to PR: design, build and test. The PR carries reusable components, responsive layouts, interaction states and motion, and a working preview of Axel, Seattle to LA, Friday morning, SEA to LAX, where Book books the flight.",
      },
    },
    {
      heading: "I build the interface travelers talk to",
      body: "On helloaxel.com, I design and build the conversational interface and its motion. Travelers describe a trip in plain language, and Axel searches flight and hotel deals.",
      // Second image of Render's customer story (render.com/customers/axel).
      // Notes are numbered in the traveler's order; they describe the
      // screen, not who wrote the agent's verdicts. Split card: the image
      // cropped 1:1 at its centre beside a black slab of the notes. Boxes
      // are remapped for that crop: x' = (x − 14.85) / 0.703, w' = w / 0.703
      // (y and h unchanged).
      figures: [
        {
          src: "/work/axel/search-iphone.webp",
          width: 2000,
          height: 1406,
          stage: "wide",
          layout: "split",
          aspect: "1 / 1",
          position: "50% 50%",
          kicker: "helloaxel.com · iPhone",
          alt: "Axel on iPhone: flight results for a Seattle to Los Angeles search",
          notes: [
            { box: [30.8, 80.8, 38.4, 11], at: [22.3, 86.3], title: "Ask in a sentence", text: "“Seattle to LA, Friday morning”, typed the way you’d say it." },
            { box: [26.5, 21, 46.9, 9.8], at: [22.3, 25.9], title: "A verdict first", text: "Each option opens with a one-line reason and a rating." },
            { box: [26.5, 40.4, 46.9, 9.4], at: [22.3, 45.1], title: "Savings beside Book", text: "Fare, struck-through usual price and the difference sit next to Book." },
          ],
        },
      ],
    },
    {
      heading: "One pair of hands, from ad to inbox",
      body: "I design Axel’s brand and core ad creative, and carry one visual language through landing pages, the product and email. The last three I also build in code.",
      visual: "surfaces",
    },
    {
      heading: "Built for the data that isn’t there",
      body: "I design and build 79 transactional email templates in Customer.io and Liquid, from onboarding to cancellation. They run on real event data, handle missing values and get render checks.",
      visual: "email-render",
    },
    {
      heading: "AI makes me faster. I still own the result.",
      body: "I prototype and implement with AI coding tools. The code, the experience and the testing stay my responsibility, and I work closely with our lead engineer.",
      // Every word restates the body: what the tools do, what stays mine
      visual: "ownership",
      ownership: {
        tools: { title: "AI coding tools", items: ["Prototype", "Implement"] },
        mine: { title: "Stays mine", items: ["The code", "The experience", "The testing"] },
      },
    },
  ],
};

export const axelProjectCn: Project = {
  ...axelProject,
  // The same hold in Chinese: U+2060 (word joiner, renders as nothing)
  // keeps the claim whole, so a narrow H1 reads "Axel —" / "把设计做到上线"
  // and never strands 把 at a line end.
  title: "Axel\u00a0— 把\u2060设计\u2060做到\u2060上线",
  role: "创始设计工程师 · 全职",
  period: "2025 年 12 月 — 至今",
  category: "旅行 · 金融科技",
  summary:
    "Axel 创始设计工程师，直接向 CEO 汇报。我负责产品设计与前端交付，从原型一路做到可评审的 PR；品牌、广告创意和邮件，也由我设计。",
  tags: ["设计工程", "生产级 React", "品牌与邮件"],
  coverCaption: "helloaxel.com 的落地体验，由我设计并实现。",
  coverNotes: [
    { box: [36.5, 15.5, 27.5, 14.5], at: [34, 22.5], title: "一个承诺", text: "标题只做一个承诺：最低价；下方的示例结果是佐证。" },
    { box: [69.5, 16.5, 19, 19], at: [67.5, 26], title: "像素夜空", text: "月亮和群山用方形像素画成；进入应用，夜色继续延伸。" },
    { box: [32, 66.3, 36.6, 7.6], at: [28.7, 70.1], title: "省多少，写清楚", text: "原价划掉，差价单独放进绿色标签。" },
  ],
  metrics: [
    { label: "GMV 从 0 起", value: "30M", tag: "团队成果" },
    { label: "用户从 0 起", value: "150K", tag: "团队成果" },
    { label: "收入快速增长", value: "↑", tag: "团队成果" },
    { label: "我设计并实现的邮件模板", value: "79", viz: "matrix", href: "#s-04" },
  ],
  sections: [
    {
      heading: "设计的终点是一个 PR",
      body: "从产品问题到生产级 React，设计、实现和测试都由我完成。我的 PR 附带可运行的预览，团队评审的是真实交互，而不是一张图。",
      route: {
        meta: "Aspen · 直飞",
        from: "问题",
        to: "PR",
        stops: ["设计", "实现", "测试"],
        cargoLabel: "PR 里有",
        cargo: ["可复用组件", "响应式布局", "交互状态", "动效", "可运行预览"],
        // The traveller's search stays in English, in the quote marks §02
        // prints it in; Book turns it into Axel's Chinese confirmation
        // (§02's 预订, §04's email)
        preview: {
          query: ["“Seattle to LA,", "Friday morning”"],
          booked: ["你的洛杉矶", "航班已订好"],
          book: "预订",
          view: "查看行程",
        },
        caption: "从问题到 PR，设计、实现和测试由同一个人完成。PR 里有可复用组件、响应式布局、交互状态和动效，还有可运行预览：Axel 的 Seattle to LA, Friday morning，SEA 到 LAX，预订后，航班已订好。",
      },
    },
    {
      heading: "对话式界面，从设计到代码",
      body: "helloaxel.com 的对话式界面和动效，由我设计并实现。旅客像平时说话一样描述行程，Axel 就去搜机票和酒店的好价。",
      figures: [
        {
          src: "/work/axel/search-iphone.webp",
          width: 2000,
          height: 1406,
          stage: "wide",
          layout: "split",
          aspect: "1 / 1",
          position: "50% 50%",
          kicker: "helloaxel.com · iPhone",
          alt: "iPhone 上的 Axel：西雅图飞洛杉矶的航班搜索结果",
          // The same 1:1 crop and remapped boxes as the English figure
          notes: [
            { box: [30.8, 80.8, 38.4, 11], at: [22.3, 86.3], title: "一句话说行程", text: "“Seattle to LA, Friday morning”，像说话一样输入。" },
            { box: [26.5, 21, 46.9, 9.8], at: [22.3, 25.9], title: "先给结论", text: "每个选项先给一句理由和评级。" },
            { box: [26.5, 40.4, 46.9, 9.4], at: [22.3, 45.1], title: "省多少，就在预订旁", text: "票价、划掉的原价和差价，紧挨着 Book 按钮。" },
          ],
        },
      ],
    },
    {
      heading: "从广告到收件箱，同一双手",
      body: `Axel 的品牌和核心广告创意由我设计，同一套${keep("视觉语言")}再延续到落地页、产品和邮件；后三处，我也${keep("亲手写成代码")}。`,
      visual: "surfaces",
    },
    {
      heading: "数据缺失，邮件依然体面",
      body: "我在 Customer.io 和 Liquid 中设计并实现 79 个交易类邮件模板，从注册引导到取消。模板读取真实事件数据，缺值时有兜底，并经过渲染检查。",
      visual: "email-render",
    },
    {
      heading: "AI 提速，责任不外包",
      body: "原型和实现，我都借助 AI 编码工具提速；代码、体验和测试，始终由我负责。我也与首席工程师紧密协作。",
      visual: "ownership",
      ownership: {
        tools: { title: "AI 编码工具", items: ["原型", "实现"] },
        mine: { title: "始终由我负责", items: ["代码", "体验", "测试"] },
      },
    },
  ],
};
