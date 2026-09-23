import styles from "./ExploreScenes.module.css";

type ExploreKind = "ai" | "game" | "design" | "tooling";
type SceneProps = { cn: boolean };

function AiScene({ cn }: SceneProps) {
  return (
    <>
      <g className={styles.guides}>
        <path d="M38 20V239M602 20V239M24 130H617" />
        <path d="M33 20H43M33 239H43M597 20H607M597 239H607" />
      </g>
      <path className={styles.route} d="M169 130H201Q214 130 214 117V61Q214 48 230 48H249M169 130H249M169 130H201Q214 130 214 144V202Q214 216 230 216H249" />
      <path className={styles.route} d="M390 48H412Q427 48 427 64V117Q427 130 441 130H472M390 130H472M390 216H412Q427 216 427 201V144Q427 130 441 130H472" />
      <path className={`${styles.trace} ${styles.aiTrace}`} pathLength="1" d="M169 130H249M390 130H472" />

      <rect className={styles.surface} x="48" y="97" width="122" height="66" rx="7" />
      <path className={styles.stroke} d="M64 119H94M64 129H113M64 139H103" />
      <path className={styles.stroke} d="m138 124 6 6-6 6" />
      <text className={styles.label} x="48" y="187">{cn ? "任务输入" : "Task input"}</text>

      <g>
        <rect className={styles.surface} x="249" y="22" width="142" height="52" rx="7" />
        <text className={styles.tier} x="263" y="52">0</text>
        <path className={styles.line} d="M286 34V62" />
        <text className={styles.nodeTitle} x="301" y="44">{cn ? "规则" : "Rules"}</text>
        <text className={styles.small} x="301" y="60">TF-IDF</text>
      </g>
      <g className={styles.localNode}>
        <rect className={styles.activeSurface} x="249" y="104" width="142" height="52" rx="7" />
        <text className={styles.tier} x="263" y="134">1</text>
        <path className={styles.line} d="M286 116V144" />
        <text className={styles.nodeTitle} x="301" y="126">{cn ? "本地模型" : "Local"}</text>
        <text className={styles.small} x="301" y="142">Ollama</text>
      </g>
      <g>
        <rect className={styles.surface} x="249" y="190" width="142" height="52" rx="7" />
        <text className={styles.tier} x="263" y="220">2</text>
        <path className={styles.line} d="M286 202V230" />
        <text className={styles.nodeTitle} x="301" y="212">{cn ? "云端模型" : "Cloud"}</text>
        <text className={styles.small} x="301" y="228">{cn ? "更复杂的推理" : "deep reasoning"}</text>
      </g>

      <g className={styles.arrive}>
        <rect className={styles.surface} x="472" y="97" width="122" height="66" rx="7" />
        <path className={styles.stroke} d="M488 117H550M488 130H530M488 143H545" />
        <circle className={styles.inkFill} cx="572" cy="141" r="9" />
        <path d="m568 141 3 3 5-6" fill="none" stroke="#1b1b1d" strokeWidth="1.3" />
      </g>
      <text className={styles.label} x="472" y="187">{cn ? "匹配能力，再输出" : "Route → respond"}</text>
      <circle className={styles.routerDot} cx="214" cy="130" r="3" />
    </>
  );
}

function GameScene({ cn }: SceneProps) {
  return (
    <>
      <g className={styles.guides}>
        <path d="M29 47H351M29 98H351M29 149H351M29 200H351M79 28V214M130 28V214M181 28V214M232 28V214M283 28V214M334 28V214" />
      </g>
      <g className={styles.gameTerrain}>
        <path d="M30 200H162V215H30ZM179 145H279V160H179ZM306 191H355V206H306Z" />
        <path d="M39 206H60M70 206H87M112 206H136M189 151H212M232 151H261M316 197H343" />
      </g>
      <path className={styles.jumpGuide} d="M84 170C117 31 213 37 228 116" />
      <path className={`${styles.trace} ${styles.jumpTrace}`} pathLength="1" d="M84 170C117 31 213 37 228 116" />
      <g transform="translate(214 99)">
        <g className={styles.player}>
          <path d="M3 27-2 42H29L24 27" fill="#8e8e89" />
          <rect x="0" y="5" width="26" height="25" rx="8" className={styles.inkFill} />
          <path d="M4 10V0M22 10V0" stroke="#e8e7df" strokeWidth="4" strokeLinecap="round" />
          <path d="M8 15V19M18 15V19" stroke="#1a1a1b" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 41V46M21 41V46" stroke="#cbc9bf" strokeWidth="3" />
        </g>
      </g>
      <ellipse className={styles.landing} cx="227" cy="146" rx="23" ry="3" fill="#eeeee4" fillOpacity=".23" />
      <path className={styles.collider} d="M209 93H246V146H209Z" />
      <text className={styles.label} x="30" y="244">{cn ? "场景 / 碰撞 / 动作" : "Scene / collider / motion"}</text>

      <path className={styles.divider} d="M385 34V226" />
      <text className={styles.label} x="423" y="34">PLAYMAKER / FSM</text>
      <path className={styles.route} d="M458 93H500Q529 93 529 116V129M529 163V190H454V163M454 129V93" />
      <path className={styles.fsmTrace} pathLength="1" d="M458 93H500Q529 93 529 116V129M529 163V190H454V163M454 129V93" />
      <rect className={`${styles.activeSurface} ${styles.gameIdle}`} x="417" y="61" width="79" height="33" rx="16" />
      <rect className={styles.surface} x="501" y="129" width="82" height="34" rx="17" />
      <rect className={`${styles.surface} ${styles.gameJump}`} x="410" y="129" width="81" height="34" rx="17" />
      <text className={styles.stateText} x="456.5" y="82">IDLE</text>
      <text className={styles.stateText} x="542" y="150">RUN</text>
      <text className={styles.stateText} x="450.5" y="150">JUMP</text>
      <path className={styles.stroke} d="m524 119 5 5 5-5m-77 61-5 5 5 5m-8-79 5-5 5 5" />
      <circle className={styles.stateDot} cx="482" cy="77" r="2.5" />
      <text className={styles.small} x="421" y="221">{cn ? "让动作与状态保持一致" : "motion follows state"}</text>
    </>
  );
}

function DesignScene({ cn }: SceneProps) {
  return (
    <>
      <g className={styles.guides}>
        <path d="M40 18V233M110 18V233M180 18V233M250 18V233M320 18V233M24 58H334M24 128H334M24 198H334" />
      </g>
      <path className={styles.controlLine} d="M40 188 110 30M311 72 225 241" />
      <path className={styles.bezierBase} d="M40 188C110 30 225 241 311 72" />
      <path className={`${styles.trace} ${styles.bezier}`} pathLength="1" d="M40 188C110 30 225 241 311 72" />
      <circle className={styles.handle} cx="110" cy="30" r="4.5" />
      <circle className={styles.handle} cx="225" cy="241" r="4.5" />
      <rect className={styles.anchor} x="35.5" y="183.5" width="9" height="9" />
      <rect className={styles.anchor} x="306.5" y="67.5" width="9" height="9" />
      <g className={styles.designCursor}>
        <path d="m314 76 4 22 5-7 8-3Z" className={styles.inkFill} stroke="#171718" strokeWidth="2" />
        <rect x="326" y="103" width="52" height="21" rx="3" className={styles.surface} />
        <text x="334" y="117" className={styles.small}>Aspen</text>
      </g>
      <text className={styles.label} x="40" y="19">{cn ? "贝塞尔曲线" : "Bézier curve"}</text>

      <path className={styles.divider} d="M389 27V236" />
      <text className={styles.label} x="426" y="30">{cn ? "字形 / 布局" : "Type / layout"}</text>
      <g className={styles.typeSpecimen}>
        <text className={styles.serif} x="421" y="129">Ag</text>
        <path className={styles.controlLine} d="M423 68H595M423 130H595" />
        <path className={styles.line} d="M423 63V135M595 63V135" />
        <circle className={styles.handle} cx="423" cy="130" r="2.5" />
        <circle className={styles.handle} cx="595" cy="130" r="2.5" />
        <text className={styles.small} x="602" y="72">cap</text>
        <text className={styles.small} x="602" y="134">base</text>
      </g>
      <g className={styles.layoutSpecimen}>
        <rect className={styles.surface} x="425" y="167" width="63" height="63" rx="4" />
        <rect className={styles.activeSurface} x="498" y="167" width="98" height="26" rx="4" />
        <rect className={styles.surface} x="498" y="203" width="44" height="27" rx="4" />
        <rect className={styles.surface} x="552" y="203" width="44" height="27" rx="4" />
        <path className={styles.stroke} d="M440 184H472M440 192H463M440 200H470M512 180H579" />
        <path className={styles.controlLine} d="M491 167H495M493 164V171M491 230H495M493 226V233" />
      </g>
    </>
  );
}

function ToolingScene({ cn }: SceneProps) {
  return (
    <>
      <path className={styles.route} d="M181 129H222M270 129H286Q301 129 301 112V70Q301 57 317 57H332M270 129H332M270 129H286Q301 129 301 145V188Q301 203 317 203H332M463 57H477Q491 57 491 74V117Q491 130 504 130H521M463 129H521M463 203H477Q491 203 491 189V144Q491 130 504 130H521" />
      <path className={styles.toolingTrace} pathLength="1" d="M181 129H222M270 129H286Q301 129 301 112V70Q301 57 317 57H332M463 57H477Q491 57 491 74V117Q491 130 504 130H521" />

      <g>
        <rect className={styles.surface} x="24" y="67" width="157" height="126" rx="7" />
        <path className={styles.line} d="M24 93H181" />
        <circle cx="38" cy="80" r="2.5" className={styles.dimFill} />
        <circle cx="48" cy="80" r="2.5" className={styles.dimFill} />
        <text className={styles.small} x="66" y="83">CLAUDE.md</text>
        <text className={styles.code} x="40" y="120">{"> context"}</text>
        <path className={styles.stroke} d="M40 139H111M50 151H154M50 163H133M40 175H92" />
        <path className={styles.codeCaret} d="M96 170V179" />
      </g>
      <text className={styles.label} x="24" y="220">{cn ? "编辑器 / 项目上下文" : "Editor / context"}</text>

      <circle className={styles.hub} cx="246" cy="129" r="24" />
      <text className={styles.stateText} x="246" y="134">MCP</text>
      <circle className={styles.hubRing} cx="246" cy="129" r="31" />

      <g className={styles.toolNodes}>
        <rect className={styles.surface} x="332" y="35" width="132" height="44" rx="6" />
        <path className={styles.figmaMark} d="M350 46H357A4 4 0 0 1 357 54H350A4 4 0 0 1 350 46ZM350 54H353V62H350A4 4 0 0 1 350 54ZM350 62H353V66A4 4 0 1 1 350 62ZM357 54A4 4 0 1 1 357 62A4 4 0 1 1 357 54Z" />
        <text className={styles.toolName} x="377" y="62">Figma</text>
        <rect className={styles.surface} x="332" y="107" width="132" height="44" rx="6" />
        <path className={styles.stroke} d="m354 118 10 6v11l-10 6-10-6v-11Zm-10 6 10 6 10-6m-10 6v11" />
        <text className={styles.toolName} x="377" y="134">Unity</text>
        <rect className={styles.surface} x="332" y="181" width="132" height="44" rx="6" />
        <path className={styles.stroke} d="M344 196H364V210H344Zm0 0 10 8 10-8" />
        <text className={styles.toolName} x="377" y="208" fontSize="12">Customer.io</text>
      </g>

      <g className={styles.arrive}>
        <rect className={styles.activeSurface} x="521" y="87" width="96" height="88" rx="6" />
        <path className={styles.line} d="M521 106H617" />
        <path className={styles.stroke} d="M531 97H545M554 97H582" />
        <path className={styles.stroke} d="M539 128V148M550 128V134Q550 139 543 139H539" />
        <circle className={styles.handle} cx="539" cy="126" r="3" />
        <circle className={styles.handle} cx="539" cy="151" r="3" />
        <circle className={styles.handle} cx="550" cy="126" r="3" />
        <path className={styles.stroke} d="M566 125H604M566 135H593M566 145H582" />
        <path className={styles.stroke} d="m590 155 4 4 8-9" />
      </g>
      <text className={styles.label} x="521" y="71">PR / preview</text>
      <text className={styles.small} x="521" y="199">{cn ? "可评审的结果" : "ready to review"}</text>
    </>
  );
}

export function ExploreScene({ kind, cn, playing }: { kind: ExploreKind; cn: boolean; playing: boolean }) {
  return (
    <svg viewBox="0 0 640 260" className={styles.scene} data-playing={playing} aria-hidden="true" focusable="false">
      {kind === "ai" && <AiScene cn={cn} />}
      {kind === "game" && <GameScene cn={cn} />}
      {kind === "design" && <DesignScene cn={cn} />}
      {kind === "tooling" && <ToolingScene cn={cn} />}
    </svg>
  );
}
