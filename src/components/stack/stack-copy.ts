import type { StackIcon } from "@/lib/work";

type Copy = {
  label: string;
  note: string;
  linkLabel?: string;
};

// Key copy by discipline so display order never changes its meaning.
export const STACK_CN: Record<StackIcon, Copy> = {
  design: { label: "设计", note: "每个项目开始的地方，Figma 是我的工作台。" },
  frontend: { label: "前端 · 日常主力", note: "helloaxel.com、Lumen、这个作品集与 Pado。", linkLabel: "看 Lumen" },
  email: { label: "邮件工程", note: "Axel 的 28 个交易类邮件模板，从入门引导到取消服务。" },
  backend: { label: "后端与数据", note: "Peer 开源论文晨报与 Pado。", linkLabel: "看 Peer" },
  ai: { label: "AI · 三层架构", note: "按任务匹配规则、本地模型与云端模型。", linkLabel: "Peer 管线" },
  game: { label: "游戏", note: "和 Skyler 一起制作 2D Metroidvania，每天投入 1–2 小时。" },
  tooling: { label: "工具链", note: "项目上下文、MCP 连接与可评审的 Vercel 预览。" },
};

export const TOOL_ROLES: Record<StackIcon, { en: string[]; cn: string[] }> = {
  design: {
    en: ["Interfaces, prototypes & shared context", "Interactive websites", "3D form & material studies", "Visual assets & finishing"],
    cn: ["界面、原型与共享设计上下文", "交互网站", "三维形态与材质研究", "视觉素材与后期"],
  },
  frontend: {
    en: ["Routes, rendering & page structure", "Typed, reusable UI", "Responsive styling", "Interaction & transitions", "Code highlighting & interface icons"],
    cn: ["路由、渲染与页面结构", "有类型的可复用界面", "响应式样式", "交互与过渡", "代码高亮与界面图标"],
  },
  email: {
    en: ["Event-driven delivery", "Personalized content", "Show only the data that exists", "Layouts that survive email clients"],
    cn: ["事件驱动的发送流程", "个性化内容", "只展示真实存在的数据", "适配邮件客户端的布局"],
  },
  backend: {
    en: ["Concurrent collection & processing", "Local storage & configuration", "Repeatable service environments", "Product data & persistence"],
    cn: ["并发采集与处理", "本地存储与配置", "可复现的服务环境", "产品数据与持久化"],
  },
  ai: {
    en: ["Cloud model integration", "Cloud model integration", "On-device inference", "Deterministic relevance scoring"],
    cn: ["云端模型接入", "云端模型接入", "设备端推理", "确定性的相关性评分"],
  },
  game: {
    en: ["Scenes, collisions & gameplay", "Explicit states & transitions", "2D movement & combat references"],
    cn: ["场景、碰撞与玩法", "明确的状态与切换", "二维移动与战斗参考"],
  },
  tooling: {
    en: ["Implementation in the editor", "Repository-aware build workflows", "Connected game-development tools", "Connected email workflows", "Presentation generation"],
    cn: ["编辑器内的实现工作", "结合仓库上下文的构建流程", "连接游戏开发工具", "连接邮件工作流", "演示文稿生成"],
  },
};
