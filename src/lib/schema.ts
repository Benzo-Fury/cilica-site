/**
 * Structured data (schema.org JSON-LD) for every page. Only facts that are true today: the app is
 * free, AGPL, for macOS, Windows and Linux, at the version GitHub reports. No ratings, reviews or
 * user counts exist, so none are given.
 */
import { repoUrl, releasesUrl, type Release } from "./release";

export const SITE = "https://cilica.si";
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;
export const APP_ID = `${SITE}/#app`;

type Node = Record<string, unknown>;

/** The organisation, website and app nodes, shared by every page. */
export function siteGraph(release: Release): Node[] {
  return [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Cilica",
      url: `${SITE}/`,
      logo: `${SITE}/apple-touch-icon.png`,
      sameAs: [repoUrl],
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      name: "Cilica",
      url: `${SITE}/`,
      inLanguage: "en-GB",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "SoftwareApplication",
      "@id": APP_ID,
      name: "Cilica",
      description:
        "A private, local-first Markdown notes app with a built-in assistant that can read and edit your notes, and meeting notes recorded without a bot and transcribed on your computer.",
      url: `${SITE}/`,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Note-taking",
      operatingSystem: "macOS 14.4 or later (Apple silicon), Windows 10, Windows 11, Linux",
      softwareVersion: release.version,
      ...(release.published && { datePublished: release.published }),
      downloadUrl: `${releasesUrl}/latest`,
      releaseNotes: release.pageUrl,
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      image: `${SITE}/og.png`,
      featureList: [
        "Markdown notes compatible with Obsidian",
        "Built-in assistant that reads and edits notes, with undo and reviewable diffs",
        "Meeting recording without a bot",
        "On-device transcription with Whisper",
        "Speaker labels from voiceprints saved on your computer",
        "Meeting summaries with decisions and action items",
        "Bring your own model: Anthropic, OpenAI-compatible or local Ollama",
      ],
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
    },
  ];
}

/** A page node, linked to the site and the app. */
export function webPage(opts: { url: string; name: string; description: string; breadcrumb?: boolean }): Node {
  return {
    "@type": "WebPage",
    "@id": `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: "en-GB",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": APP_ID },
    ...(opts.breadcrumb && { breadcrumb: { "@id": `${opts.url}#breadcrumb` } }),
  };
}

/** Home, then this page. */
export function breadcrumb(url: string, name: string): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cilica", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  };
}

/** Questions and answers shown on the page, as an FAQPage node. */
export function faq(url: string, items: { q: string; a: string }[]): Node {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

/** One JSON-LD document; `<` is escaped so the text can never close the script tag. */
export const jsonLd = (graph: Node[]) =>
  JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
