/**
 * The comparison pages. Every claim about another product is taken from that product's own pages
 * (linked under each table as `sources`, with the month they were checked). If a fact could not be
 * confirmed it is left out. Prices change: re-check the sources before editing a row.
 */

export interface Row { label: string; cilica: string; other: string }
export interface Point { title: string; body: string }
export interface Qa { q: string; a: string }
export interface Source { label: string; href: string }

export interface Comparison {
  /** Path without slashes, e.g. "granola-alternative". */
  slug: string;
  /** Short name for links and the breadcrumb. */
  name: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  /** The other column's heading in the table. */
  other: string;
  tableHead: string;
  tableLead: string;
  rows: Row[];
  sources: Source[];
  checked: string;
  pointsHead: string;
  points: Point[];
  /** Which import provider to show "what comes across" for, by its name in imports.ts. */
  importFrom?: string;
  importLead?: string;
  faq: Qa[];
}

export const comparisons: Comparison[] = [
  {
    slug: "granola-alternative",
    name: "Granola alternative",
    title: "A free, open source Granola alternative | Cilica",
    description:
      "Like Granola, Cilica records calls without a bot. It transcribes them on your computer and keeps the notes in a Markdown notes app. Free for Mac, Windows and Linux.",
    h1: "A Granola alternative that keeps your meetings on your computer.",
    lead: "Cilica records your calls without a bot, as Granola does. The difference is where the work happens: transcripts are written on your computer, the notes live in a full Markdown notes app, and you choose the model that writes the summary.",
    other: "Granola",
    tableHead: "Cilica and Granola, side by side",
    tableLead: "Both record from your own computer instead of sending a bot. Most of the difference is where your meetings are processed and kept.",
    rows: [
      { label: "Joins the call as a bot", cilica: "No. It records your microphone and the call's audio.", other: "No. It captures audio from your device." },
      { label: "Where transcription runs", cilica: "On your computer with Whisper, or a cloud service you pick, with your own key", other: "With cloud transcription providers, such as Deepgram and AssemblyAI" },
      { label: "Where your notes are kept", cilica: "On your computer", other: "In Granola's cloud" },
      { label: "Model that writes the summary", cilica: "Your choice: Anthropic, any OpenAI-compatible service, or Ollama on your computer", other: "Granola's AI providers, such as OpenAI and Anthropic" },
      { label: "Notes beyond meetings", cilica: "A full Markdown notes app, with links, a graph, search and an assistant that can edit any note", other: "Built around meeting notes, with folders you can share" },
      { label: "Platforms", cilica: "macOS (Apple silicon), Windows and Linux", other: "macOS, Windows, iOS and Android" },
      { label: "Price", cilica: "Free, the whole app", other: "Free Basic plan with limited meeting history; Business is $14 per user a month" },
    ],
    sources: [
      { label: "Granola pricing", href: "https://www.granola.ai/pricing" },
      { label: "Granola security", href: "https://www.granola.ai/security" },
    ],
    checked: "November 2026",
    pointsHead: "What changes when you switch",
    points: [
      { title: "Transcripts are written on your computer", body: "Whisper runs on your own machine, so the call's audio doesn't have to go anywhere. If you'd rather use Soniox, Deepgram, AssemblyAI or OpenAI, you can, with your own key." },
      { title: "Meetings become ordinary notes", body: "A meeting lands in the same Markdown notes as everything else, so you can link it, tag it, search it and ask Cilica about it next to your own writing." },
      { title: "You pick the model", body: "Summaries come from the model you choose: Anthropic, an OpenAI-compatible service such as OpenRouter or Groq, or Ollama running locally." },
      { title: "When Granola may suit you better", body: "If you need phone apps, shared team folders or integrations with tools such as HubSpot and Attio, Granola offers those today and Cilica doesn't." },
    ],
    importFrom: "Granola",
    importLead: "Cilica imports your Granola meetings. Importing again brings in only what changed, and any import can be undone.",
    faq: [
      { q: "Does Cilica join my calls as a bot?", a: "No. Like Granola, it records from your own computer: your microphone and the call's audio. Nothing appears in the participant list." },
      { q: "Can I bring my Granola notes with me?", a: "Yes. Cilica imports Granola meetings with their summaries, your own notes, transcripts, speakers, timestamps and folders." },
      { q: "Does anything leave my computer?", a: "Not if you transcribe with Whisper and summarise with Ollama. If you pick a cloud transcription service or model, the audio or text goes to that provider, using your own key." },
      { q: "Is Cilica really free?", a: "Yes. The whole desktop app is free and open source under the AGPL. You only pay a model or transcription provider if you choose one." },
    ],
  },
  {
    slug: "meeting-notes-without-a-bot",
    name: "Meeting notes without a bot",
    title: "Meeting notes without a bot, transcribed on your computer | Cilica",
    description:
      "Cilica records calls from your own computer, so no bot joins the meeting. It transcribes on your computer, names speakers and writes a summary with action items. Free.",
    h1: "Meeting notes without a bot in the call.",
    lead: "Cilica records the call from your own computer, your microphone and the call's audio, so nothing joins the meeting. It writes the transcript on your computer and turns the call into a note.",
    other: "A meeting bot",
    tableHead: "A bot in the call, or none",
    tableLead: "Many note takers, Otter and Fireflies among them, can send a bot into your meetings. Some, such as Granola and Fireflies' desktop app, record from your device instead. This is how the two approaches differ.",
    rows: [
      { label: "Shows up in the participant list", cilica: "No", other: "Yes, as its own participant" },
      { label: "Needs the meeting link or your calendar", cilica: "No", other: "Usually, to know which calls to join" },
      { label: "Works in", cilica: "Zoom, Meet, Teams, Slack huddles, WhatsApp, FaceTime and Discord", other: "The meeting platforms the service supports" },
      { label: "Where the audio goes", cilica: "To your disk, as it arrives", other: "To the note taker's servers" },
      { label: "Where transcription runs", cilica: "On your computer with Whisper, or a service you pick", other: "On the note taker's servers" },
    ],
    sources: [
      { label: "Fireflies: recording without a bot", href: "https://guide.fireflies.ai/articles/6666374717-how-to-record-meetings-without-a-bot-on-the-fireflies-desktop-app" },
      { label: "Granola pricing", href: "https://www.granola.ai/pricing" },
    ],
    checked: "November 2026",
    pointsHead: "How a call becomes a note",
    points: [
      { title: "It notices the call", body: "Start a call in Zoom, Meet, Teams, Slack, WhatsApp, FaceTime or Discord and Cilica sees the meeting app. A small pill shows that it's recording." },
      { title: "Lines appear as people speak", body: "The transcript is written on your computer while the call runs, with each line labelled by speaker. After the call, a careful second pass tidies it up." },
      { title: "It learns who's who", body: "Correct a label once (\"Is Person 2 Sam?\") and Cilica saves Sam's voiceprint on your computer, so it knows Sam next time." },
      { title: "The summary keeps your notes", body: "Jot notes during the call and Cilica weaves them into the summary: what was said, decisions, action items with owners and due dates, and open questions." },
      { title: "Tell people you're recording", body: "Without a bot in the participant list, nobody else can see that the call is being recorded. Let them know, and check what the law requires where you and they are." },
    ],
    faq: [
      { q: "Will other people in the call see Cilica?", a: "No. Cilica records on your computer and never joins the meeting, so it isn't in the participant list. Tell people you're recording." },
      { q: "Which meeting apps does it work with?", a: "Zoom, Google Meet, Microsoft Teams, Slack huddles, WhatsApp, FaceTime and Discord." },
      { q: "Can it tell who said what?", a: "Yes. Speaker labels are worked out on your computer while the call runs. When you name a speaker, Cilica saves their voiceprint so it recognises them in later calls." },
      { q: "Do I need an account or a subscription?", a: "No. Cilica is free and open source. Transcription can run entirely on your computer, and you only pay a provider if you choose a cloud one." },
    ],
  },
  {
    slug: "obsidian-alternative",
    name: "Obsidian alternative",
    title: "Obsidian alternative with built-in AI and meeting notes | Cilica",
    description:
      "Cilica is a Markdown notes app with links, tags and a graph, plus an assistant that can edit any note and meeting notes without a bot. Imports Obsidian vaults. Free.",
    h1: "An Obsidian alternative with an assistant built in.",
    lead: "Cilica is a Markdown notes app with links, tags and a graph, like Obsidian. It adds an assistant that can read and edit every note, and meeting notes recorded without a bot, both built in rather than added with plugins.",
    other: "Obsidian",
    tableHead: "Cilica and Obsidian, side by side",
    tableLead: "Both keep your notes on your computer in Markdown. They differ in what comes built in and in how the notes are stored.",
    rows: [
      { label: "How notes are stored", cilica: "In a database on your computer, exported as Obsidian-compatible Markdown", other: "As Markdown files in a folder on your computer" },
      { label: "Links, tags and graph", cilica: "Wikilinks, tags, properties and a graph view", other: "Wikilinks, tags, properties and a graph view" },
      { label: "Assistant", cilica: "Built in: Cilica reads and edits any note, with diffs to review and Undo", other: "Not in the core app; community plugins add one" },
      { label: "Meeting transcription", cilica: "Built in, without a bot, on your computer", other: "Not in the core app" },
      { label: "Platforms", cilica: "macOS (Apple silicon), Windows and Linux", other: "macOS, Windows, Linux, iOS and Android" },
      { label: "Price", cilica: "Free, the whole app", other: "Free; optional Sync from $4 a month and Publish from $8 a month, billed yearly" },
    ],
    sources: [
      { label: "Obsidian pricing", href: "https://obsidian.md/pricing" },
    ],
    checked: "November 2026",
    pointsHead: "What changes when you switch",
    points: [
      { title: "An assistant that shows its work", body: "Ask Cilica to sort, clean up, merge or summarise notes. Reads run freely, every edit arrives as a diff you accept hunk by hunk, deletes always ask first, and a whole turn undoes with ⌘ Z." },
      { title: "Meetings in the same place", body: "Calls are recorded without a bot, transcribed on your computer and saved as notes, linked and searchable like the rest." },
      { title: "Your files stay portable", body: "Export at any time to Markdown that Obsidian opens: wikilinks, embeds, tags and YAML properties come across, and links are rewritten when you rename a note." },
      { title: "When Obsidian may suit you better", body: "If you want plain files you edit with other tools, a large plugin library, or phone apps, Obsidian has those today and Cilica doesn't." },
    ],
    importFrom: "Obsidian",
    importLead: "Cilica imports your Obsidian vault. Importing again brings in only what changed, and any import can be undone.",
    faq: [
      { q: "Can I import my Obsidian vault?", a: "Yes. Notes, folders (as categories), tags and properties, images and dates come across." },
      { q: "Can I go back to Obsidian later?", a: "Yes. Cilica exports Obsidian-compatible Markdown with wikilinks, embeds, tags and YAML properties." },
      { q: "Which AI model does the assistant use?", a: "The one you choose: Anthropic, any OpenAI-compatible service such as OpenRouter, Groq or LM Studio, or Ollama on your own computer." },
      { q: "Is Cilica free?", a: "Yes. The whole desktop app is free and open source under the AGPL. You only pay a model provider if you choose one." },
    ],
  },
];
