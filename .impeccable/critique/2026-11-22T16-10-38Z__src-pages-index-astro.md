---
target: whole landing page, AI slop
total_score: 21
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 4
target_identity: "file:/Users/neo/Documents/Projects/cilica-site/src/pages/index.astro"
target_fingerprint: "sha256:41112f40fb7bbe897f51bac9af85fdeb6b54ecd29320615dabdaf933bc49a85b"
target_path: /Users/neo/Documents/Projects/cilica-site/src/pages/index.astro
timestamp: 2026-11-22T16-10-38Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review · B: detector + browser)

Score 21/28 (Good). n/a: 7, 9, 10. 1:3 2:4 3:3 4:3 5:3 6:3 8:2.

Verdict: demos are authored; slop is in the connective tissue (headers, side bullet lists, Details bento, pricing card).

Priority issues
- [P1] Pricing block reads as a SaaS template (Close.astro): Pricing eyebrow, "No account, no trial, no limits.", "$0 forever", "Everything is included" checklist. User asked for a pricing-page shape; keep the card, strip the tropes.
- [P1] Slogan-fragment H2s: "Your model. Your transcripts." (Yours), "Written in Markdown. At home in Obsidian." (Notes).
- [P1] Icon + title + blurb lists restating demos (Meetings points, Yours facts); "open source" said four times plus a second GitHub button.
- [P1] Details bento mosaic: most AI-recognisable layout; jar/pill/toast tiles mostly empty, hover-only on touch; writerly lead.
- [P2] Hero fine print overstates platforms (Windows/Linux are early builds); "no bot in the room" tagline repeated 3x; "Works with" chip strip; "You pay them, not us."; everything autoplays at once.
- [P2] Detector: skipped heading (mock h3 after h1), 8px mock avatar initials, grey-on-brown contrast hit on a p (unlocated), 7px text sections.css:219.
- [P3] Dark theme loses the ridgeline seams; proof chart Cilica bar not blue.

Detector: CLI 45 (22 font-size + 21 radius advisories, mostly app-mock sizes; bounce-easing and gradient-text are false positives). Browser 13 (nested-cards x5 false positives from app mocks).
