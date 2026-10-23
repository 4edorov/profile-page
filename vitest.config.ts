import { defineConfig } from "vitest/config";

// Separate from vite.config.ts: the React Router plugin must not run under Vitest.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  define: {
    "import.meta.env.SITE_URL": JSON.stringify("https://example.com"),
  },
  test: {
    include: ["tests/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
  },
});
