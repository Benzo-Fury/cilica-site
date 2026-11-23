import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://cilica.si",
  integrations: [react(), sitemap()],
  build: { inlineStylesheets: "auto" },
  prefetch: false,
  devToolbar: { enabled: false },
});
