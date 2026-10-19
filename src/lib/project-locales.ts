import { projects, type Project } from "./work";
import { axelProjectCn } from "./axel";
import { hyundaiProjectCn } from "./hyundai";

/** An English entry from work.ts, for the cases whose source lives inline
    there: the translation spreads it, so the cover, layout fields and
    numbers stay in one place and only the words are restated here. */
function english(slug: string): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`project-locales: no "${slug}" in work.ts`);
  return project;
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
  role: "产品设计实习生",
  period: "2025 年 6 月 — 9 月",
  category: "金融科技",
  summary:
    "为 TikTok Pay、Shop、Live 设计覆盖越南、马来西亚、印尼和美国的 KYC 流程。越南新用户完成率 70% → 90%，供应商对接 SOP 将集成周期缩短约 40%。",
  tags: ["金融科技", "合规", "多市场", "设计系统"],
  metrics: [
    { label: "越南 KYC 完成率", value: "70 → 90%" },
    { label: "供应商集成周期", value: "−40%" },
    { label: "已上线市场", value: "VN · MY · ID · US" },
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
          { icon: "globe", label: "4 套监管框架", text: "SBV · BNM · OJK · FinCEN：同一道关口，各有各的规则。" },
        ],
        columns: 3,
      },
      callout: {
        variant: "insight",
        label: "为什么设计在这里有杠杆",
        text: "KYC 位于**漏斗的最前端**。在 4 个市场把完成率提升 10 个百分点，累积起来就是数亿规模的支付量。正是在这个位置，一名设计师 × 一名工程师就能撬动整条业务曲线。",
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
      body: "**UX · 合规 · UI**：三种不同的失效，三种不同的解法，任何一层都无法单独解决。",
      layers: [
        {
          label: "UX",
          problem:
            "复用历史身份信息的用户，一旦系统找不到他们的证件就无路可退，流程由此分叉，变成无声的流失。",
          approach:
            "“Not My ID”逃生通道 + 目标梯度式的进度提示，用户始终知道自己走到了哪一步。",
        },
        {
          label: "合规",
          problem:
            "OCR 字段在 MY ↔ VN 之间不一致，用户只能手动重新填写，而这种不一致本身就是监管风险。",
          approach:
            "与法务 + 风控共同制定标准化字段规范，在全部四个市场与监管要求对齐。",
        },
        {
          label: "UI",
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
      body: "每一次 KYC 改动，都必须同时满足*这三方*。",
      iconList: {
        items: [
          { icon: "briefcase", label: "业务", text: "提升完成率，释放各市场的支付量。" },
          { icon: "user", label: "用户", text: "开通体验更简单、更清晰、更值得信任。" },
          { icon: "layers", label: "设计", text: "一套能容纳众多 SDK 而不散架的框架。" },
        ],
        columns: 3,
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
      iconList: {
        items: [
          { icon: "workflow", label: "工作流程", text: "按 SDK 供应商划分阶段、负责人和验收关口。" },
          { icon: "check", label: "验收", text: "检查清单关联 OCR 映射 + UI 模板 + 中止状态。" },
          { icon: "spark", label: "交付", text: "UI token、组件库、各国变体规则。" },
        ],
        columns: 3,
      },
      pullQuote: {
        text: "跨市场的扩展能力，不再取决于当时是谁在值班。",
        attribution: "SOP 带来的改变",
      },
    },
    {
      chapter: "成果",
      heading: "结果",
      body: "上线了什么，留下了什么。",
      statGrid: {
        items: [
          { value: "70 → 90%", label: "越南新用户 KYC", icon: "gauge", hint: "越南完成率提升。" },
          { value: "−40%", label: "供应商周期", icon: "arrow-up-right", hint: "新 SDK 接入更快。" },
          { value: "4", label: "已上线市场", icon: "globe", hint: "VN · MY · ID · US" },
          { value: "1", label: "OCR 字段体系", icon: "shield", hint: "与法务 + 风控共同制定。" },
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

const chineseProjects: Record<string, Project> = {
  axel: axelProjectCn,
  tiktok: tiktokProjectCn,
  hyundai: hyundaiProjectCn,
};

export function localizeProject(project: Project, locale: string): Project {
  return locale === "cn" ? chineseProjects[project.slug] ?? project : project;
}
