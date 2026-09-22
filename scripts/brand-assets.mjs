// Regenerates the site's share card and icons from the same sources the
// page uses: the portrait tones in src/lib/avatar-ascii.ts and the Geist
// fonts from the `geist` package. Renders each asset in headless Chrome
// (no extra dependencies) and writes:
//
//   public/og.jpg                           1200×630 link-preview card (JPEG:
//                                          the grain makes PNG ~670KB, and
//                                          WhatsApp drops previews that heavy).
//                                          Bump OG_VERSION in src/lib/seo.ts
//                                          after regenerating it.
//   src/app/icon.png                        512×512 keycap mark
//   src/app/apple-icon.png                  180×180 home-screen icon
//   src/app/favicon.ico                     16/32/48 for legacy requests
//
// Run after changing the headline or the portrait:
//   node scripts/brand-assets.mjs
// Refresh only the share card, preserving all icons:
//   node scripts/brand-assets.mjs --og-only
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OG_ONLY = process.argv.includes("--og-only");
const CHROME =
  process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const font = (p) => readFileSync(join(ROOT, "node_modules/geist/dist/fonts", p)).toString("base64");
const FONTS = `
  @font-face { font-family: Geist; src: url(data:font/ttf;base64,${font("geist-sans/Geist-Variable.ttf")}) format("truetype"); font-weight: 100 900; }
  @font-face { font-family: GeistMono; src: url(data:font/ttf;base64,${font("geist-mono/GeistMono-Variable.ttf")}) format("truetype"); font-weight: 100 900; }`;

const src = readFileSync(join(ROOT, "src/lib/avatar-ascii.ts"), "utf8");
const TONES = [...src.slice(src.indexOf("AVATAR_TONES")).matchAll(/"([0-9]+)"/g)].map((m) => m[1]);

/* ── Share card ─────────────────────────────────────────────────────────
   The hero, recomposed for a 1200×630 frame: statement left, dissolving
   dot portrait right, the nav's LED lockup on top, the domain engraved
   at the foot. Same paper, same spotlight, same grain. */
const OG = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; font-family: Geist;
    background-color: #212121;
    background-image:
      radial-gradient(52% 64% at 74% 46%, rgba(244,244,242,.06) 0%, rgba(244,244,242,.02) 46%, rgba(244,244,242,0) 72%),
      radial-gradient(140% 90% at 50% -10%, rgba(255,255,255,.05), rgba(255,255,255,0) 55%),
      linear-gradient(180deg, rgba(255,255,255,.015) 0%, rgba(0,0,0,.18) 100%); }
  .grain { position: absolute; inset: 0; opacity: .07; }
  .portrait { position: absolute; right: -36px; top: 50%; transform: translateY(-50%);
    -webkit-mask-image: radial-gradient(64% 62% at 58% 46%, black 42%, transparent 88%); }
  .col { position: absolute; left: 84px; top: 76px; width: 900px; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 26px; letter-spacing: -.01em; color: #F4F4F2; }
  .led { width: 17px; height: 17px; border-radius: 50%; display: grid; place-items: center;
    background: rgba(0,0,0,.4); box-shadow: inset 0 1px 2px rgba(0,0,0,.6), inset 0 -.5px 0 rgba(255,255,255,.05); }
  .led i { width: 8px; height: 8px; border-radius: 50%; background: #F4F4F2;
    box-shadow: 0 0 8px rgba(244,244,242,.9), 0 0 18px rgba(244,244,242,.35); }
  .avail { font-family: GeistMono; font-size: 13px; letter-spacing: .2em; color: #717177; }
  h1 { margin-top: 70px; font-weight: 300; font-size: 82px; line-height: 1.02; letter-spacing: -.03em; color: rgba(244,244,242,.88); }
  h1 em { font-style: italic; font-weight: 400; padding: 0 .08em; margin: 0 -.08em;
    background: linear-gradient(112deg, rgba(160,160,165,.8) 0%, rgba(244,244,242,.96) 48%, rgba(180,180,186,.72) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .bio { margin-top: 36px; width: 600px; font-size: 25px; line-height: 1.5; color: rgba(160,160,165,.8); }
  .bio b { font-weight: 400; color: rgba(244,244,242,.62); }
  .foot { position: absolute; left: 84px; right: 84px; bottom: 50px; display: flex; justify-content: space-between;
    font-family: GeistMono; font-size: 14px; letter-spacing: .24em; text-transform: uppercase; color: #717177; }
</style></head><body>
  <svg class="grain" width="1200" height="630"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>
  <div class="portrait"><canvas id="c"></canvas></div>
  <div class="col">
    <div class="brand">Aspen Lab <span class="led"><i></i></span><span class="avail">AVAILABLE</span></div>
    <h1>Design × engineering,<br>one <em>leverage</em> force.</h1>
    <p class="bio">Founding Design Engineer at <b>Axel (YC W19)</b>, shipping product design and frontend PRs.</p>
  </div>
  <div class="foot"><span>www.aspenlab.io</span><span>EN · 中文</span></div>
<script>
  // Same resampling and luminance as AvatarDots, frozen at rest.
  const TONES = ${JSON.stringify(TONES)};
  const srcG = TONES.map((l) => [...l].map((ch) => (ch.charCodeAt(0) - 48) / 9));
  const sh = srcG.length, sw = srcG[0].length, TW = 152;
  const TH = Math.round((TW * (sh * 1.15)) / (sw * 0.6));
  const pitch = 4.3, dot = 1.15, W = TW * pitch, H = TH * pitch, dpr = 2;
  const c = document.getElementById("c");
  c.width = W * dpr; c.height = H * dpr; c.style.width = W + "px"; c.style.height = H + "px";
  const ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
  const EYE_L = { x: .43, y: .435 }, EYE_R = { x: .615, y: .425 };
  for (let ty = 0; ty < TH; ty++) {
    const fy = (ty / (TH - 1)) * (sh - 1), y0 = Math.floor(fy), y1 = Math.min(sh - 1, y0 + 1), wy = fy - y0;
    for (let tx = 0; tx < TW; tx++) {
      const fx = (tx / (TW - 1)) * (sw - 1), x0 = Math.floor(fx), x1 = Math.min(sw - 1, x0 + 1), wx = fx - x0;
      const top = srcG[y0][x0] + (srcG[y0][x1] - srcG[y0][x0]) * wx;
      const bot = srcG[y1][x0] + (srcG[y1][x1] - srcG[y1][x0]) * wx;
      const bb = (1 - (top + (bot - top) * wy) - .12) / .88;
      if (bb <= .02) continue;
      const hx = tx * pitch + pitch / 2, hy = ty * pitch + pitch / 2;
      const dc = Math.hypot(hx - W * .42, hy - H * .44);
      let a = Math.min(.78, bb * .44 * (1 + Math.max(0, 1 - dc / (W * .55)) * 1.3));
      const r = 52 * pitch / 3.8;
      const dL = Math.hypot(hx - W * EYE_L.x, hy - H * EYE_L.y), dR = Math.hypot(hx - W * EYE_R.x, hy - H * EYE_R.y);
      const eye = Math.max(dL < r ? (1 - dL / r) ** 2 : 0, dR < r ? (1 - dR / r) ** 2 : 0);
      if (eye > 0) a = Math.min(.88, a + eye * .45);
      ctx.fillStyle = "rgba(244,244,242," + a.toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(hx, hy, dot, 0, Math.PI * 2); ctx.fill();
    }
  }
  document.fonts.ready.then(() => (window.__ready = true));
</script></body></html>`;

/* ── Keycap mark ────────────────────────────────────────────────────────
   The inventory's raised cap (CAP_STYLE in src/lib/tactile.ts) carrying
   an engraved-bright "A". A stand-in until there is a drawn mark. */
const cap = (size, { bleed }) => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
  * { margin: 0; }
  html, body { width: ${size}px; height: ${size}px; background: transparent; overflow: hidden; }
  .cap { position: absolute; inset: ${bleed ? 0 : size * 0.02}px; border-radius: ${bleed ? 0 : size * 0.23}px;
    background: linear-gradient(180deg, #343436 0%, #262628 100%);
    box-shadow: inset 0 ${Math.max(1, size * 0.012)}px 0 rgba(255,255,255,.12), inset 0 -${Math.max(1, size * 0.012)}px 0 rgba(0,0,0,.45);
    display: grid; place-items: center; }
  .a { font-family: Geist; font-weight: 500; font-size: ${size * 0.62}px; line-height: 1; letter-spacing: -.02em;
    color: #F4F4F2; transform: translateY(-${size * 0.015}px);
    text-shadow: 0 0 ${size * 0.04}px rgba(244,244,242,.18); }
</style></head><body><div class="cap"><span class="a">A</span></div>
<script>document.fonts.ready.then(() => (window.__ready = true));</script></body></html>`;

/* ── Headless Chrome over CDP ─────────────────────────────────────────── */
const tmp = mkdtempSync(join(tmpdir(), "brand-assets-"));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${tmp}/profile`,
  "--no-first-run", "--hide-scrollbars", "--force-color-profile=srgb", "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    wsUrl = list.find((t) => t.type === "page")?.webSocketDebuggerUrl;
  } catch {}
  if (!wsUrl) await sleep(200);
}
if (!wsUrl) throw new Error(`Chrome did not start (${CHROME}); set CHROME_BIN`);
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++seq;
  pending.set(id, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
  ws.send(JSON.stringify({ id, method, params }));
});

async function render(html, w, h, { transparent = false, jpeg = false } = {}) {
  const file = join(tmp, `asset-${w}x${h}.html`);
  writeFileSync(file, html);
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setDefaultBackgroundColorOverride", transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
  await send("Page.navigate", { url: `file://${file}` });
  for (let i = 0; i < 100; i++) {
    const r = await send("Runtime.evaluate", { expression: "window.__ready === true", returnByValue: true });
    if (r.result.value) break;
    await sleep(100);
  }
  await sleep(150);
  const { data } = await send("Page.captureScreenshot", {
    ...(jpeg ? { format: "jpeg", quality: 88 } : { format: "png" }),
    clip: { x: 0, y: 0, width: w, height: h, scale: 1 },
    captureBeyondViewport: false,
  });
  return Buffer.from(data, "base64");
}

/** ICO container holding PNG frames (valid since Vista; every browser). */
function ico(frames) {
  const header = Buffer.alloc(6 + frames.length * 16);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach(({ size, png }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e); header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(png.length, e + 8); header.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...frames.map((f) => f.png)]);
}

await send("Page.enable");
await send("Runtime.enable");
const out = (p, buf) => { writeFileSync(join(ROOT, p), buf); console.log(`wrote ${p} (${buf.length} bytes)`); };

out("public/og.jpg", await render(OG, 1200, 630, { jpeg: true }));
if (!OG_ONLY) {
  out("src/app/icon.png", await render(cap(512, { bleed: false }), 512, 512, { transparent: true }));
  out("src/app/apple-icon.png", await render(cap(180, { bleed: true }), 180, 180));
  const frames = [];
  for (const size of [16, 32, 48]) frames.push({ size, png: await render(cap(size, { bleed: false }), size, size, { transparent: true }) });
  out("src/app/favicon.ico", ico(frames));
}

ws.close();
chrome.kill();
await new Promise((r) => chrome.once("exit", r));
rmSync(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
process.exit(0);
