import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // `routes.ts` reads the internal `PAGE_PATHS` directly, and Steiger has no inline ignores (ADR 0004).
    files: ["./src/app/routes.ts"],
    rules: { "fsd/no-public-api-sidestep": "off" },
  },
]);
