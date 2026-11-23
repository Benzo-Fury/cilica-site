/**
 * Home's faces: one thing about your week when no note is open. "Show something else" swaps the face,
 * as it does in the app. All content here is example data.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Shuffle } from "lucide-react";
import { springs } from "./springs";

const FACES = [
  { k: "word", big: "runway", small: "Word of the week. Said 23 times across 6 meetings." },
  { k: "quote", big: "“If it needs a manual, it isn't step one.”", small: "Priya Shah, Onboarding review, Thursday" },
  { k: "talk", big: "You did 41% of the talking", small: "Across 9 meetings this week. Sam did 23%.", bars: [41, 23, 19, 17] },
  { k: "pace", big: "148 words a minute", small: "Your speaking pace this week, down from 161." },
  { k: "silence", big: "0:41", small: "The longest silence this week, right after “so, pricing”." },
] as const;

export default function HomeFaces() {
  const [i, setI] = useState(0);
  const f = FACES[i];
  return (
    <div className="faces">
      <div className="faces-stage" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={f.k} className={`face face-${f.k}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }} transition={springs.gentle}>
            <p className="face-big">{f.big}</p>
            {"bars" in f && (
              <div className="face-bars" aria-hidden="true">
                {f.bars.map((b, k) => <motion.i key={k} style={{ flexGrow: b }} className={k === 0 ? "me" : ""} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ ...springs.smooth, delay: k * 0.024 }} />)}
              </div>
            )}
            <p className="face-small">{f.small}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <button className="btn btn-xs btn-ghost faces-next" onClick={() => setI((i + 1) % FACES.length)}><Shuffle className="i i-xs ic-pop" />Show something else</button>
    </div>
  );
}
