import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // `PAGE_PATHS` is internal to `shared/routing` plus the route tree, so
    // `routes.ts` imports it from `shared/routing/pages` directly. Steiger has
    // no inline ignores, so the whole file is exempt. See docs/adr/0004-feature-sliced-design.md.
    files: ["./src/app/routes.ts"],
    rules: { "fsd/no-public-api-sidestep": "off" },
  },
]);
