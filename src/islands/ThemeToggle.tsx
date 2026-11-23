/** Light or Dark for the site. The site is light for everyone; Dark is remembered per browser. */
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { springs } from "./springs";

type Theme = "light" | "dark";
const OPTIONS: { id: Theme; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    try { const t = localStorage.getItem("cilica-theme"); if (t === "dark") setTheme(t); } catch { /* storage blocked */ }
  }, []);
  function pick(t: Theme) {
    setTheme(t);
    const d = document.documentElement;
    d.setAttribute("data-theme", t);
    try { if (t === "light") localStorage.removeItem("cilica-theme"); else localStorage.setItem("cilica-theme", t); } catch { /* storage blocked */ }
  }
  return (
    <div className="seg seg-icons" role="radiogroup" aria-label="Theme">
      {OPTIONS.map(({ id, label, Icon }) => {
        const on = id === theme;
        return (
          <button key={id} role="radio" aria-checked={on} aria-label={label} title={label} className={on ? "on" : ""} onClick={() => pick(id)}>
            {on && <motion.span layoutId="seg-theme" className="seg-thumb" transition={springs.smooth} />}
            <Icon className="i i-sm" />
          </button>
        );
      })}
    </div>
  );
}
