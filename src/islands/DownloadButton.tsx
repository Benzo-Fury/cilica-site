/**
 * The primary action. Detects the visitor's system and shows its logo and file; the logo and label
 * swap on a spring. Server-rendered as macOS so it never shifts layout on hydration.
 */
import { useEffect, useState } from "react";
import { Logos, detectOS, type OS } from "./os";

export interface Target { url: string; size: string }
export interface Downloads { mac?: Target; win?: Target; linux?: Target; fallback: string }

const LABEL: Record<OS, string> = { mac: "Download for macOS", win: "Download for Windows", linux: "Download for Linux" };
const META: Record<OS, string> = {
  mac: "Free. Apple silicon, macOS 14.4 or later.",
  win: "Free. Early build for Windows 10 and 11.",
  linux: "Free. Early build, AppImage for x86-64.",
};

interface Props { downloads: Downloads; size?: "lg" | "md" | "sm"; meta?: boolean; short?: boolean }

export default function DownloadButton({ downloads, size = "lg", meta = false, short = false }: Props) {
  const [os, setOS] = useState<OS>("mac");
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const d = detectOS();
    setOS(d.os);
    setMobile(d.mobile);
    const onPick = (e: Event) => setOS((e as CustomEvent<OS>).detail);
    addEventListener("cilica:os", onPick);
    return () => removeEventListener("cilica:os", onPick);
  }, []);

  const target = downloads[os];
  const href = mobile ? "#download" : target?.url ?? downloads.fallback;
  const cls = `btn btn-primary dl dl-${size}${size === "lg" ? " btn-lg" : size === "sm" ? " btn-sm" : ""}`;
  const iconSize = size === "lg" ? 20 : 16;

  return (
    <div className={`dl-wrap${meta ? " has-meta" : ""}`}>
      <a className={cls} href={href} data-os={os}>
        <span className="dl-os" style={{ width: iconSize, height: iconSize }}>
          {(Object.keys(Logos) as OS[]).map((k) => {
            const L = Logos[k];
            return <L key={k} width={iconSize} height={iconSize} data-on={k === os || undefined} />;
          })}
        </span>
        <span className="dl-label">
          {(Object.keys(LABEL) as OS[]).map((k) => (
            <span key={k} data-on={k === os || undefined} aria-hidden={k !== os}>
              {short ? "Download" : LABEL[k]}
            </span>
          ))}
        </span>
      </a>
      {meta && (
        <p className="dl-meta">
          {mobile ? "Cilica is a desktop app for Mac, Windows and Linux." : <>{META[os]}{target ? <> <span className="mono">{target.size}</span>.</> : null}</>}
        </p>
      )}
    </div>
  );
}
