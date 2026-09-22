import styles from "./PlayCardFlowDemos.module.css";

type DemoProps = { playing: boolean; cn: boolean };

const stackedBlocks = [
  [0, 8], [0, 9], [1, 9], [0, 10], [1, 10], [2, 10],
  [3, 10], [4, 9], [4, 10], [5, 10],
] as const;

/** An illustrative round of Blocks, rather than a live game or score. */
export function PlayDemo({ playing, cn }: DemoProps) {
  return (
    <svg className={styles.scene} viewBox="0 0 640 400" aria-hidden="true" data-playing={playing}>
      <rect width="640" height="400" fill="#181918" />
      <g fill="#e2e1db">
        <rect x="30" y="28" width="9" height="9" rx="2" />
        <rect x="42" y="28" width="9" height="9" rx="2" />
        <rect x="30" y="40" width="9" height="9" rx="2" />
        <rect x="42" y="40" width="9" height="9" rx="2" />
      </g>
      <text x="63" y="46" className={styles.brand}>aspen<tspan fontWeight="300" fill="#989c96">play</tspan></text>
      <text x="608" y="43" textAnchor="end" className={styles.eyebrow}>{cn ? "19 款网页游戏" : "19 BROWSER GAMES"}</text>
      <path d="M30 66H610" stroke="#30322f" />

      <text x="30" y="128" className={styles.eyebrow} fill="#c4ac78">{cn ? "试玩一局 / BLOCKS" : "A QUICK ROUND / BLOCKS"}</text>
      <text x="29" y="182" className={styles.playHeadline}>
        <tspan x="29">{cn ? "再来" : "One more"}</tspan>
        <tspan x="29" dy="43">{cn ? "一局。" : "round."}</tspan>
      </text>
      <text x="31" y="261" className={styles.description}>{cn ? "一个人，或一群朋友。" : "Solo, or in good company."}</text>
      <g transform="translate(30 300)" className={styles.keycaps}>
        <rect width="32" height="30" rx="6" />
        <rect x="39" width="32" height="30" rx="6" />
        <rect x="78" width="32" height="30" rx="6" />
        <path d="M21 15H11m0 0 4-4m-4 4 4 4M50 15h10m0 0-4-4m4 4-4 4M94 9v12m0 0-4-4m4 4 4-4" />
      </g>
      <text x="30" y="371" className={styles.eyebrow}>{cn ? "放下 · 连成一行 · 消除" : "DROP. CONNECT. CLEAR."}</text>

      <g transform="translate(324 85)">
        <rect x="-8" y="-8" width="236" height="280" rx="10" fill="#111311" stroke="#393d36" />
        <path d="M22 0V264M44 0V264M66 0V264M88 0V264M110 0V264M132 0V264M154 0V264M176 0V264M198 0V264M0 22H220M0 44H220M0 66H220M0 88H220M0 110H220M0 132H220M0 154H220M0 176H220M0 198H220M0 220H220M0 242H220" fill="none" stroke="#222620" strokeWidth=".65" />
        <g className={styles.stack}>
          {stackedBlocks.map(([x, y]) => <rect key={`${x}-${y}`} x={x * 22 + 1} y={y * 22 + 1} width="20" height="20" rx="3" fill={x < 2 ? "#777e6f" : "#555f50"} />)}
        </g>
        <g className={styles.bottomRow}>
          {[0, 1, 2, 3, 4, 5].map((x) => <rect key={x} x={x * 22 + 1} y="243" width="20" height="20" rx="3" fill="#979b89" />)}
        </g>
        <g className={styles.fallingPiece}>
          {[6, 7, 8, 9].map((x) => <rect key={x} x={x * 22 + 1} y="1" width="20" height="20" rx="3" fill="#d8b675" stroke="#efd5a0" strokeWidth=".7" />)}
        </g>
        <rect className={styles.clearFlash} y="242" width="220" height="22" rx="3" fill="#e8d6a9" />
        <g className={styles.nextPiece} fill="#d8b675">
          <rect x="67" y="23" width="20" height="20" rx="3" />
          <rect x="89" y="23" width="20" height="20" rx="3" />
          <rect x="89" y="45" width="20" height="20" rx="3" />
          <rect x="111" y="45" width="20" height="20" rx="3" />
        </g>
      </g>
      <g className={styles.clearLabel}>
        <circle cx="327" cy="376" r="3" fill="#d8b675" />
        <text x="338" y="380" className={styles.eyebrow} fill="#d8b675">{cn ? "消除一行" : "LINE CLEARED"}</text>
      </g>
      <text x="575" y="100" className={styles.eyebrow} fontSize="9">{cn ? "下个" : "NEXT"}</text>
      <g fill="#6d7665">
        <rect x="573" y="117" width="12" height="12" rx="2" />
        <rect x="587" y="117" width="12" height="12" rx="2" />
        <rect x="587" y="131" width="12" height="12" rx="2" />
        <rect x="601" y="131" width="12" height="12" rx="2" />
      </g>
    </svg>
  );
}

/** A compact visualization of CardFlow's heading-to-cover and divider-to-card flow. */
export function CardFlowDemo({ playing, cn }: DemoProps) {
  return (
    <svg className={styles.scene} viewBox="0 0 640 400" aria-hidden="true" data-playing={playing}>
      <rect width="640" height="400" fill="#0e0e10" />
      <rect x="28" y="26" width="25" height="25" rx="7" fill="#f18a5d" />
      <text x="40.5" y="44" textAnchor="middle" fill="#fff3e6" fontSize="18" fontWeight="600">C</text>
      <text x="64" y="45" className={styles.brand}>CardFlow</text>
      <text x="610" y="43" textAnchor="end" className={styles.eyebrow}>{cn ? "写成文档，排成卡片" : "WORDS INTO CARDS"}</text>
      <path d="M28 66H612" stroke="#2c2b2d" />

      <rect x="28" y="89" width="248" height="241" rx="8" fill="#151517" stroke="#323034" />
      <path d="M28 127H276" stroke="#323034" />
      <rect x="39" y="98" width="28" height="21" rx="4" fill="#343135" />
      <text x="46" y="113" className={styles.toolText} fill="#eee9e4">H1</text>
      <text x="83" y="113" className={styles.toolText}>H2</text>
      <text x="122" y="113" className={styles.toolText} fontWeight="700">B</text>
      <path d="M151 102V115M169 109H190" stroke="#6e686e" />
      <text x="208" y="113" className={styles.toolText}>分页</text>

      <g>
        <text x="44" y="167" className={styles.documentTitle}>把灵感写下来</text>
        <text x="44" y="192" className={styles.documentBody}>好内容，从一个想法开始。</text>
        <rect className={styles.writingMask} x="43" y="139" width="217" height="61" fill="#151517" />
      </g>
      <path className={styles.editorDivider} d="M44 212H260" stroke="#b07459" strokeWidth="1" />
      <g className={styles.editorBody}>
        <text x="44" y="241" className={styles.documentSection}>01 · 从标题到封面</text>
        <path d="M44 262H235M44 276H250M44 290H186" stroke="#5b565b" strokeWidth="3" />
      </g>

      <path className={styles.transfer} d="M286 212H318m-6-6 6 6-6 6" fill="none" stroke="#d98962" strokeWidth="1.4" />

      <g className={styles.backCard}>
        <g transform="rotate(9 482 324)">
          <rect x="408" y="131" width="156" height="210" rx="9" fill="#191619" stroke="#544139" />
          <text x="429" y="166" className={styles.cardSmall}>03 / SHARE</text>
          <path d="M429 200H529M429 214H516M429 228H522" stroke="#6c5348" strokeWidth="3" />
        </g>
      </g>
      <g className={styles.middleCard}>
        <g transform="rotate(4 468 322)">
          <rect x="383" y="115" width="164" height="222" rx="9" fill="#20191b" stroke="#78523e" />
          <text x="405" y="151" className={styles.cardSmall}>02 / STORY</text>
          <text x="405" y="186" className={styles.documentSection}>每个想法</text>
          <text x="405" y="211" className={styles.documentSection}>都有下一页</text>
          <path d="M405 244H518M405 258H504M405 272H512" stroke="#785e52" strokeWidth="3" />
        </g>
      </g>
      <g className={styles.frontCard}>
        <rect x="345" y="91" width="177" height="242" rx="10" fill="#1a171b" stroke="#ba7757" />
        <path d="M357 92H510" stroke="#e3aa79" strokeWidth="2" />
        <text x="367" y="120" className={styles.cardSmall}>01 / COVER</text>
        <text x="367" y="177" className={styles.coverTitle}>把灵感</text>
        <text x="367" y="214" className={styles.coverTitle}>写下来</text>
        <text x="367" y="248" className={styles.cardSmall}>好内容，从一个想法开始。</text>
        <path d="M367 277H500" stroke="#55403a" />
        <text x="367" y="303" className={styles.cardSmall} fill="#d89671">CARDFLOW</text>
        <path d="M486 297H499m-5-5 5 5-5 5" fill="none" stroke="#d89671" />
      </g>

      <text x="28" y="373" className={styles.eyebrow}>{cn ? "H1 成为封面 · 分隔线即分页" : "H1 → COVER · DIVIDER → NEW CARD"}</text>
      <g>
        {[
          ["#d28a5c", 518], ["#cbbd9d", 539], ["#73a7b1", 560], ["#d6a7b5", 581], ["#9aaa7b", 602],
        ].map(([fill, x]) => <rect key={x} x={x} y="362" width="13" height="13" rx="3" fill={fill as string} />)}
      </g>
    </svg>
  );
}
