# DraconDex-PGI-AINative

Read-only reference plugin for [DraconDex](https://github.com/ZYDRAXYL/DraconDex-APP).
It publishes `catalog.json` — a small, hand-maintained JSON file describing
what DraconDex is and what `window.pluginApi` lets a plugin do — so the three
AI chat plugins (Claude, Codex, Ollama) can fetch it over plain HTTPS and fold
a summary into their system prompt. It declares no tables and no permissions;
there is nothing here that touches user data.

Full background, the `catalog.json` schema, and the manifest are documented
in [README.md](README.md) — read that first for anything not covered below.

## Source of truth: `catalog.json`, not `catalog.js`

- `catalog.json` is the real, single source of truth. It is what the sibling
  plugins fetch from `raw.githubusercontent.com`, and what CI validates.
- `catalog.js` is a **hand-kept duplicate** of the same content as
  `window.CATALOG = {...}`, needed only because this plugin's own window is
  loaded over `file://`, and Chromium refuses `fetch()`/`XHR` outright for
  that origin (not a CORS issue — a hard block). It exists solely so
  `index.html`/`app.js` can render the catalog for a human.
- **Whenever you edit `catalog.json`, regenerate `catalog.js` to match**, then
  restore the explanatory comment at the top of `catalog.js` by hand (it is
  not part of the generated assignment). The regeneration one-liner is in the
  README's Developing section. `scripts/check-catalog-sync.mjs` fails CI if
  the two ever drift apart — run it locally before committing.

## Structure

| File | Purpose |
| --- | --- |
| `dracondex-plugin.json` | Manifest: id `ai_native`, files only — no tables, no panels, no permissions. |
| `catalog.json` | The published catalog (source of truth). |
| `catalog.js` | Hand-kept copy of `catalog.json` as `window.CATALOG = {...}` — see above. |
| `index.html` + `app.js` | Renders `window.CATALOG` for a human. |
| `style.css` | Mirrors the app's dark theme tokens. |
| `tools/validate-manifest.mjs` | Local manifest check running the app's own `validateManifest()`. Not shipped (not in manifest `files`) |
| `tools/plugin-manifest.cjs` + `plugin-contract.lock.json` | That function: DraconDex-EXE's `plugin-manifest.js`, vendored byte-identical at a pinned release. Never hand-edit; move the pin with `node tools/plugin-contract.mjs --vendor --ref vX.Y.Z`. |
| `tools/plugin-contract.mjs` | Checks the vendored copy; `--upstream` says whether DraconDex moved past the pin. |
| `scripts/check-catalog-sync.mjs` | Fails if `catalog.js` and `catalog.json` disagree. Not shipped. |
| `scripts/print-catalog.mjs` | CLI viewer; `--preamble` prints the exact model-facing summary a chat plugin computes. Not shipped. |

Only paths listed in `dracondex-plugin.json`'s `files` are ever downloaded by
an installing user — scripts, README, and CI cost nothing.

## Commands

```bash
node tools/validate-manifest.mjs          # the app's own rules (vendored), first error first
node tools/plugin-contract.mjs            # the vendored copy matches plugin-contract.lock.json
node --check app.js catalog.js scripts/print-catalog.mjs
node scripts/check-catalog-sync.mjs       # run after editing catalog.json
node scripts/print-catalog.mjs            # CLI view of the catalog
node scripts/print-catalog.mjs --preamble # the model-facing preamble text
```

CI (`.github/workflows/validate.yml`) runs all of the above on every push/PR.
No dependencies to install — everything is plain Node 20, no build step.

## Conventions

- No user data, no tables, no network permissions declared — keep it that
  way; this plugin's entire value is being safe to auto-install as a
  dependency of the three chat plugins.
- `catalogVersion` and `updated` in `catalog.json` are bumped by hand when
  content changes; consumers cache the file, so don't expect them to
  re-fetch on every use.
- Treat rendered content as data: use `textContent`, not `innerHTML`, in
  `app.js`.
