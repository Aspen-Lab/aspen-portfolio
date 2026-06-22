"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

/** Renders the boot scan-line effect only — no wrapper opacity. */
export function PageEntrance({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onDone = () => setActive(true);
    document.addEventListener("aspen:boot-done", onDone, { once: true });
    const fallback = setTimeout(() => setActive(true), 4500);
    return () => {
      document.removeEventListener("aspen:boot-done", onDone);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      {children}

      {/* Horizontal scan-line sweeps top → bottom as boot completes */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="scan"
            className="fixed inset-x-0 z-[65] pointer-events-none"
            initial={{ top: "0vh", opacity: 1 }}
            animate={{ top: "110vh", opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.85, ease: "linear" }}
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(244,244,242,0.5) 40%, rgba(244,244,242,0.5) 60%, transparent 100%)",
              boxShadow: "0 0 14px 5px rgba(244,244,242,0.08)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
