import type { Project } from "./work";

// Migrated from Aspen’s original Hyundai case study, preserving its media.
// The source prose says 9 drivers, while its research overview board says 10
// users; omit an unqualified participant count rather than reconcile it by guess.
// The reported +10% is a prototype-study confidence score, not a safety claim.
// The source pipeline labels camera/FER and Tobii integration as future work.
// Product names keep a no-break space ("IONIQ 6", "HDA 2.0"): a wrapped
// title or summary never strands the "6" or "2.0" on a line of its own.
// Banded since the redo: every figure is code-drawn in src/components/hyundai/*; real media only where it is the evidence (study photos, the three prototype videos, the two cabin renders), loaded inside those components.
export const hyundaiProject: Project = {
  slug: "hyundai",
  // The dash rides with the model name, so a wrapped title never opens its
  // second line on "—" (as TikTok Pay KYC does in project-locales.ts)
  title: "Hyundai IONIQ 6 — designing for trust at L2+",
  // The banded layout (Axel, TikTok, Nutra): one dark system, every figure
  // drawn in code by src/components/hyundai/* (`visuals` per section)
  bands: true,
  client: "Hyundai · HATCI Lab",
  role: "HMI Designer",
  period: "Jan — May 2025",
  year: "2025",
  date: "9/17/25",
  category: "Automotive · HMI",
  summary:
    "A sponsored HMI project exploring driver confidence in Hyundai’s HDA 2.0 system. Real-driving research, simulator testing and three interface directions shaped an adaptive instrument cluster for the IONIQ 6.",
  tags: ["HMI design", "Driving research", "Interactive prototyping"],
  // The white cover stays for the home card's data and Up next only; the
  // case hero is the Green UI cluster, drawn in code with HDA active
  cover: "/work/hyundai.png",
  coverWidth: 2060,
  coverHeight: 967,
  coverFit: "contain",
  heroVisual: "hyundai-hero",
  // The Green UI's assistance green (board 34: the speed underline, the
  // CRUISE chip, the lead car and the first distance bar are #26d358). On
  // this page only each figure's single focus mark, never in headings,
  // labels or tints. Inside a redrawn piece of the HMI its own colours apply.
  accent: "#26D358",
  status: "live",
  metrics: [
    { label: "Confidence score vs. original UI · prototype study", value: "+10%", href: "#s-09" },
    { label: "Interface directions tested", value: "3", href: "#s-06" },
    { label: "Test environments · real car & simulator", value: "2", href: "#s-02" },
  ],
  /* Eleven sections in four chapters, each with code-drawn figures that
     explain it. The bodies are the owner's copy; where old sections became
     one, their bodies are joined word for word (the only wording change:
     §09's "charts show" is now "chart shows", one chart for the board).
     The study photos, the three prototype videos and the two cabin
     renders live inside their figures; the measures table moved into
     hyundai-paired. */
  sections: [
    {
      chapter: "Research",
      heading: "Clarity at the handoff",
      body: "How might we help drivers feel more confident when control shifts between the human and Hyundai’s HDA 2.0 system? This sponsored HMI project explored the IONIQ 6 experience in Level 2 and Level 2+ assistance scenarios, focusing on system status, information hierarchy and feedback at critical transitions. The stakeholder map placed Hyundai and the HMI lab alongside drivers, other road users, regulators and groups with different accessibility needs. It helped frame the interface as part of a wider driving experience, with expectations that extend beyond the person looking at the cluster.",
      // The original cluster's HDA off / on / grey (boards 01, 14); the
      // influence × importance map (board 02)
      visuals: ["hyundai-handoff", "hyundai-stakeholders"],
    },
    {
      chapter: "Research",
      heading: "Observe driving in two environments",
      body: "Drivers completed tasks in both a real vehicle and a custom Unreal Engine simulator. The setup combined ECG-based heart-rate variability, Tobii eye tracking and self-report surveys. A steering rig, highway rendering and surround sound allowed the team to explore assistance behavior in a repeatable setting before comparing it with the real-driving experience.",
      // Crops of the study photos (boards 03–05), the rig, the measures and
      // the printed scope; never board 03's unqualified user count
      visuals: ["hyundai-study"],
    },
    {
      chapter: "Research",
      heading: "Combine workload, behavior and feedback",
      body: "The Driving Activity Load Index captured attention, visual and auditory demand, time pressure, interference and situational stress. We considered those responses alongside task observations and biometric data, then organized the feedback into an affinity map. Exploratory comparisons between simulator and car measures informed the next study round.",
      // The DALI rank swap and how a weight is made (boards 06, 07); the
      // exploratory simulator–car correlation for the LKA task (board 08)
      visuals: ["hyundai-workload", "hyundai-correlation"],
    },
    {
      chapter: "Design",
      heading: "Turn research into interface requirements",
      body: "Round 1 surfaced three connected problems: ambiguous activation and status cues, a cluttered visual hierarchy, and too little timely reassurance about what the assistance system was doing. Together, these made handoff moments harder to interpret. The design opportunity was to communicate the right state and the right information at the moment it mattered. The first requirements were concrete: make entry into and exit from HDA visible, distinguish active and interrupted assistance, and keep important feedback readable without obscuring the driving view. These requirements connected each pain point to a behavior the interface could communicate.",
      // Three gaps, each with a quote, its requirement and the original UI
      // as evidence (boards 09, 11–16)
      visuals: ["hyundai-gaps"],
    },
    {
      chapter: "Design",
      heading: "Explore the hierarchy before the visual finish",
      body: "Low-fidelity prototypes separated driving status from secondary information and explored layouts for manual driving, active assistance, lane detection and heavy traffic. Comparing these states side by side made it easier to decide what should stay stable and what should change with the driving mode. The exploration expanded into a family of instrument-cluster states. Layout, vehicle imagery, status treatments and feedback were refined together, so the proposal could communicate changes in assistance rather than only present a polished static view.",
      // The lo-fi cluster in five states (boards 17, 18); the state matrix
      // and how the features compose (board 21)
      visuals: ["hyundai-lofi", "hyundai-matrix"],
    },
    {
      chapter: "Design",
      heading: "Test three directions",
      body: "We developed three interface directions for comparison. White UI established a minimal baseline. Green UI emphasized reassurance and clear assistance feedback. Blue UI explored a more technical, information-focused presentation. The study compared these directions through driving tasks and participant feedback.",
      // White, Green and Blue UI redrawn on one frame (boards 23–25)
      visuals: ["hyundai-directions"],
    },
    {
      chapter: "Validation",
      heading: "Round 2: compare, co-design and refine",
      body: "The second round combined visual UI testing with functional testing in the simulator and car. Whiteboard co-design let participants rearrange information and discuss what they needed in each driving mode. Their feedback pointed toward an adaptive hierarchy: speed mattered more during manual driving, while the vehicle visualization became more important with assistance engaged.",
      // The plan and its criterion, the co-design loop, the mode-dependent
      // hierarchy (boards 26–29)
      visuals: ["hyundai-round2"],
    },
    {
      chapter: "Validation",
      heading: "Make confidence measurable",
      body: "The study used a custom confidence score to bring physiological signals, task timing and self-report data into a common framework. The documentation records how data was prepared, aligned and weighted. The pipeline also separates implemented inputs from planned facial-emotion and eye-tracking extensions, keeping the measurement model open to further development. Paired-sample analysis compared simulator and real-driving measures from the same participants. The analysis considered confidence scores, UX self-reports, pupil size, heart-rate variability and task time, giving the team several perspectives on the experience across environments.",
      // The formula and its pipeline, implemented vs planned (boards 30,
      // 31); the paired comparison with the five measures (board 33)
      visuals: ["hyundai-confidence", "hyundai-paired"],
    },
    {
      chapter: "Validation",
      heading: "Green UI led the prototype comparison",
      body: "The project study reported that Green UI achieved the highest confidence score, with a **10% improvement over the original UI**. The comparison chart shows how the three directions performed for the participants shown. This result guided the final prototype toward clearer assistance states and information that adapts to the driving mode.",
      // Value-true totals for the participants shown, each opened into its
      // task scores (boards 30, 32); no board prints an original-UI score
      visuals: ["hyundai-results"],
      callout: {
        variant: "insight",
        label: "Prototype study",
        title: "+10% confidence score",
        text: "Green UI compared with the original interface in this project’s prototype study.",
      },
    },
    {
      chapter: "Final concept",
      heading: "A clear system of assistance feedback",
      body: "The final Green UI brings together a compact status panel, a central vehicle illustration and a dedicated steering-assistance indicator. Dynamic icons distinguish paused and active states, while lane-keeping and following-distance feedback keep the assistance behavior visible. Information density changes with the driving mode. A shared system brought typography, icons, colors, vehicle illustrations and assistance components into one vocabulary. The component work focused on making the difference between normal operation, active support and a request for driver attention easier to recognize. Three prototype sequences show the Green UI in motion, extending the component system into changes of state and feedback over time.",
      // The final Green UI as a live prototype (boards 21, 22, 34–37,
      // videos 38–40); then the three prototype videos as evidence
      visuals: ["hyundai-cluster", "hyundai-clips"],
    },
    {
      chapter: "Final concept",
      heading: "North Star: bring feedback closer to the driver",
      body: "The North Star concept explored a steering-wheel-mounted display and a fixed central screen within the turning wheel. Sketches and screen studies considered shorter eye travel and more immediate feedback, alongside the challenges of motion, rotating content and cognitive load. This remained a concept for further exploration. The cabin visualizations bring the steering-wheel concept and main display into a wider interior experience. Next steps were to improve simulator–UI integration, create opportunities to learn the assistance system through interaction, and add a more complex cityscape. Further testing with drivers familiar with Hyundai vehicles would help examine the wide variation in feedback observed in this study.",
      // A wheel to turn: wheel-mounted vs fixed screen (boards 42, 44);
      // the two cabin renders (46, 47)
      visuals: ["hyundai-wheel", "hyundai-cabin"],
    },
  ],
};

/* Hyundai in Chinese: the same eleven sections, every claim unchanged.
   bands, accent, the code-drawn hero, the cover and the metrics' links
   come from the English entry; chapters, headings, bodies and the
   callout are restated here, and the figures carry their own Chinese
   words (src/components/hyundai/*, read from the locale). */
export const hyundaiProjectCn: Project = {
  ...hyundaiProject,
  title: "Hyundai IONIQ 6 — 为 L2+ 驾驶辅助建立信心",
  role: "人机界面设计师",
  period: "2025 年 1 月 — 5 月",
  category: "汽车 · 人机交互",
  summary:
    "一个由现代支持的 HMI 项目，探索驾驶者对 HDA 2.0 系统的信心。通过实车研究、模拟器测试与三种界面方向的比较，为 IONIQ 6 设计随驾驶模式调整的信息界面。",
  tags: ["人机界面设计", "驾驶体验研究", "交互原型"],
  metrics: [
    { label: "对比原有界面的信心评分 · 原型研究", value: "+10%", href: "#s-09" },
    { label: "参与测试的界面方向", value: "3", href: "#s-06" },
    { label: "测试环境 · 实车与模拟器", value: "2", href: "#s-02" },
  ],
  sections: [
    {
      chapter: "研究",
      heading: "让控制交接更清晰",
      body: "当控制在驾驶者与现代 HDA 2.0 系统之间切换时，怎样让人更有信心？这个由现代支持的人机界面项目聚焦 IONIQ 6 的 L2 与 L2+ 驾驶辅助场景，研究系统状态、信息层级以及关键交接时刻的反馈。利益相关者地图涵盖现代与 HMI 实验室，也纳入驾驶者、其他道路使用者、监管机构及有不同无障碍需求的人群。它帮助我们把仪表界面放回完整的驾驶体验中，理解那些超出屏幕本身的需求与期待。",
      visuals: ["hyundai-handoff", "hyundai-stakeholders"],
    },
    {
      chapter: "研究",
      heading: "在两种环境中观察驾驶",
      body: "驾驶者分别在实车与基于 Unreal Engine 搭建的模拟器中完成任务。研究结合 ECG 心电与心率变异性、Tobii 眼动追踪及主观问卷。方向盘装置、高速公路场景与环绕声让团队能够在可重复的环境中探索辅助系统的行为，再与实车体验进行比较。",
      visuals: ["hyundai-study"],
    },
    {
      chapter: "研究",
      heading: "结合驾驶负荷、行为与主观反馈",
      body: "驾驶活动负荷指数用于了解注意力投入、视觉与听觉需求、时间压力、干扰及情境压力。我们结合任务观察、生理数据和问卷反馈，通过亲和图梳理共性问题，并对模拟器与实车指标进行探索性比较，为下一轮研究提供依据。",
      visuals: ["hyundai-workload", "hyundai-correlation"],
    },
    {
      chapter: "设计",
      heading: "把研究转化为界面要求",
      body: "第一轮测试呈现出三个相互关联的问题：功能启停与状态提示不够明确、视觉层级混乱，以及缺少对辅助系统当前行为的及时反馈。这些问题让控制交接时刻更难理解。设计机会在于：在关键时刻清晰呈现当前状态与必要信息。最初的设计要求很具体：让 HDA 的进入与退出有明确变化，区分辅助开启与中断状态，并在不遮挡驾驶视图的前提下呈现重要反馈。每项要求都对应研究中发现的痛点，再落实为界面需要传达的状态与行为。",
      visuals: ["hyundai-gaps"],
    },
    {
      chapter: "设计",
      heading: "先探索信息层级，再细化视觉",
      body: "低保真原型把驾驶状态与次要信息分开，探索手动驾驶、辅助开启、车道检测和拥堵交通等场景的布局。把这些状态放在一起比较，让我们更容易判断哪些信息应保持稳定、哪些内容应随驾驶模式变化。探索进一步扩展为一组完整的仪表状态。布局、车辆图示、状态表达与反馈被同步推敲，让方案能够呈现辅助功能的变化，而不只停留在单个静态画面。",
      visuals: ["hyundai-lofi", "hyundai-matrix"],
    },
    {
      chapter: "设计",
      heading: "测试三种设计方向",
      body: "我们设计了三种用于比较的界面方向。白色方案建立极简基线；绿色方案强调安心感与清晰的辅助反馈；蓝色方案探索更偏技术与信息表达的呈现方式。随后通过驾驶任务和参与者反馈比较这三种方案。",
      visuals: ["hyundai-directions"],
    },
    {
      chapter: "验证",
      heading: "第二轮：比较、共创与改进",
      body: "第二轮结合界面视觉测试，以及模拟器与实车中的功能测试。白板共创让参与者重新排列信息，并说明不同驾驶模式下的需求。反馈指向一种自适应的信息层级：手动驾驶时速度信息更重要，辅助功能开启后，车辆状态可视化的作用则更突出。",
      visuals: ["hyundai-round2"],
    },
    {
      chapter: "验证",
      heading: "让信心成为可比较的指标",
      body: "研究使用自定义信心评分，把生理信号、任务耗时与主观反馈纳入共同的分析框架。文档记录了数据整理、时间对齐与权重设置的方法；处理流程也区分已实现的输入，以及计划加入的面部情绪和眼动数据扩展，为后续改进保留空间。团队使用配对样本分析，比较同一参与者在模拟与实车驾驶中的指标。分析涵盖信心评分、体验问卷、瞳孔大小、心率变异性及任务耗时，从多个角度观察两种环境下的体验。",
      visuals: ["hyundai-confidence", "hyundai-paired"],
    },
    {
      chapter: "验证",
      heading: "绿色方案在原型比较中表现最佳",
      body: "项目研究报告显示，绿色方案获得最高信心评分，**相比原有界面提升 10%**。对比图呈现了三种方案在所展示参与者中的表现。这一结果推动最终原型继续强化辅助状态的表达，并让信息随驾驶模式调整。",
      visuals: ["hyundai-results"],
      callout: {
        variant: "insight",
        label: "原型研究",
        title: "信心评分提升 10%",
        text: "绿色方案与本项目原型研究中的原有界面相比。",
      },
    },
    {
      chapter: "最终方案",
      heading: "形成清晰的辅助反馈体系",
      body: "最终绿色界面结合紧凑状态面板、中央车辆图示与独立的转向辅助指示。动态图标区分暂停和开启状态，车道保持与跟车距离反馈则帮助驾驶者理解系统当前行为。信息密度随驾驶模式变化。设计系统把字体、图标、色彩、车辆图示与驾驶辅助组件整合为统一的视觉语言。组件设计重点区分常规运行、辅助开启以及需要驾驶者注意的状态，让这些变化更容易被识别。三个动态原型片段展示绿色界面的运行方式，让组件之间的状态变化与持续反馈变得可见。",
      visuals: ["hyundai-cluster", "hyundai-clips"],
    },
    {
      chapter: "最终方案",
      heading: "远景概念：让反馈更靠近驾驶者",
      body: "远景概念探索将显示屏置于方向盘上，并让中央屏幕在方向盘转动时保持固定。草图与屏幕方案同时考虑缩短视线移动、提供更直接反馈的潜力，以及运动、内容旋转和认知负荷带来的挑战。这是一个仍需继续探索的概念方向。座舱效果图把方向盘概念与主显示屏放进更完整的车内体验。后续方向包括加强模拟器与界面的联动，让驾驶者通过交互理解辅助系统，并加入更复杂的城市场景；同时继续邀请熟悉现代车辆的驾驶者参与测试，研究此次反馈中出现的较大差异。",
      visuals: ["hyundai-wheel", "hyundai-cabin"],
    },
  ],
};
