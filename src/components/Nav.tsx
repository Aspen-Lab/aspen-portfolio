import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/75 border-b border-line/60">
      <div className="container-fluid h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-[20px] tracking-[-0.01em] text-ink"
        >
          Aspen Lab
        </Link>
        <nav className="flex items-center gap-7 text-[14px] text-mute">
          <Link href="/#work" className="link link-rev hover:text-ink">
            Work
          </Link>
          <Link href="/#about" className="link link-rev hover:text-ink">
            About
          </Link>
          <a
            href="https://www.notion.so/Aspen-Design-Lab-29106c193aa980b3b791d7d7fe378e89?source=copy_link"
            target="_blank"
            rel="noreferrer"
            className="link link-rev hover:text-ink hidden sm:inline"
          >
            Studies
          </a>
          <a
            href="mailto:xiaoyangw.design@gmail.com"
            className="link link-rev hover:text-ink"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
