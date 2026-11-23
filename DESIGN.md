---
name: Cilica (cilica.si)
description: The landing page for Cilica, a private, local-first Markdown notes app. A light page in the Ridgeline icon's own colours: warm whites, cream and taupe ridges, an ink base.
colors:
  sky: "#fffdfa"
  sky-low: "#f7efe2"
  ridge-1: "#efe5d6"
  ridge-2: "#d9c9b4"
  ridge-3: "#b5a695"
  ridge-4: "#8f8275"
  ridge-5: "#5a524a"
  ridge-6: "#1c1a18"
  band-1: "#fffdfa"
  band-2: "#fbf8f3"
  band-3: "#f8f4ee"
  band-4: "#f3ecdf"
  band-6: "#1c1a18"
  band-2-ink-2: "#514d49"
  band-2-ink-3: "#5f5a55"
  band-3-ink-2: "#4a4642"
  band-3-ink-3: "#57524d"
  band-4-ink-2: "#47433f"
  band-4-ink-3: "#524d48"
  glow-soft: "#e5ecff"
  glow-text: "#1d4fd8"
  island-bg: "#0b0a09"
  island-ink: "#ebe9e7"
  graphite-accent: "#302d2b"
  on-accent: "#fdfbfa"
  canvas: "#fdfbfa"
  raised: "#ffffff"
  sunken: "#f5f3f1"
  ink: "#1c1a18"
  ink-2: "#585551"
  ink-3: "#6b6763"
  ink-4: "#a7a4a1"
  cilica-glow: "#2563ff"
  rec: "#e23532"
  home-accent: "#fa9524"
  home-accent-text: "#a54c00"
  home-accent-soft: "#ffedd7"
  success: "#007760"
  danger: "#c22826"
  warning: "#846100"
typography:
  hero:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(42px, 6.2vw, 78px)"
    fontWeight: 660
    lineHeight: 1.02
    letterSpacing: "-0.037em"
  headline:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.4vw, 52px)"
    fontWeight: 650
    lineHeight: 1.06
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(19px, 1.8vw, 22px)"
    fontWeight: 620
    lineHeight: 1.3
    letterSpacing: "-0.017em"
  lead:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.6vw, 19px)"
    fontWeight: 430
    lineHeight: 1.6
    letterSpacing: "-0.011em"
  body:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
    letterSpacing: "-0.008em"
    fontFeature: "\"cv05\", \"cv08\""
  small:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    lineHeight: "21px"
  caption:
    fontFamily: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  mono:
    fontFamily: "Geist Mono Variable, Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "13px"
    lineHeight: "21px"
    letterSpacing: "0"
rounded:
  xs: "5px"
  sm: "8px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  window: "16px"
  pill: "999px"
spacing:
  gutter: "20px"
  page: "1200px"
  section-y: "clamp(80px, 10vw, 140px)"
  seam: "112px"
  seam-narrow: "72px"
components:
  button-primary:
    backgroundColor: "{colors.graphite-accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 16px"
  button-primary-lg:
    backgroundColor: "{colors.graphite-accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.lg}"
    height: "48px"
    padding: "0 20px 0 16px"
  button-secondary:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 16px"
  chip:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    height: "26px"
    padding: "0 10px"
  chip-filter:
    backgroundColor: "{colors.glow-soft}"
    textColor: "{colors.glow-text}"
    rounded: "{rounded.pill}"
    height: "26px"
  element-tile:
    backgroundColor: "{colors.graphite-accent}"
    textColor: "{colors.on-accent}"
    size: "32px"
  app-window:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.window}"
  price-card:
    backgroundColor: "{colors.raised}"
    rounded: "22px"
    padding: "24px"
  meeting-island:
    backgroundColor: "{colors.island-bg}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.pill}"
    height: "38px"
    padding: "0 14px"
---

# Design System: Cilica (cilica.si)

## Overview

**Creative North Star: "The Ridgeline Descent"**

The site is a child of the Cilica app's design system (`Cilica/docs/design-system/`: README.md, motion.md, materials.md, tokens.json). The app system is the parent and stays authoritative: its tokens arrive verbatim in `src/styles/tokens.css`, which is copied from the app and is never edited here. Its graphite accent, warm neutrals, Inter / Geist Mono, Lucide icons at a 1.75px stroke, glass rules and spring presets all apply unchanged. This file records only what the site adds on top, and how the site applies the parent in a marketing setting. When this file and the app system disagree about an app token, the app wins.

What the site adds is a place. The page walks down the app's Ridgeline icon. The palette is the app icon's own (`Cilica/apps/desktop/src-tauri/icons/source/icon.svg`): a cream sky, five taupe ridges and an ink base. Warm whites are the everyday grounds; the creams and taupes appear in the hero sky and in the ridges between sections, which walk down the icon (r2, r3, r4, r5) as you scroll; the icon's ink base is the ground for the download and footer. The site is light for everyone; dark exists only when a visitor picks it in the footer. The hero opens on an empty white sky with the words centred; the ridges sit low, behind the app window. There is no sun: the icon has none. The ridges between sections are drawn in canvas as smooth curves at screen resolution. The app's setup window draws them as dithered pixels; the site does not. Nothing on the page is described when it can be shown: product claims are carried by live mocks of the app's opaque sheet, which play once when they scroll into view.

Density is calm and editorial. There is one 1200px column, generous section rhythm, a centred hero and left-aligned section heads. Mocks run at the app's real density (13 to 15px UI type) inside a page that otherwise speaks at marketing scale.

**Key Characteristics:**
- Parent system: Cilica app tokens, springs, glass and icon rules, inherited unchanged.
- Light by default, in the icon's colours: warm-white grounds, cream and taupe ridges, the ink base for the close.
- Dithered canvas ridgelines are the site's only art.
- Colour means what it means in the app: blue is Cilica working, red is recording, amber is Home and the sun, speaker colours are people.
- Mocks are opaque sheets. Glass is only for things that float.
- Motion uses the app springs. Demos play once in view. Reduced motion and reduced transparency are honoured everywhere.

## Colors

Graphite on warm white, with the icon's creams and taupes as the art and its ink as the final ground. Other colour only appears when it means something.

### Primary
- **Graphite** (graphite-accent; dark `#dad7d5`): the app's accent. Used for the primary download button, the selected search example and Cilica's bar in the proof chart. On graphite, text uses on-accent.

### Ridgeline ramp (site addition)
- **Sky / Sky Low** (sky, sky-low; dark `#131110` / `#231a14`): the hero sky, warm white at the top and the icon's cream at the horizon, as a smooth gradient.
- **Ridges 1–6** (ridge-1 … ridge-6; dark `#2e2a26`, `#282421`, `#221f1c`, `#1d1a18`, `#171513`, `#0f0e0d`): the icon's six ridges. They only paint the canvas art (hero layers and the middle ridge of each seam), never a content surface.
- **Section grounds** (band-1 … band-4, band-6): warm whites one step deeper per pair of sections, the icon's cream for Notes and Details, and the icon's ink base (`#1c1a18`) for Close and the footer, whose content switches to dark tokens through `data-theme="dark"` on the inner wrap. Dark mode uses `#221f1c`, `#1d1a18`, `#181614`, `#151312`, `#0c0b0a`. The order is the sidebar section ("Cilica works beside every note.") on band 1; Meetings on band 2; Voices on band 3 (with seam r3); Notes and Details on band 4; Close and the footer on band 6.
- **Per-band secondary ink** (band-2/3/4-ink-2/3): on the deeper grounds, ink-2 and ink-3 are overridden with darker values so secondary text stays at 4.5:1. In dark mode they resolve back to the app's `#b7b4b0` / `#989591`.

### Signal colours (app meanings, site-enforced)
- **Cilica Blue** (cilica-glow; dark `#3b7bff`): only where the assistant is working. Used for the read marker that sweeps lines, the composer glow while working, the search caret, and the input caret. **Glow Soft / Glow Text** (glow-soft, glow-text; dark `#1b2747` / `#8fb2ff`) are its quiet forms: lines being read, a line with an edit waiting for Accept, Cilica-applied search filter chips, wikilinks in Markdown source, and text selection.
- **Recording Red** (rec; dark `#f85452`; island-rec `#f85452`): only for recording. Used for the breathing dot and the island's stop square.
- **Home Amber** (home-accent, home-accent-text, home-accent-soft): the sun in the hero sky, the Home faces tile, and the user's own marks, which the app also draws in amber (tags, jottings, the "Is this Sam?" question chip, the inbox badge).
- **Speaker colours** (app `speaker-1…8` with `-soft`): people only. Used for avatar rings, voiceprints, owners and person nodes in the graph.
- **Success / Danger / Warning**: success is for accepted hunks and the privacy shield. Danger is for deleted text and the delete confirm. Warning is for the "Early build" pill.

### Neutral
- **Canvas / Raised / Sunken** (canvas, raised, sunken): the app's surfaces. Mocks sit on canvas, cards on raised, and wells (hunks, receipts, jots, stages) on sunken.
- **Ink 1–4** (ink … ink-4): text from primary to placeholder. Lines and fills are the app's alpha tokens (`line`, `line-strong`, `fill-hover`, `fill-press`).
- **Island Black** (island-bg, island-ink): true black on every theme, like the meeting pill under a Mac notch.

### Named Rules
**The Meaning Rule.** A signal colour appears only where its app meaning is true: blue means Cilica is working, red means recording, speaker colours mean a person. If it is not that thing, it is graphite or ink.

**The Ridges Are Ground Rule.** Ridge colours paint art and grounds, never buttons, chips or text.

## Typography

**Display and body font:** Inter Variable (self-hosted via Fontsource, optical sizing on, `cv05` and `cv08`), falling back to system UI sans.
**Mono font:** Geist Mono Variable, with tabular numbers, for versions, file sizes, timestamps, Markdown source and jottings.

**Character:** one family doing everything, with fine weight steps (430 to 680) and tight negative tracking at size. It looks confident without becoming loud.

### Hierarchy
- **Hero** (660, clamp 42–78px, 1.02, −0.037em): the single H1, centred, capped at 14ch with balanced wrapping.
- **Headline** (650, clamp 32–52px, 1.06, −0.032em): one per section head.
- **Title** (620, clamp 19–22px, 1.3): card and tile titles. Inline card titles run 16–18px at 600–620.
- **Lead** (430, clamp 17–19px, 1.6, ink-2): the paragraph under a heading, max 54–58ch.
- **Body** (400, 16/26px, ink-2, max 60ch). **Small** (14/21px). **Caption** (500, 12/16px, ink-3).
- **Mock UI** keeps the app's own sizes: 13–15px rows and text, 11–12px meta.

### Named Rules
**The Sentence Case Rule.** Every heading, label and button is in sentence case. Nothing is uppercase, and no heading has a small label above it.

**The One Family Rule.** There is no serif and no second display face on the site. Newsreader belongs to the app's editor and is not used here.

## Layout

There is one centred column, 1200px wide (`--page`), with a gutter of at least 20px that respects safe-area insets. Sections are full-bleed bands with vertical padding of clamp(80px, 10vw, 140px). A section head (max 760px, 18px gap) is followed by its content after clamp(40px, 6vw, 72px). Content is mostly asymmetric two-column grids (5/7, 7/4, 1/1, 4/7) that collapse to one column between 860 and 960px. Details is a plain two-column run (Home faces full width on top) that becomes one column at 760px. In the hero app window the sidebar drops at 1080px and the window stacks at 760px. The nav links hide at 900px, and the GitHub button at 480px. The hero heading starts below the nav (64px) by `clamp(56px, 6vw + 6svh, 200px)`: about 74px on a phone, 120px on a 1280×720 laptop, 140px at 1440×900 and 160px on a large desktop, in line with comparable product sites (Obsidian 96px, Reflect about 157px, Linear 199px, Granola 218px at 1710×986). Seams are 112px tall, or 72px below 760px. They overlap the top of each band and sit under its content.

## Elevation & Depth

Depth comes from material and the app's four shadows, never from inner light. Surfaces are opaque sheets with a 0.5px `line-strong` hairline (an `inset 0 0 0 0.5px` ring), plus `shadow-xs` at rest. Hover lifts a surface to `shadow-float`. Showcase objects that represent app windows or dialogs (the app window, the confirm card, the palette, the price card) carry `shadow-overlay`.

### Shadow Vocabulary
- **shadow-xs**: controls and cards resting on a band (secondary button, the kbd base).
- **shadow-sm**: primary button, selected segment thumbs, diff card, person card.
- **shadow-float**: hover lift, glass controls, the island.
- **shadow-overlay**: the app-window sheet and dialog-like showcase cards.

### Named Rules
**The Glass Floats Rule.** Glass (`glass` or `glass-strong`: translucent fill, 20 or 32px blur at 180% saturation, 0.5px `glass-edge`, `shadow-float`) is only for floating controls: the nav once you scroll, toasts, the command palette and the thesaurus popover. Mocks and cards are opaque. Under reduced transparency, glass becomes `bg-raised` with no blur.

**The No Inner Light Rule.** No `inset 0 1px 0` highlight and no inner glow on any surface. Cilica's blue glow is outside the element (the marker and composer underglow) and only appears while Cilica works.

## Shapes

Corners are the app's soft radii, multiplied by `--sq`, which is 1.45 where `corner-shape: squircle` is supported (the `.sq` class opts an element in). Buttons are 9, 12 or 14px. Cards and tabs are 14–16px. Showcase cards are 20–22px. Chips, the capsule, toasts and the island are pill-shaped. Avatars and dots are circles. Hairlines are 0.5px.

## Components

### Buttons
- **Shape:** gently rounded (12px × sq; lg 14px, sm 9px, xs 8px). Heights are 40 / 48 / 30 / 26px, with 15px type at weight 560.
- **Primary:** a graphite fill with on-accent text and shadow-sm. Hover uses accent-hover. Pressing scales it to 0.97 on the snappy spring.
- **Secondary:** a raised fill with a 0.5px line-strong ring and shadow-xs. Hover lifts it 1px to shadow-sm.
- **Ghost:** transparent with ink-2 text. Hover adds a fill-hover wash.
- **Cursor:** links (anything that navigates, including link-styled buttons such as GitHub and Download) show the pointer; buttons and in-page controls (chips, pills, segments, checkboxes, demo actions) keep the default arrow, as in the app and per the CSS UI spec; draggable graph nodes use grab / grabbing. Never set `cursor: pointer` on a button; hover feedback comes from the fill, lift or wash.
- **Icon one-shots:** trailing arrows nudge (translateX 3px), lift (2px, −2px for external links) or drop (2px down for downloads) on hover.

### Download button (signature)
The primary action. It detects the OS (userAgentData, then platform), and is server-rendered as macOS so hydration never shifts layout. The Apple, Windows and Linux marks swap on the bouncy spring, and the label crossfades on the smooth spring. A `cilica:os` event lets other controls pick the OS. On mobile it links to `#download` and explains that Cilica is a desktop app. The optional meta line gives platform terms and a mono file size from the release. Windows and Linux carry an amber "Early build" pill in the download list.

### Nav
A fixed bar, 54px high, at most 1200px wide, inset 10px from the top. It is transparent at rest and becomes `glass-strong` after 12px of scroll. It holds the app icon and the word "Cilica", three section links (Features, Meetings, Pricing; 14px, ink-2), a fill-hover wash that slides under the hovered link on the snappy spring, a GitHub ghost button and a small Download.

### App icon
The brand mark is the app's own icon (`Logo.astro`, copied from `Cilica/apps/desktop/src-tauri/icons/source/icon.svg`): six ridges on a cream sky in a rounded square. It is used in the nav (28px), at Close (64px), in the footer (24px), as the favicon, the touch icon and in the OG card. It does not change in dark mode.

### App window mock (signature)
The app's opaque sheet on canvas, with the window radius, shadow-overlay and a 44–48px title bar with grey traffic lights. The hero version has three columns (220px sidebar on sunken, note, 340px Cilica panel) at 640px tall. It plays Cilica's turn once in view: the read marker sweeps, steps tick, a diff card proposes, Accept runs, a receipt appears, and a glass Undo toast springs in.

### Diff hunks and receipt
The diff card is raised, 14px × sq, with a hairline. Hunks sit on sunken at 10px. Deleted text is danger on danger-soft, struck through. Inserted text sits on accent-soft. Hunks are accepted one by one, and accepted hunks turn success. Rejected hunks drop to 0.55 opacity with the insert struck. The receipt ("What changed") is a sunken well listing rows, with an Undo row under a hairline.

### Meeting scene, island, transcript lines
The meetings section shows Cilica's transcript as a card at the back (480px high, 18px × sq, no header or badge, only the lines), with the call floating over its top-right corner like a picture-in-picture window: 248px wide, raised, shaped like a compact call window: four video tiles (4:3, 12px × sq corners, a soft gradient in each speaker's colour with the avatar on a raised disc) in a 6px frame with 4px between them, names in a small frosted chip on the video with a crossed mic for anyone muted, and a footer holding "Zoom" on the left and round mic, camera and red end-call buttons on the right (`--on-rec` is the white icon on red, in both themes). There is no title bar. Both follow the page theme. Whoever is talking gets a 2px inset ring in their speaker colour, a face that grows to 1.08 on the smooth spring, and a level meter in place of the crossed mic. The ring lands about 260ms before their first word, as a transcript trails speech. Each transcript line has a 24px avatar in the same colour, the name at 600 and a mono timestamp that keeps counting. Words arrive one at a time, paced by word length, and each fades up 3px over 420ms, so the newest few trail off softly, and anything that makes the transcript taller (a new line, or a line wrapping as words arrive) slides it up on the smooth spring instead of jumping; the slide is measured on the newest line, since dropping the oldest line would otherwise cancel it out. The floating call uses `--shadow-pip`, a slightly lighter shadow-overlay. It is one meeting that never ends: eight lines go round and the timestamps keep counting. It starts mid-meeting with the card already full of finished lines, so the transcript runs the whole height and fades out softly at the top edge (40px). It pauses off screen, and under reduced motion it stays on that full still frame. On phones the call shrinks to a 184px window in the same corner with smaller faces, chips and buttons. The heading and lead sit to the left (5fr to 7fr, stacked under 960px), with nothing else beside them. The meeting island is true black, 38px, and widens on the bouncy spring to show the title. The shared `.tl` transcript lines (used by the voices demo) use a 32px avatar column.

### Person card and proof chart
The person card is raised, 16px × sq, with a hairline, a 44px speaker-ringed avatar and a voiceprint of bars in the speaker colour. Its empty state is a ghost outline. The proof chart is a raised figure, 20px × sq. Bars scale in from the left on the gentle spring when the chart is in view. Cilica's bar is graphite and the comparison is ink-4.

### Palette, chips and keys
The command palette is glass-strong, 20px × sq, with shadow-overlay, a 56px query row and a blinking blue caret. Filter chips that Cilica applies use glow-soft with glow-text. Chips are 26px pills on fill-hover. Keys (kbd) are 22px raised squares with a hairline and a 1px base line.

### Details run
No cards. Each detail is a canvas well (220px, 18px × sq, hairline) with a 17px title and one plain sentence under it. Nothing depends on hover: coins drop into the jar and the call pill opens once, when the item scrolls into view. Home faces runs full width on home-accent-soft. "Bring your own models" replaced the old provider-picker section (user, 23 Nov). The well is its only surface (no panels inside it, per the user): two labelled rows of 30px pills on fill-hover, "Cilica's AI model" (Anthropic, OpenAI-compatible, Ollama; the user asked for "AI model" here) and "Transcription" (Whisper, Soniox, Deepgram, AssemblyAI, OpenAI). Each pill has a key icon for a service used with your own key or a screen icon for one on your computer. Clicking chooses one per row, the chosen pill fills in accent ink, and one line underneath says where the two choices run ("Whisper runs on your computer, Anthropic with your own key."). It pairs with the keyboard item, now an ordinary well with its keys in one column; both wells are 256px. On phones the well grows to fit the wrapped pills. The toasts and "Small and quick" tiles were dropped (the speed numbers now sit in the free card, next to the download).

### Price card
Raised, 22px × sq, with shadow-overlay and 24px padding. It holds the app icon, "Free" with "The whole app, open source under the AGPL.", the download button, the speed facts (opens in under 1 s, under 150 MB at rest) and the owner's promise that a later paid plan only adds features and takes nothing from Free. No eyebrow, no "$0 forever", no checklist (removed in the 23 Nov slop audit). Download rows per OS sit under it. It is built so a paid tier can sit beside it later.

### Motion (site application of the app springs)
The springs are the app's own: snappy 0.2s / 0.15, smooth 0.3s / 0.1, bouncy 0.35s / 0.3, gentle 0.45s / 0 (`src/islands/springs.ts`), and the same curves as CSS `linear()` easings in `site.css`. Only transform and opacity animate, except where the app itself animates grid tracks and radius for morphs.
- **Reveal is translate-only.** Content is fully visible before JS runs. `[data-reveal]` settles 12px up on the gentle spring once, with no fade from zero.
- **Demos run once when in view** (`useInView … once`). The hero demo (`AppDemo.tsx`) is the one assistant demo: you ask, a marker sweeps what Cilica reads, and a diff card waits with one hunk per edit. So it keeps playing, each hunk's Accept fills over 1.5 s and accepts itself; Accept, Reject and Accept all stay clickable, and the caption says that in the app nothing changes until you accept. The section below the hero ("Cilica works beside every note.", no shortcut shown) is Cilica's panel drawn the way the app draws it: title bar with back, title, "Working · N s" and its icons; steps that shimmer then settle with a chevron; Edit and Merge proposal cards whose main button fills and presses itself, after which the card's footer reads "Accepted" (or "Merged") with an Undo button beside it; a request with nothing to approve ends with Cilica saying what it did and an Undo button under that line. There is no "What changed" card in this mock. Then the composer glow. Sending works like a chat: the composer empties at once, the send button gives, the resting screen fades and the bubble rises 16px into place on the smooth spring; anything added below slides the thread up instead of jumping. It loops forever through six requests (sort, action items, a question, clean up, summarise, merge), pauses while off screen, and shows a still frame under reduced motion. A list beside it names the six and lights the running one; clicking a request cuts the current turn short and plays that one, and the loop carries on from there. Headings and labels always start with a capital, so shortcuts go in the sentence under a heading, never first in it (the search heading is "Search that understands what you mean", with "Press ⌘ K…" under it). Meetings follows directly so the transcription feature is the second thing a visitor meets. The guards are one Details item: the Trash card with working Keep / Move to Trash / Undo. The art is still between scrolls; the scroll parallax repaints once per frame, only for canvases on screen.
- **Reduced motion:** demos jump to their end state, the canvases draw once and stay still, the shimmer becomes static ink-3, the rec dot and meters stop, and transitions become 120ms linear.
- **Reduced transparency:** glass becomes opaque raised.

### Dithered ridgelines (signature art)
These are drawn in `src/scripts/ridgeline.ts` as smooth filled curves at the device pixel ratio (capped at 2), with no dither. The hero sky has four ridge layers (haze, ridge 1, ridge 2, band 1 in front), with the horizon pinned 150px below the app window's top edge so nothing is drawn behind the words. There is no sun, cloud or star; the icon has none. Each seam draws the band above, then one icon ridge (r2, r3, r4, r5 going down the page), then this band in front. All colours are read from CSS tokens, so the art repaints on theme change.

## Do's and Don'ts

### Do:
- **Do** treat the Cilica app design system as the parent. Take every app token from `tokens.css` (copied, never edited), and add site tokens only in `site.css`.
- **Do** put each section on its band ground in descent order, and set the band's secondary-ink overrides on bands 2 to 4.
- **Do** keep the site light by default (`data-theme="light"` on the root); dark only from the footer toggle.
- **Don't** use cream as a common ground (warm whites are the everyday grounds; cream is for the art and one section), or put art behind the hero words.
- **Do** show behaviour with an opaque app-sheet mock that plays once in view and lands on its end state under reduced motion.
- **Do** use the app springs for anything that moves, and translate-only reveals.
- **Do** write in sentence case with plain verbs and second person. Call the assistant "Cilica". State facts concretely (versions, sizes, where data lives).
- **Do** keep every shipped raster traceable. `public/og.png` and `public/apple-touch-icon.png` are rendered by `scripts/og.ts` from SVG drawn in code, with Inter (OFL, `scripts/fonts/Inter-LICENSE.txt`). `public/logos/*` are third-party app logos copied from the Cilica app repo's import catalogue, used nominatively to name import sources. No other rasters ship.

### Don't:
- **Don't** use Cilica blue for anything that isn't Cilica working, red for anything that isn't recording, or speaker colours for anything that isn't a person.
- **Don't** put glass on a mock, card or section. Glass is for floating controls only.
- **Don't** add inner light (`inset 0 1px 0 …`) or inner glows to any surface.
- **Don't** fade content from zero opacity on reveal, or loop a demo forever.
- **Don't** use ridge colours on controls or text, or add art other than the ridgelines.
- **Don't** use emoji, "Success!", uppercase labels or small labels above headings. Don't call the assistant "AI" outside category or SEO needs.
- **Don't** edit `src/styles/tokens.css`. Change the app's `tokens.json` and copy it over.
- **Don't** treat these detector findings as defects. Both are kept on purpose:
  - The bouncy spring's overshoot (bounce 0.3) is the app's own preset in `motion.md`, reserved for the same morphs it drives in the app: the island expanding, the toast and the OS-logo swap.
  - The shimmer gradient text is the app's "Cilica is working" loading label (README: loading crossfades to a shimmer label; `motion.md`: linear timing is allowed for the shimmer). It appears only on a running step of Cilica's turn and on the capsule's "Writing notes…" after Stop (as in `motion.md`), and becomes static ink-3 under reduced motion.
