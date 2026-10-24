"use client";

import { useLocale } from "next-intl";
import { Cluster } from "./cluster/Cluster";
import { ClusterStage } from "./cluster/Stage";
import { PRESETS } from "./cluster/states";
import styles from "./HyundaiHero.module.css";

/* The case's first picture, in place of the white cover: the final Green
   UI cluster with Highway Driving Assist active, drawn in code as a
   product render (video 40 at 0–3 s, its frame at 1.5 s; board 22,
   screen 1). Inside the screen the HMI's own colours, type and sizes;
   around it the page's hero plane, left empty: no edge, no corner marks,
   no dot grid. No site accent here: the render's greens are the
   product's own.

   It is a picture, not a control: the stage is one img with a name,
   everything inside inert, nothing moving (`still`); the page's hero
   entrance carries it. From 640px the screen sits centred at 88% of the
   plane; on a phone it fills the plane's height and shows the middle of
   the cluster (design x 465–1455: the status panel, the scene and the
   neighbouring cars), the speed and the ring falling outside. */

const LABEL = {
  en: "The Green UI instrument cluster with Highway Driving Assist active",
  cn: "绿色界面仪表：高速公路驾驶辅助（HDA）已开启",
};

export function HyundaiHero() {
  const cn = useLocale() === "cn";
  return (
    <div className={styles.root}>
      <ClusterStage label={cn ? LABEL.cn : LABEL.en} mobileWindow={990} cx={960} className={styles.stage}>
        <Cluster state={PRESETS["hda-active"]} palette="final" still />
      </ClusterStage>
    </div>
  );
}
