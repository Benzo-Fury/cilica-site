# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output) with React islands and the `motion` library for animated product mocks. Static hosting; the host is not decided yet. Privacy-friendly analytics only, no cookie banner.

## Users

People who live in their notes and sit in a lot of calls: founders, product people, researchers, consultants, engineers. Many already use Obsidian, Notion or Apple Notes, and some already pay for Granola, Otter or Fireflies. They arrive at cilica.si deciding whether to download a desktop app and trust it with their notes and their meetings.

## Product Purpose

Cilica (cilica.si) is a private, local-first desktop notes app. You write in Markdown; Cilica, the built-in assistant in the right sidebar, can read and edit every note behind visible safety guards; calls are recorded without a bot, transcribed on the computer and summarised into notes. The site succeeds when a visitor understands that Cilica is a notes app first, with the assistant as a first-class part of it and meeting notes as a strong addition, and downloads it.

## Positioning

A modern Markdown notes app where the assistant works inside your notes, visibly and undoably, and meetings become notes without a bot, on your own machine, with your own choice of model and transcription engine. Open source (AGPL), Obsidian-compatible files, nothing leaves the computer unless you pick a cloud engine.

## Operating Context

Desktop app on macOS 14.4+, Windows 10/11 and Linux. Works alongside Zoom, Meet, Teams, Slack huddles, WhatsApp, FaceTime, Discord. Visitors compare it with Granola, Anarlog, Obsidian, Notion AI, Reflect, Otter and Fireflies.

## Capabilities and Constraints

Headline:
- Cilica the assistant: reads and edits every note from the sidebar; reads run freely, additions come with Undo, edits show diff cards accepted hunk by hunk, deletes need a confirm card that cannot be turned off; a whole turn undoes with Cmd+Z; activity log, version history, 30-day Trash; transcripts are walled off from prompt injection. You watch it work live (a marker sweeps what it reads, steps show inline, each turn ends with a "What changed" receipt).
- Meetings without a bot: records mic and system audio; detects the meeting app; audio written to disk as it arrives.
- On-device transcription (Whisper), live partial lines under 3 s behind speech, a careful second pass after the call.
- Live on-device speaker labels; saved people and voiceprints learned from corrections ("Is Person 2 Sam?").
- Summaries woven with your own jottings: Summary, Decisions, Action items (owner, due date), Open questions.
- Bring your own providers: Anthropic, OpenAI-compatible (OpenRouter, Groq, LM Studio), local Ollama; transcription locally or with Soniox, Deepgram, AssemblyAI, OpenAI using your key.

Supporting: Obsidian-compatible Markdown stored in SQLite, with Markdown export (wikilinks, embeds, tags, YAML properties, link-rewriting on rename, up to 3 suggested-link pills per note), graph view with replay, natural-language Cmd+K search with filter chips, scheduled tasks as proposals, import from many apps (count to be verified before stating a number: README says 45, about 39 provider ids counted), keyboard-driven with rebindable shortcuts.

Details: Home faces (word of the week, quotes, talk share, pace, longest silence), swear jar (with safe-for-work mode), floating meeting pill, offline thesaurus, spring-physics toasts, sounds and haptics, pixel ridgeline setup window.

Do not feature: the Claude Code bridge (experimental, terms risk).

Pricing: the desktop app is free for everyone (AGPL). The future sync server is free for individuals and organisations up to 10 people; larger organisations will pay. The page shows only the free plan now, structured so paid tiers can be added. Never call the server open source.

## Brand Commitments

- Name: Cilica. Domain cilica.si, a nod to Si, the element symbol for silicon.
- Voice: sentence case, plain verbs, second person, no emoji, no "Success!". The assistant is "Cilica", never "AI" (the word AI may appear only where a visitor needs the category, e.g. SEO and "AI settings").
- The site follows the app's design system in `Cilica/docs/design-system/`: tokens, spring presets, glass rules (no inner light, 0.5px glass edge), Inter / Newsreader / Geist Mono, Lucide icons, graphite accent, light and dark.
- App icon: Ridgeline, six ridges on a cream sky (`apps/desktop/src-tauri/icons/source/icon.svg`).

## Evidence on Hand

- Speaker labels right for 94–99% of speech on four-person meetings, against 76–92% for Soniox live labels (approved for publication).
- Installer under 20 MB, idle memory under 150 MB, cold start under 1 s (approved).
- Version 0.10.0. Screenshots in `Cilica/screenshots/01–11` and `Cilica/docs/screenshots/`.
- No testimonials, customer logos, user counts or GitHub star counts exist yet. Do not invent them.

## Product Principles

1. Notes first: the assistant and meetings serve the notes, not the other way round.
2. Show the work: every claim about Cilica's behaviour is demonstrated, not asserted.
3. Private by construction: say where data lives in concrete terms.
4. Your choice of model, engine and files; nothing locks you in.

## Accessibility & Inclusion

WCAG 2.2 AA. Honour prefers-reduced-motion and prefers-reduced-transparency. Fully keyboard navigable. Mobile layout required.
