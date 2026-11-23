/** Platform logos, drawn as single-colour marks that follow currentColor. */
import type { SVGProps } from "react";

export type OS = "mac" | "win" | "linux";

export function MacLogo(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M16.37 12.73c-.02-2.24 1.83-3.32 1.91-3.37-1.04-1.52-2.66-1.73-3.24-1.75-1.38-.14-2.69.81-3.39.81-.7 0-1.78-.79-2.92-.77-1.5.02-2.89.87-3.66 2.21-1.56 2.71-.4 6.72 1.12 8.92.74 1.08 1.63 2.29 2.79 2.24 1.12-.04 1.54-.72 2.89-.72s1.73.72 2.91.7c1.2-.02 1.96-1.09 2.7-2.17.85-1.25 1.2-2.46 1.22-2.52-.03-.01-2.34-.9-2.33-3.58ZM14.15 6.15c.62-.75 1.03-1.78.92-2.81-.88.04-1.95.59-2.58 1.33-.57.65-1.06 1.7-.93 2.71.98.08 1.98-.5 2.59-1.23Z" />
    </svg>
  );
}
export function WindowsLogo(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M3 5.3 10.3 4.3v7.1H3ZM11.2 4.2 21 2.9v8.5h-9.8ZM3 12.6h7.3v7.1L3 18.7ZM11.2 12.6H21v8.5l-9.8-1.3Z" />
    </svg>
  );
}
export function LinuxLogo(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path fillRule="evenodd" d="M12 2.2c-2.3 0-3.6 1.9-3.6 4.4 0 1.3.2 2.2-.5 3.4-.9 1.4-2.6 3.6-2.6 6.4 0 .6.1 1.1.3 1.6-.8.4-1.8.6-1.6 1.6.2.9 1.6.8 2.7 1.3 1.1.5 2.1 1 2.9.6.5-.3.7-.8.7-1.3.6.1 1.2.2 1.7.2s1.2-.1 1.7-.2c0 .5.2 1 .7 1.3.8.4 1.8-.1 2.9-.6 1.1-.5 2.5-.4 2.7-1.3.2-1-.8-1.2-1.6-1.6.2-.5.3-1 .3-1.6 0-2.8-1.7-5-2.6-6.4-.7-1.2-.5-2.1-.5-3.4 0-2.5-1.3-4.4-3.6-4.4Zm-1.3 3.4c.4 0 .7.5.7 1.1s-.3 1.1-.7 1.1-.7-.5-.7-1.1.3-1.1.7-1.1Zm2.6 0c.4 0 .7.5.7 1.1s-.3 1.1-.7 1.1-.7-.5-.7-1.1.3-1.1.7-1.1ZM12 8.6c.9 0 2 .5 2 .9s-1.1 1.1-2 1.1-2-.7-2-1.1 1.1-.9 2-.9Zm0 3.3c1.9 0 3.1 2.2 3.1 4.6 0 1.6-1.2 2.6-3.1 2.6s-3.1-1-3.1-2.6c0-2.4 1.2-4.6 3.1-4.6Z" />
    </svg>
  );
}
export const Logos = { mac: MacLogo, win: WindowsLogo, linux: LinuxLogo } as const;

export function detectOS(): { os: OS; mobile: boolean } {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string; mobile?: boolean } };
  const ua = navigator.userAgent;
  const platform = nav.userAgentData?.platform || navigator.platform || ua;
  const mobile = nav.userAgentData?.mobile ?? /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  if (/win/i.test(platform)) return { os: "win", mobile };
  if (/linux|x11|cros/i.test(platform) && !/android/i.test(ua)) return { os: "linux", mobile };
  return { os: "mac", mobile };
}

export function GitHubLogo(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.6 3 8.6 7.2 10 .5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.4-3.5-1.4-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.2 3.1.9.1-.7.4-1.2.7-1.4-2.3-.3-4.8-1.2-4.8-5.2 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.8 0 4-2.5 4.9-4.8 5.2.4.3.7 1 .7 1.9v2.9c0 .3.2.6.7.5 4.2-1.4 7.2-5.4 7.2-10C22.5 6.2 17.8 1.5 12 1.5Z" />
    </svg>
  );
}
