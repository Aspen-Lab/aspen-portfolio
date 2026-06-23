"use client";

import { NotionRenderer } from "react-notion-x";
import type { ExtendedRecordMap } from "notion-types";
import "react-notion-x/src/styles.css";

export function NotionPage({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return (
    <div className="notion-root">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={true}
        disableHeader={true}
      />
    </div>
  );
}
