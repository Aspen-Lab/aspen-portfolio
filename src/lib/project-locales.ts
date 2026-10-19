import { projects, type Project } from "./work";
import { axelProjectCn } from "./axel";
import { hyundaiProjectCn } from "./hyundai";
import cnMessages from "../../messages/cn.json";

/** An English entry from work.ts, for the cases whose source lives inline
    there: the translation spreads it, so the cover, layout fields and
    numbers stay in one place and only the words are restated here. */
function english(slug: string): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`project-locales: no "${slug}" in work.ts`);
  return project;
}

type CardCopy = Pick<Project, "title" | "role" | "category" | "summary">;

/* The home page's Chinese card for each case (messages/cn.json). */
const cards: Record<string, CardCopy | undefined> = cnMessages.SelectedWork.projects;

/** A case's name, role, category and summary as its home card says them,
    so the card and the page can never drift apart. A no-break space holds
    the title's dash to the name: a wrapped title never opens on "—". */
function card(slug: string): CardCopy | undefined {
  const copy = cards[slug];
  return copy && { ...copy, title: copy.title.replace(" — ", "\u00a0— ") };
}

type SectionCopy = { heading: string; body: string };

/** A case's English sections in Chinese, matched by English heading:
    images, carousels and their ratios carry over untouched. A section
    added in English and not restated here stays English, never vanishes. */
function restate(
  slug: string,
  chapters: Record<string, string>,
  copy: Record<string, SectionCopy>,
): Project["sections"] {
  return english(slug).sections?.map((s) => ({
    ...s,
    ...copy[s.heading],
    chapter: s.chapter && (chapters[s.chapter] ?? s.chapter),
  }));
}

/* TikTok Pay KYC in Chinese: a straight translation of the English case,
   every figure unchanged. Title, role, category and summary match the
   home page's card (messages/cn.json). Product names (TikTok Pay · Shop ·
   Live), the "Not My ID" control, regulators and market codes stay as
   they appear in the product. */
export const tiktokProjectCn: Project = {
  ...english("tiktok"),
  // A no-break space holds the dash to "KYC": a wrapped title never opens
  // its second line on "—"
  title: "TikTok Pay KYC\u00a0— 多市场规模化",
  titleAccent: "多市场规模化",
  role: "产品设计实习生",
  period: "2025 年 6 月 — 9 月",
  category: "金融科技",
  summary:
    "为 TikTok Pay、Shop、Live 设计覆盖越南、马来西亚、印尼和美国的 KYC 流程。越南新用户完成率 70% → 90%，供应商对接 SOP 将集成周期缩短约 40%。",
  tags: ["金融科技", "合规", "多市场", "设计系统"],
  // bands, accent and accentDeep come from the English entry; metrics and
  // sections are restated in full, so every new section field is set here too
  metrics: [
    { label: "越南 KYC 完成率", value: "70 → 90%", accent: true, href: "#s-06" },
    { label: "供应商集成周期", value: "−40%", accent: true, href: "#s-07" },
    { label: "已上线市场", value: "VN · MY · ID · US", viz: "codes", href: "#s-02" },
  ],
  sections: [
    {
      chapter: "背景",
      heading: "KYC 是什么",
      body: "任何支付开始之前都必须通过的**监管关口**。流程出了故障，用户会流失；尺度一旦放松，流失的就是*监管方*。",
      iconList: {
        items: [
          { icon: "id", label: "身份验证", text: "本地证件 + 自拍 + 活体检测，各市场分别适配。" },
          { icon: "lock", label: "合规约定", text: "每个监管方都会审查流程、数据和 SDK。" },
          { icon: "globe", label: "4 套监管框架", text: "SBV · BNM · OJK · FinCEN：同一道关口，各有各的规则。", chips: ["SBV", "BNM", "OJK", "FinCEN"] },
        ],
        columns: 3,
        variant: "tiles",
      },
      callout: {
        variant: "insight",
        label: "为什么设计在这里有杠杆",
        title: "KYC 位于漏斗的最前端。",
        accent: "漏斗的最前端",
        text: "在 4 个市场把完成率提升 10 个百分点，累积起来就是数亿规模的支付量。正是在这个位置，一名设计师 × 一名工程师就能撬动整条业务曲线。",
      },
      pullQuote: {
        text: "KYC 一出故障，用户就会流失；KYC 一旦宽松，流失的就是监管方。",
        attribution: "一句话说清设计约束",
      },
    },
    {
      chapter: "背景",
      heading: "工作落在了哪里",
      body: "四个市场，一套设计系统，TikTok Pay · Shop · Live 贯穿其中。",
      marketsHub: "一套设计系统",
      markets: [
        { code: "VN", name: "越南", regulator: "SBV", scope: "Pay · Shop · Live" },
        { code: "MY", name: "马来西亚", regulator: "BNM", scope: "Pay · Shop" },
        { code: "ID", name: "印度尼西亚", regulator: "OJK", scope: "Pay · Shop" },
        { code: "US", name: "美国", regulator: "BSA · FinCEN · CIP", scope: "Pay · Shop · Live" },
      ],
    },
    {
      chapter: "策略",
      heading: "问题的三个层面",
      band: "light",
      headingAccent: "三个层面",
      body: "**UX · 合规 · UI**：三种不同的失效，三种不同的解法，任何一层都无法单独解决。",
      layers: [
        {
          label: "UX",
          title: "“Not My ID”逃生通道",
          problem:
            "复用历史身份信息的用户，一旦系统找不到他们的证件就无路可退，流程由此分叉，变成无声的流失。",
          approach:
            "“Not My ID”逃生通道 + 目标梯度式的进度提示，用户始终知道自己走到了哪一步。",
        },
        {
          label: "合规",
          title: "标准化字段规范",
          problem:
            "OCR 字段在 MY ↔ VN 之间不一致，用户只能手动重新填写，而这种不一致本身就是监管风险。",
          approach:
            "与法务 + 风控共同制定标准化字段规范，在全部四个市场与监管要求对齐。",
        },
        {
          label: "UI",
          title: "SDK-AAI 样式对齐",
          problem:
            "供应商 SDK 的字体、圆角、图标和报错样式各不相同，流程一交到供应商界面，信任感随之崩塌。",
          approach:
            "SDK-AAI 样式对齐 + 可复用模板 + 二次 UI 封装，干净地派生出各国版本。",
        },
      ],
    },
    {
      chapter: "策略",
      heading: "三类受众，一条流程",
      band: "light",
      body: "每一次 KYC 改动，都必须同时满足*这三方*。",
      iconList: {
        items: [
          { icon: "briefcase", label: "业务", text: "提升完成率，释放各市场的支付量。" },
          { icon: "user", label: "用户", text: "开通体验更简单、更清晰、更值得信任。" },
          { icon: "layers", label: "设计", text: "一套能容纳众多 SDK 而不散架的框架。" },
        ],
        columns: 3,
        variant: "joined",
        joinLabel: "一条流程",
      },
    },
    {
      chapter: "执行",
      heading: "带逃生通道的流程",
      body: "大多数流程只为顺利的路径而设计。KYC 的失败方式是**无声的分叉**：用户无法继续，却不知道原因。我们把这条备选路线做成了流程中正式的一步。",
      userFlow: {
        title: "越南 KYC · v2 · 含“Not My ID”逃生通道",
        steps: [
          { id: "s1", label: "打开 TikTok Pay", caption: "入口 · 预填历史身份", kind: "start" },
          { id: "s2", label: "选择证件类型", caption: "身份证 · 护照 · 驾照", kind: "step" },
          { id: "s3", label: "验证身份", caption: "OCR + 活体检测", kind: "decision" },
          { id: "s4", label: "确认匹配", caption: "目标梯度 · 已完成 3/4", kind: "step" },
          { id: "s5", label: "KYC 通过", caption: "Pay 已解锁", kind: "end" },
        ],
        branches: [
          {
            fromId: "s3",
            label: "Not My ID",
            destination: "手动重新填写",
            caption: "把备选路线摆到明处，流失从 30% 降到约 10%。",
          },
        ],
      },
      callout: {
        variant: "tip",
        label: "目标梯度假说",
        text: "当用户看到*自己离完成有多近*，完成率就会上升。我们明确地把进度标为 **3/4**，并让最后一步看起来永远是最小的一步。",
      },
    },
    {
      chapter: "执行",
      heading: "各市场的完成率",
      body: "越南是试点。落地之后，同一套模式（逃生通道 + 目标梯度 + 标准化 OCR）移植到了马来西亚、印尼和美国。",
      chart: {
        type: "funnel",
        layout: "split",
        title: "KYC 漏斗 · 越南 · v1 → v2",
        data: [
          { label: "打开 KYC", value: 100, display: "100%" },
          { label: "上传证件", value: 92, display: "92%" },
          { label: "通过 OCR", value: 88, display: "88%", caption: "OCR 字段体系标准化 · MY/VN 对齐" },
          { label: "活体检测", value: 90, display: "90%" },
          // "提升" marks this column as the chart's focus (Chart's pickFocus)
          { label: "审核通过", value: 90, display: "90%", caption: "较 v1 的 70% 提升：“Not My ID” + 进度提示。" },
        ],
      },
    },
    {
      chapter: "执行",
      heading: "供应商对接 SOP",
      body: "TikTok PIPO 的第一份标准化 SOP，涵盖工作流程、验收标准和 UI 交付优先级。这是我最自豪的产出。",
      visual: "sop",
      iconList: {
        items: [
          { icon: "workflow", label: "工作流程", text: "按 SDK 供应商划分阶段、负责人和验收关口。" },
          { icon: "check", label: "验收", text: "检查清单关联 OCR 映射 + UI 模板 + 中止状态。" },
          { icon: "spark", label: "交付", text: "UI token、组件库、各国变体规则。" },
        ],
        columns: 3,
      },
      sop: {
        checks: ["OCR 映射", "UI 模板", "中止状态"],
        codes: ["VN", "MY", "ID", "US"],
        cycle: { label: "供应商集成周期", value: "−40%", cut: 40, before: "之前", after: "有了 SOP" },
      },
      pullQuote: {
        text: "跨市场的扩展能力，不再取决于当时是谁在值班。",
        attribution: "SOP 带来的改变",
      },
    },
    {
      chapter: "成果",
      heading: "上线了什么，留下了什么。",
      headingAccent: "留下了什么",
      body: "",
      statGrid: {
        items: [
          { value: "70 → 90%", label: "越南新用户 KYC", icon: "gauge", hint: "越南完成率提升。", href: "#s-06" },
          { value: "−40%", label: "供应商周期", icon: "arrow-up-right", hint: "新 SDK 接入更快。", href: "#s-07" },
          { value: "4", label: "已上线市场", icon: "globe", hint: "VN · MY · ID · US", href: "#s-02" },
          { value: "1", label: "OCR 字段体系", icon: "shield", hint: "与法务 + 风控共同制定。", href: "#s-03" },
        ],
        cols: 4,
      },
    },
    {
      chapter: "成果",
      heading: "反思",
      body: "合规优先的 UX 是一门**独立的学问**：监管的语言和人的语言互不妥协。正确的答案与其说是修好某一条流程，不如说是让 SDK 体系变得*模块化、可配置、数据驱动*。",
    },
  ],
};

/* Nutra in Chinese: the English case restated section by section, every
   claim and figure unchanged. "Nut" stays the mascot's name. */
export const nutraProjectCn: Project = {
  ...english("nutra"),
  ...card("nutra"),
  client: "Aspen Lab · 自主发起",
  period: "2024 年 8 月",
  tags: ["金融科技", "游戏化", "UX 研究"],
  metrics: [
    { label: "自评动机提升", value: "+85%" },
    { label: "可用性正面反馈", value: "90%" },
    { label: "设计系统覆盖范围", value: "端到端" },
  ],
  sections: restate(
    "nutra",
    { Discovery: "探索", Strategy: "策略", Process: "过程", Execution: "执行", Outcome: "成果" },
    {
      Problem: {
        heading: "问题",
        body: "预算管理很重要，却也很难，对刚入门的人尤其如此。大多数 App 让人不知所措，因为它们是为高度自律的人打造的。最需要帮助的人，那些想存钱却难以坚持的人，往往最先悄悄放弃。",
      },
      Research: {
        heading: "研究",
        body: "我们对自认动力不足、自律性较低的用户做了问卷和深度访谈，得到三条洞察：简单直观的交互能减轻压迫感；游戏化机制能显著提升参与度；细小而个性化的提醒能帮人坚持下去。我们面对的是一个庞大却未被充分服务的群体，他们最大的敌人是摩擦。",
      },
      "Mental model & journey": {
        heading: "心智模型与用户旅程",
        body: "我们梳理了目标用户如何看待金钱，把存钱的认知成本，与被告知“存得不够”时的情绪成本区分开来。用户旅程图让摩擦点清晰可见。",
      },
      "Market opportunity": {
        heading: "市场机会",
        body: "主流预算 App 过度偏向自律的重度用户。Nutra 瞄准的是规模大得多、缺乏动力的中间人群：他们本来就想存钱，但没有反馈循环，注意力就难以持续。",
      },
      "Design objectives": {
        heading: "设计目标",
        body: "降低入门门槛：尽量减少认知负担，让新手引导顺畅无阻。用每日存钱挑战、互动奖励和有趣的小仪式提升参与度。根据每个人的消费习惯和目标，个性化任务与建议。",
      },
      "Why gamification": {
        heading: "为什么是游戏化",
        body: "预算一旦变成苦差事就会失败。游戏化让循环变得短、看得见、有回报，把自律变成习惯，并让长期留存提升几个数量级。",
      },
      'Why "Nut"': {
        heading: "为什么是“Nut”",
        body: "我们选择 Nut（坚果）作为虚拟助手，因为它象征成长、储蓄与潜力：一个小小的东西，会长成更大的样子。这个隐喻让理财上的进步变得可感知、平易近人、友好亲切。",
      },
      Ideation: {
        heading: "构思",
        body: "两条并行的流程：仪表盘探索（钱现在流向哪里）和目标设定（钱应该流向哪里）。画了几十种变体，寻找最小可行的交互循环。",
      },
      "First user test": {
        heading: "第一轮用户测试",
        body: "在任何视觉投入之前，先用可点击的低保真原型和目标用户一起测试，验证底层的 UX 骨架。",
      },
      Refinement: {
        heading: "迭代",
        body: "第一轮测试暴露的摩擦点：目标流程一开始就要求填写太多，仪表盘把下一步操作埋得太深。我们重写了新手引导的顺序，并把每日挑战放到最显眼的位置。",
      },
      "Lo-fi summary": {
        heading: "低保真小结",
        body: "最终的低保真结构：仪表盘、每日挑战、目标设定、Nut 助手、财务概览。这个结构站稳之后，品牌层才能叠加上去。",
      },
      "User journey, after": {
        heading: "测试后的用户旅程",
        body: "测试之后，旅程大幅收拢：从意图到反馈之间的页面更少，死胡同更少，从打开 App 到存下钱，路径清晰。",
      },
      "Mid-fi & branding": {
        heading: "中保真与品牌",
        body: "结构站稳之后，再叠加品牌语气。Nut 有了自己的性格。色彩和动效保持克制，让趣味显得温暖，而不吵闹。",
      },
      Mockup: {
        heading: "效果图",
        body: "发布页的主视觉构图：Nut、仪表盘、每日挑战，一眼就能全部看到。",
      },
      "Branding 2.0": {
        heading: "品牌 2.0",
        body: "视觉识别的第二轮打磨。收紧了吉祥物的比例，确定了色彩系统，并为 Nut 做了一小套富有表现力的情绪状态。",
      },
      "Hi-fi user flow": {
        heading: "高保真用户流程",
        body: "高保真原型的端到端流程，覆盖新手引导、目标设定、每日打卡和财务概览。",
      },
      "What shipped": {
        heading: "最终交付",
        body: "目标设定（个性化、可执行的小步骤）。基于用户消费习惯的每日挑战。Nut 助手，提供视觉奖励和情绪反馈。清晰的财务概览，用诚实的数据可视化呈现习惯、预算与进展。一套完整的设计系统，让各个界面保持一致。",
      },
      "Design system": {
        heading: "设计系统",
        body: "一套完整的规范，让各个界面在视觉和交互上保持一致：色彩、字体、组件、动效 token，以及把 Nut 作为系统基础元素的使用规则。",
      },
      Validation: {
        heading: "验证",
        body: "与目标用户进行的多轮可用性测试打磨了交互。结果是：游戏化带来了更强的留存；曾被强调自律的 App 劝退的用户，存钱行为有了可观察到的改善；反馈也压倒性地正面。",
      },
      Reflection: {
        heading: "反思",
        body: "设计 Nutra 让我更深入地理解了行为心理学，以及游戏化究竟如何作用于动机。它锻炼了我在 UX 研究、迭代原型和视觉系统上的能力，也让我看到：用心加上趣味，可以做出既有效又让人愉快的产品。",
      },
    },
  ),
};

/* Field of Vision in Chinese: the short version, until the full case is
   published. Award names stay as the awards write them. */
export const coneProjectCn: Project = {
  ...english("cone"),
  ...card("cone"),
  tags: ["无障碍", "可穿戴设备", "服务设计"],
  sections: restate("cone", {}, {
    Status: {
      heading: "项目状态",
      body: "详细案例即将发布。Field of Vision（暂定名：Cone Walk Safe）是一套为视障行人设计的导航辅助系统，于 2025 年同时获得 iF Design Award 与 Red Dot Design Award。如果你想现在就深入了解它的设计与研究，欢迎联系我。",
    },
  }),
};

const chineseProjects: Record<string, Project> = {
  axel: axelProjectCn,
  nutra: nutraProjectCn,
  tiktok: tiktokProjectCn,
  hyundai: hyundaiProjectCn,
  cone: coneProjectCn,
};

export function localizeProject(project: Project, locale: string): Project {
  if (locale !== "cn") return project;
  const full = chineseProjects[project.slug];
  if (full) return full;
  // A case not yet restated keeps its English sections, but its title,
  // role, category and summary come from its Chinese home card
  const words = card(project.slug);
  return words ? { ...project, ...words } : project;
}
