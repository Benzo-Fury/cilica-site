# Surface brief: cilica.si home

Mode: persuade. Single page. Structure A (ridgeline descent), chosen by the user on 2026-11-21.

## Direction contract

THESIS: The page walks down Cilica's Ridgeline icon, from an empty warm-white sky down the icon's ridges to its ink base, and every step down shows the product working rather than describing it. It refuses the category default of a serif-on-paper hero over a row of equal feature cards.

OWN-WORLD: The app's warm graphite tokens and Inter, in the app icon's colours: warm-white grounds, cream and taupe ridges walking down the icon between sections, and the icon's ink base for the close. The ridge edges between sections are smooth curves drawn in canvas (not pixelated; the user asked for smooth on 23 Nov). Colours keep app meanings: Cilica blue only where the assistant works, red only for recording, amber for the sun and Home faces, speaker colours for people. Mocks are the app's opaque sheet; glass only on floating controls.

STORY: The visitor sees the assistant edit a real note in the hero and approve it, learns every change is guarded, sees a call become a note without a bot, sees voices learned, recognises plain Markdown they can take anywhere, smiles at the details, descends into night where their machine, model and keys are theirs, and downloads on the ink foreground.

FIRST VIEWPORT (revised 2026-11-21, "Horizon"): Warm-white sky with nothing behind the words. Centred: version chip, H1 "Notes that tidy themselves.", a one-sentence lead, Download (OS-detected) with a plain "View the source" link, and one quiet line "Free and open source. For Mac, Windows and Linux." Below, the app window playing Cilica's turn, rising out of low dithered ridges with a small sun on the far ridge.

FORM: Ridgeline descent, my 5th of 7 ranked structures, dealt by seed c19c00c3.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Section outline

0. Hero (sky): headline, lead, download, source, a fine-print line ending in a version link (the "What's new" pill was removed as AI-looking, 23 Nov), app window playing Cilica's turn (marker sweep, steps, diff card, Accept, receipt).
1. Cilica works beside every note (band 1), no shortcut shown, list items play on click (user, 23 Nov): Cilica's panel drawn like the app, looping forever through six example requests, beside a list that lights the running one (user, 23 Nov: "Build this", "look similar to the actual app", "infinite loop", shortcut beside the heading like the ⌘ K search). Replaced the tier cards and then the static panel + list.
2. Meetings transcribed. (band 2, seam r2): the transcript as a card at the back with a floating picture-in-picture call over its corner (four people, the speaker gets a ring in their colour, their words land in the transcript in the same colour). One endless meeting, no app switching, no badge. The heading and lead sit beside it, and it follows the page theme. No side sentences, no icon bullet list, no app chips.
3. (Removed 23 Nov: the provider picker section became a Details item at the user's request.)
4. Voices (band 3, seam r3): "Is this Sam?", saved person with voiceprint, proof chart 94–99% vs Soniox 76–92%.
5. Markdown notes that open in Obsidian (band 4, seam r4): graph replay, Cmd+K plain-language search with chips, import from 46 apps.
6. Details (band 4): a plain two-column run, no cards or hover tricks: Home faces, Cilica asks before it deletes, swear jar, meeting pill, thesaurus, bring your own models, keyboard. Real screenshots are left out until fresh ones exist: the repo's are 640x400 and still say "Margin".
7. Close (ink, the icon's base): "Free for everyone." and one Free card (no eyebrow, price or checklist; a paid plan may come later and never takes from Free, per the owner), download per OS, other downloads, changelog, footer.

## Decisions taken for the user

- Top three after the hero (user, 22 Nov): the assistant, meetings as linked notes, then your own model and transcription or fully local. Guards folded into the assistant section; headers kept short and plain.

- Headline: "Notes that tidy themselves." (23 Nov: "with your say-so" and the lead's "shows you every change" dropped; the user wants the hero to say what Cilica does, and the asking-first behaviour stays a feature shown further down.)
- Download sizes come from the GitHub release at build time. "Under 20 MB" is not used: the 0.10.0 dmg is 21.9 MB.
- Windows and Linux are labelled "Early build" (README: written but not yet tested). Mac is Apple silicon only.
- Import count: 46 apps plus plain files (providers.ts).
- Swear jar: kept in Details, worded for work.
- Fonts self-hosted (no Google requests). Analytics: optional Plausible via PUBLIC_PLAUSIBLE_DOMAIN, off by default. No cookies. Not deployed.
- Palette (user, 2026-11-21): the app icon's colours. Warm whites (#fffdfa to #f8f4ee) as common grounds, the icon's cream for Notes and Details, cream and taupe ridges between sections, the icon's ink base (#1c1a18) for Close and footer. No sun. Light for everyone; dark only from the footer toggle. (Stone greys were tried and rejected as bland.)
- Hero (user, 2026-11-21): "Horizon" chosen over Editorial and Framed drafts to cut clutter; clouds and stars removed.
- Notes copy says notes are Markdown that imports from and exports to Obsidian; notes are stored in SQLite (spec), so the page doesn't claim plain files on disk.
- Slop audit (23 Nov, dual-agent critique, 21/28): removed the version pill, pricing tropes, slogan-fragment headings, icon bullet lists beside demos, repeated "open source" and the second GitHub button, the bento mosaic; made the hero mock's note title a paragraph, raised mock avatar text to 9px, started the meeting demo mid-call.
