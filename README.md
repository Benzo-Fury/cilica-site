# cilica.si

The landing page for [Cilica](https://github.com/Benzo-Fury/cilica), a private, local-first notes app. Live at [cilica.si](https://cilica.si).

Built with [Astro](https://astro.build) (static output) and React islands.

## Develop

```bash
bun install
bun run dev      # http://localhost:4321
bun run build    # static site in dist/
bun run check    # typecheck
```

## Deploy

Pushes to `main` build and publish to GitHub Pages via `.github/workflows/deploy.yml`. The custom domain is set by `public/CNAME`.
