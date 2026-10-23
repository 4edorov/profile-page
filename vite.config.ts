import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";

const DEV_SITE_URL = "http://localhost:5173";

export default defineConfig(({ mode }) => {
  const siteUrl = loadEnv(mode, process.cwd(), "").SITE_URL;
  return {
    plugins: [requireSiteUrl(siteUrl), tailwindcss(), reactRouter()],
    resolve: { tsconfigPaths: true },
    define: {
      "import.meta.env.SITE_URL": JSON.stringify((siteUrl || DEV_SITE_URL).replace(/\/+$/, "")),
    },
  };
});

/** Canonical, hreflang and sitemap URLs are absolute, so a real build needs the public origin. */
function requireSiteUrl(siteUrl: string | undefined): Plugin {
  return {
    name: "require-site-url",
    apply: "build",
    buildStart() {
      if (!siteUrl) {
        this.error("SITE_URL must be set for builds, e.g. SITE_URL=https://example.com pnpm build");
      }
    },
  };
}
