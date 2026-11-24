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
      <path className={styles.route} d="M169 130H197Q208 130 208 117V61Q208 48 222 48H236M169 130H236M169 130H197Q208 130 208 144V202Q208 216 222 216H236" />
      <path className={styles.route} d="M404 48H420Q433 48 433 64V117Q433 130 446 130H472M404 130H472M404 216H420Q433 216 433 201V144Q433 130 446 130H472" />
      <path className={`${styles.trace} ${styles.aiTrace}`} pathLength="1" d="M169 130H236M404 130H472" />

      <rect className={styles.surface} x="48" y="97" width="122" height="66" rx="7" />
      <path className={styles.stroke} d="M64 119H94M64 129H113M64 139H103" />
      <path className={styles.stroke} d="m138 124 6 6-6 6" />
      <text className={styles.label} x="48" y="190">{cn ? "任务输入" : "Task input"}</text>

      <g>
        <rect className={styles.surface} x="236" y="18" width="168" height="60" rx="7" />
        <text className={styles.tier} x="250" y="55">0</text>
        <path className={styles.line} d="M273 32V64" />
        <text className={styles.nodeTitle} x="287" y="43">{cn ? "规则" : "Rules"}</text>
        <text className={styles.small} x="287" y="64">TF-IDF</text>
      </g>
      <g className={`${styles.localNode} ${styles.chosenGroup}`}>
        <rect className={styles.chosen} x="236" y="100" width="168" height="60" rx="7" />
        <text className={styles.tier} x="250" y="137">1</text>
        <path className={styles.line} d="M273 114V146" />
        <text className={styles.nodeTitle} x="287" y="125">{cn ? "本地模型" : "Local"}</text>
        <text className={styles.small} x="287" y="146">Ollama</text>
      </g>
      <g>
        <rect className={styles.surface} x="236" y="182" width="168" height="60" rx="7" />
        <text className={styles.tier} x="250" y="219">2</text>
        <path className={styles.line} d="M273 196V228" />
        <text className={styles.nodeTitle} x="287" y="207">{cn ? "云端模型" : "Cloud"}</text>
        <text className={styles.small} x="287" y="228">{cn ? "更复杂的推理" : "deep reasoning"}</text>
      </g>

      <g className={styles.arrive}>
        <rect className={styles.surface} x="472" y="97" width="122" height="66" rx="7" />
        <path className={styles.stroke} d="M488 117H550M488 130H530M488 143H545" />
        <circle className={styles.inkFill} cx="572" cy="141" r="9" />
        <path d="m568 141 3 3 5-6" fill="none" stroke="#0f0f0f" strokeWidth="1.3" />
      </g>
      <text className={styles.label} x="472" y="190">{cn ? "匹配能力，再输出" : "Route → respond"}</text>
      <circle className={styles.routerDot} cx="208" cy="130" r="3" />
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
          <path d="M3 27-2 42H29L24 27" fill="#8c8c8c" />
          <rect x="0" y="5" width="26" height="25" rx="8" className={styles.inkFill} />
          <path d="M4 10V0M22 10V0" stroke="#f3f3f3" strokeWidth="4" strokeLinecap="round" />
          <path d="M8 15V19M18 15V19" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 41V46M21 41V46" stroke="#8c8c8c" strokeWidth="3" />
        </g>
      </g>
      <ellipse className={styles.landing} cx="227" cy="146" rx="23" ry="3" fill="#1c1c1c" />
      <path className={styles.collider} d="M209 93H246V146H209Z" />
      <text className={styles.label} x="30" y="246">{cn ? "场景 / 碰撞 / 动作" : "Scene / collider / motion"}</text>

      <path className={styles.divider} d="M385 34V226" />
      <text className={styles.label} x="417" y="36">PlayMaker / FSM</text>
      <path className={styles.route} d="M458 93H500Q529 93 529 116V129M529 163V190H454V163M454 129V93" />
      <path className={styles.fsmTrace} pathLength="1" d="M458 93H500Q529 93 529 116V129M529 163V190H454V163M454 129V93" />
      <rect className={styles.gameIdle} x="417" y="61" width="79" height="33" rx="16" />
      <rect className={styles.surface} x="501" y="129" width="82" height="34" rx="17" />
      <rect className={styles.gameJump} x="410" y="129" width="81" height="34" rx="17" />
      <text className={`${styles.stateText} ${styles.idleText}`} x="456.5" y="82">IDLE</text>
      <text className={styles.stateText} x="542" y="150">RUN</text>
      <text className={`${styles.stateText} ${styles.jumpText}`} x="450.5" y="150">JUMP</text>
      <path className={styles.stroke} d="m524 119 5 5 5-5m-77 61-5 5 5 5m-8-79 5-5 5 5" />
      <circle className={styles.stateDot} cx="482" cy="77" r="2.5" />
      <text className={styles.small} x="417" y="224">{cn ? "让动作与状态保持一致" : "motion follows state"}</text>
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
        <path d="m314 76 4 22 5-7 8-3Z" className={styles.inkFill} stroke="#0f0f0f" strokeWidth="2" />
        <rect x="326" y="102" width="62" height="26" rx="4" className={styles.surface} />
        <text x="335" y="120" className={styles.small}>Aspen</text>
      </g>
      <text className={styles.label} x="40" y="14">{cn ? "贝塞尔曲线" : "Bézier curve"}</text>

      <path className={styles.divider} d="M389 27V236" />
      <text className={styles.label} x="423" y="30">{cn ? "字形 / 布局" : "Type / layout"}</text>
      <g className={styles.typeSpecimen}>
        <text className={styles.serif} x="421" y="129">Ag</text>
        <path className={styles.controlLine} d="M423 68H586M423 130H586" />
        <path className={styles.stroke} d="M423 63V135M586 63V135" />
        <circle className={styles.handle} cx="423" cy="130" r="2.5" />
        <circle className={styles.handle} cx="586" cy="130" r="2.5" />
        <text className={styles.small} x="594" y="73">cap</text>
        <text className={styles.small} x="594" y="135">base</text>
      </g>
      <g className={styles.layoutSpecimen}>
        <rect className={styles.surface} x="425" y="167" width="63" height="63" rx="4" />
        <rect className={styles.chosen} x="498" y="167" width="98" height="26" rx="4" />
        <rect className={styles.surface} x="498" y="203" width="44" height="27" rx="4" />
        <rect className={styles.surface} x="552" y="203" width="44" height="27" rx="4" />
        <path className={styles.stroke} d="M440 184H472M440 192H463M440 200H470" />
        <path className={styles.strokeOnChosen} d="M512 180H579" />
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
        <rect className={styles.surface} x="24" y="62" width="157" height="134" rx="7" />
        <path className={styles.line} d="M24 92H181" />
        <circle cx="38" cy="77" r="2.5" className={styles.dimFill} />
        <circle cx="48" cy="77" r="2.5" className={styles.dimFill} />
        <text className={styles.fileName} x="62" y="82">CLAUDE.md</text>
        <text className={styles.code} x="40" y="121">{"> context"}</text>
        <path className={styles.stroke} d="M40 142H111M50 154H154M50 166H133M40 178H92" />
        <path className={styles.codeCaret} d="M96 173V182" />
      </g>
      <text className={styles.label} x="24" y="224">{cn ? "编辑器 / 项目上下文" : "Editor / context"}</text>

      <circle className={styles.hub} cx="246" cy="129" r="24" />
      <text className={styles.stateText} x="246" y="134">MCP</text>
      <circle className={styles.hubRing} cx="246" cy="129" r="31" />

      <g className={styles.toolNodes}>
        <rect className={styles.surface} x="332" y="35" width="132" height="44" rx="6" />
        <path className={styles.figmaMark} d="M350 46H357A4 4 0 0 1 357 54H350A4 4 0 0 1 350 46ZM350 54H353V62H350A4 4 0 0 1 350 54ZM350 62H353V66A4 4 0 1 1 350 62ZM357 54A4 4 0 1 1 357 62A4 4 0 1 1 357 54Z" />
        <text className={styles.toolName} x="374" y="62">Figma</text>
        <rect className={styles.surface} x="332" y="107" width="132" height="44" rx="6" />
        <path className={styles.stroke} d="m354 118 10 6v11l-10 6-10-6v-11Zm-10 6 10 6 10-6m-10 6v11" />
        <text className={styles.toolName} x="374" y="134">Unity</text>
        <rect className={styles.surface} x="332" y="181" width="132" height="44" rx="6" />
        <path className={styles.stroke} d="M344 196H364V210H344Zm0 0 10 8 10-8" />
        <text className={styles.toolName} x="374" y="208">Customer.io</text>
      </g>

      <g className={styles.arrive}>
        <rect className={styles.surface} x="521" y="87" width="96" height="88" rx="6" />
        <path className={styles.line} d="M521 106H617" />
        <path className={styles.stroke} d="M531 97H545M554 97H582" />
        <path className={styles.stroke} d="M539 128V148M550 128V134Q550 139 543 139H539" />
        <circle className={styles.handle} cx="539" cy="126" r="3" />
        <circle className={styles.handle} cx="539" cy="151" r="3" />
        <circle className={styles.handle} cx="550" cy="126" r="3" />
        <path className={styles.stroke} d="M566 125H604M566 135H593M566 145H582" />
        <path className={styles.stroke} d="m590 155 4 4 8-9" />
      </g>
      <text className={styles.label} x="521" y="73">PR / preview</text>
      <text className={styles.small} x="521" y="200">{cn ? "可评审的结果" : "ready to review"}</text>
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
