## Working in this repo

- **Done** means `pnpm check` passes. With no CI, it is the only gate before deploy.
- **Pre-commit hook**: runs `pnpm check`. Never bypass it (`--no-verify`, `HUSKY=0`); fix what fails.
- **Both Languages**: write every UI String and Profile Content change in `en` and `ru`, properly translated. The parity checks only catch missing keys and mismatched shapes.
- **Adding a Page**: follow "Adding a Page" in `README.md`.
- **Deploy**: `pnpm run deploy` publishes to the live site. Leave it to the owner.

## Agent skills

### Issue tracker

GitHub Issues on `4edorov/profile-page`, managed with `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

Before you explore code or name a domain concept (in code, tests, issues or PRs), read `GLOSSARY.md` and the ADRs in `docs/adr/` that touch the area. See `docs/agents/domain.md`.
