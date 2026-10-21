import { NutraTestingFixes } from "./NutraTestingFixes";
import { NutraTestingLoop } from "./NutraTestingLoop";
import styles from "./NutraTesting.module.css";

/* Nutra · Testing & refinement (visual "nutra-testing"). How testing
   drove the design, in two blocks 56px apart:

     Loop   board 040 as a working diagram: "Imagine…" is a straight line
            from the user flow to the hi-fi prototype; "In reality…" is
            the same chips pulled into loops of user tests, with every
            revision returning to the user flow (the one accent mark).
     Fixes  three cases from the tests (boards 031, 033, 045, 046): what
            testers struggled with, drawn as a lo-fi silhouette in site
            greys, next to what changed, redrawn as the app in its own
            colours and type.

   Both parts are client components; this wrapper only lays them out. */
export function NutraTesting() {
  return (
    <div className={styles.root}>
      <NutraTestingLoop />
      <NutraTestingFixes />
    </div>
  );
}
