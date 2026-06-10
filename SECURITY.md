# Security Notes

## Resolved in CI

- **Ruff lint**: unused imports removed, ambiguous variable renamed, code formatted
- **Safety audit**: fixed duplicate `cd backend` path bug in GitHub Actions
- **Dependencies**: Expo 52.0.49, React Native 0.76.9, Vite 6.4.2, npm overrides for tar/postcss/uuid

## Known transitive advisories (Expo SDK 52)

Some `npm audit` findings come from `@expo/cli` internals (`@expo/plist@0.2.2` → `@xmldom/xmldom@0.7.13`, `tar@6.x`). These require **Expo SDK 53+** to fully resolve without overrides.

Dependabot is configured (`.github/dependabot.yml`) to propose weekly updates.

Run `npm audit` locally to review. Do **not** run `npm audit fix --force` without testing — it may jump to Expo 56 (breaking).
