import type { ReactNode } from "react";

/* Chinese may wrap between any two hanzi, so a narrow column splits a word
   (紧接 / 着, 像 / 素). The copy is cut into words and a word of two or
   more hanzi is held whole in a span whose class sets white-space: nowrap;
   a lone hanzi the dictionary leaves over (复, 用, 的, 和) joins the
   hanzi before it, so 可复用组件 holds too, and one that opens a run
   joins the word after it (省多少). Lines still break between
   words and after punctuation. Latin copy comes back untouched.

   It runs on the server and again in the browser to hydrate, so the two
   must agree. Node, Chrome and Safari cut hanzi alike, but not Latin:
   Chrome reads "helloaxel.com" as three words, Node as one. Everything
   between two held words is therefore joined back into one string, so
   only the hanzi decide the markup. */
const zhWords = typeof Intl.Segmenter === "function" ? new Intl.Segmenter("zh", { granularity: "word" }) : null;
const HAN = /^\p{Script=Han}+$/u;

/* Words the engines' Chinese dictionary cuts wrongly in this site's copy:
   方形像素 comes out 方 | 形像 | 素, so a line could end inside 方形;
   一句话说 comes out 一句 | 话说; 心率, 静息, 基线 and 时长 come out as
   lone hanzi, which then join into one unbreakable run (当前心率与静息基线
   心率之差的). Each is taken whole before the rest is segmented. Plain
   string matching, so every engine agrees on it. */
const GLOSSARY = ["一句话", "方形", "像素", "归一化", "心率", "静息", "基线", "时长"];
const GLOSSED = new RegExp(`(${GLOSSARY.join("|")})`, "u");

function segments(text: string, words: Intl.Segmenter): string[] {
  // split() with a capture group puts the glossary words at odd indices
  return text
    .split(GLOSSED)
    .flatMap((piece, i) => (i % 2 === 1 ? [piece] : Array.from(words.segment(piece), (s) => s.segment)));
}

export function hold(text: string, wordClass: string): ReactNode {
  if (zhWords === null || !/\p{Script=Han}/u.test(text)) return text;
  const words: string[] = [];
  let afterHan = false;
  for (const segment of segments(text, zhWords)) {
    const han = HAN.test(segment);
    // A lone hanzi joins its neighbour: the word before it, or, opening a
    // run (省 | 多少, 像 | 说话), the word after it
    if (han && afterHan && (segment.length === 1 || words[words.length - 1].length === 1)) {
      words[words.length - 1] += segment;
    } else words.push(segment);
    afterHan = han;
  }
  const out: ReactNode[] = [];
  let loose = "";
  for (const word of words) {
    if (word.length > 1 && HAN.test(word)) {
      if (loose) out.push(loose);
      loose = "";
      out.push(
        <span key={out.length} className={wordClass}>
          {word}
        </span>,
      );
    } else loose += word;
  }
  if (loose) out.push(loose);
  return out;
}
