// Snapshots real commit activity for the Side Projects heatmap.
//
// Vercel builds from GitHub and cannot see the repos on this machine, so
// the counts are gathered locally and committed as a dated snapshot:
//   src/data/commit-activity.json   { updated, start, counts[90] }
// Only dates and counts are written — no repo names, no identities.
//
// Counts non-merge commits authored under your git identity (global
// user.name / user.email) across every repo directly under $HOME,
// worktrees included; commits shared between clones/worktrees count once.
//
//   node scripts/commit-activity.mjs
//
// Options (environment):
//   COMMIT_ROOTS    colon-separated folders to scan (default: $HOME)
//   COMMIT_AUTHORS  comma-separated extra author names/emails to include
//   COMMIT_DAYS     window length in days (default: 90)
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DAYS = Number(process.env.COMMIT_DAYS ?? 90);
const roots = (process.env.COMMIT_ROOTS ?? homedir()).split(":").filter(Boolean);

const git = (args, cwd) => {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 << 20 }).trim();
  } catch {
    return "";
  }
};

const identities = new Set(
  [
    git(["config", "--global", "user.name"]),
    git(["config", "--global", "user.email"]),
    ...(process.env.COMMIT_AUTHORS ?? "").split(","),
  ]
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);
if (identities.size === 0) throw new Error("No git identity: set git config --global user.name/user.email or COMMIT_AUTHORS");

// Local calendar days, oldest first, ending today.
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = new Date();
const days = Array.from({ length: DAYS }, (_, i) => {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (DAYS - 1 - i));
  return ymd(d);
});
const index = new Map(days.map((d, i) => [d, i]));

const repos = roots.flatMap((root) =>
  readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(root, e.name, ".git")))
    .map((e) => join(root, e.name)),
);

const counts = new Array(DAYS).fill(0);
const seen = new Set();
const perRepo = [];
for (const repo of repos) {
  const out = git(
    ["log", "--all", "--no-merges", `--since=${days[0]} 00:00`, "--date=short", "--format=%H%x09%an%x09%ae%x09%ad"],
    repo,
  );
  let n = 0;
  for (const line of out ? out.split("\n") : []) {
    const [hash, name, email, date] = line.split("\t");
    if (seen.has(hash)) continue;
    if (!identities.has(name.toLowerCase()) && !identities.has(email.toLowerCase())) continue;
    const i = index.get(date);
    if (i === undefined) continue;
    seen.add(hash);
    counts[i]++;
    n++;
  }
  if (n) perRepo.push(`${repo.replace(homedir(), "~")}: ${n}`);
}

mkdirSync(join(ROOT, "src/data"), { recursive: true });
writeFileSync(
  join(ROOT, "src/data/commit-activity.json"),
  JSON.stringify({ updated: days[DAYS - 1], start: days[0], counts }) + "\n",
);

const total = counts.reduce((a, b) => a + b, 0);
console.log(`${total} commits · ${counts.filter(Boolean).length} active days · peak ${Math.max(...counts)} · ${days[0]} → ${days[DAYS - 1]}`);
console.log(perRepo.map((r) => `  ${r}`).join("\n"));
console.log("wrote src/data/commit-activity.json");
