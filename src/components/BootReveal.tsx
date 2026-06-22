"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// Module-level flag so late-mounting components don't miss the event
let _bootDone = false;
if (typeof window !== "undefined") {
  document.addEventListener("aspen:boot-done", () => { _bootDone = true; }, { once: true });
}

export function BootReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fire = () => {
      timerRef.current = setTimeout(() => setActive(true), delay * 1000);
    };

    if (_bootDone) {
      fire();
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }

    document.addEventListener("aspen:boot-done", fire, { once: true });
    // Safety fallback if event never fires
    const fallback = setTimeout(() => setActive(true), 4500);

    return () => {
      document.removeEventListener("aspen:boot-done", fire);
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(fallback);
    };
  }, [delay]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
