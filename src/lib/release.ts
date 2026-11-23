/** Latest Cilica release, read from GitHub at build time so the download buttons and sizes stay true. */

export const REPO = "Benzo-Fury/cilica";
export const repoUrl = `https://github.com/${REPO}`;
export const releasesUrl = `${repoUrl}/releases`;

export interface Asset { name: string; url: string; size: number }
export interface Release {
  version: string;
  tag: string;
  pageUrl: string;
  mac?: Asset;
  win?: Asset;
  appImage?: Asset;
  deb?: Asset;
  rpm?: Asset;
}

/** What 0.10.0 shipped, used when the build has no network. */
const FALLBACK_VERSION = "0.10.0";
const fallbackAsset = (name: string, size: number): Asset => ({
  name, size, url: `${releasesUrl}/download/v${FALLBACK_VERSION}/${name}`,
});
const FALLBACK: Release = {
  version: FALLBACK_VERSION,
  tag: `v${FALLBACK_VERSION}`,
  pageUrl: `${releasesUrl}/tag/v${FALLBACK_VERSION}`,
  mac: fallbackAsset("Cilica_0.10.0_aarch64.dmg", 21850756),
  win: fallbackAsset("Cilica_0.10.0_x64_Setup.exe", 29195264),
  appImage: fallbackAsset("Cilica_0.10.0_amd64.AppImage", 103066104),
  deb: fallbackAsset("Cilica_0.10.0_amd64.deb", 26745320),
  rpm: fallbackAsset("Cilica-0.10.0-1.x86_64.rpm", 26750523),
};

let cached: Promise<Release> | undefined;

export function getRelease(): Promise<Release> {
  cached ??= load();
  return cached;
}

async function load(): Promise<Release> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "cilica-site-build" };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    const data = (await res.json()) as { tag_name: string; html_url: string; assets: { name: string; browser_download_url: string; size: number }[] };
    const assets: Asset[] = data.assets.map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size }));
    const pick = (re: RegExp) => assets.find((a) => re.test(a.name));
    return {
      version: data.tag_name.replace(/^v/, ""),
      tag: data.tag_name,
      pageUrl: data.html_url,
      mac: pick(/aarch64\.dmg$/),
      win: pick(/_Setup\.exe$/),
      appImage: pick(/\.AppImage$/),
      deb: pick(/\.deb$/),
      rpm: pick(/\.rpm$/),
    };
  } catch (err) {
    console.warn(`[release] Using the bundled 0.10.0 details: ${(err as Error).message}`);
    return FALLBACK;
  }
}

/** "21.9 MB" */
export const mb = (bytes: number) => `${(bytes / 1_000_000).toFixed(bytes >= 100_000_000 ? 0 : 1)} MB`;
