## Working in this repo

- **Done** means `pnpm check` passes. With no CI, it is the only gate before deploy.
- **Git hooks**: pre-commit runs `pnpm check`; pre-push rejects a branch over 500 changed lines against `origin/main` (`pnpm-lock.yaml` excluded). Never bypass any hook (`--no-verify`, `HUSKY=0`); fix what fails.
- **PR size**: split work over 500 lines into sequential PRs, each merged before the next branch is pushed; don't stack branches, since each is measured against `origin/main`. If it can't be split sensibly, stop and ask the owner.
- **Both Languages**: write every UI String and Profile Content change in `en` and `ru`, properly translated. The parity checks only catch missing keys and mismatched shapes.
- **Comments**: none, except a one-line _why_ the code can't say (a non-obvious constraint, workaround or hazard): keep one only if a sensible edit made without it would break something. No _what_ comments, JSDoc or pointers. Tool directives (`eslint-disable`, `@ts-expect-error`, `/// <reference>`, `@vitest-environment`, `# shellcheck`) are exempt; an `eslint-disable` still needs its why.
- **Adding a Page**: follow "Adding a Page" in `README.md`.
- **Deploy**: `pnpm run deploy` publishes to the live site. Leave it to the owner.

## Agent skills

### Issue tracker

GitHub Issues on `4edorov/profile-page`, managed with `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

Before you explore code or name a domain concept (in code, tests, issues or PRs), read `GLOSSARY.md` and the ADRs in `docs/adr/` that touch the area. See `docs/agents/domain.md`.
