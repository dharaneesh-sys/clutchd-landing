# ClutchD Landing — Issues

## 2026-08-13
- (none yet)

## 2026-08-14
- Netlify git integration NOT connected: `netlify api getSite` → `build_settings.repo_url=None`, `provider=None`. All deploys are CLI-based (`netlify deploy --prod --dir dist`); a push to origin/main triggers GitHub Actions CI but NOT a Netlify deploy, so there are no git-backed deploy records or per-PR preview deploys.

## 2026-08-15
- Tried to connect via the Netlify API (updateSite): `build_settings` is **silently ignored** on PATCH for a site created CLI-only; the legacy `repo` object persisted `provider=github` + `repo_url` but left a **broken link** — Netlify tried to clone over SSH ("Host key verification failed"), created no GitHub webhook (`repo_hooks` 404), and produced an errored deploy. Unlinked again via `unlinkSiteRepo` (site restored to clean CLI-deploy state; confirmed `provider=None`). CONCLUSION: the public API cannot complete a git link for an existing CLI-created site — the GitHub App install + webhook registration is dashboard-only.
- Unblock (one-time, dashboard): https://app.netlify.com/sites/clutchd-193/configuration/build-and-deploy → Continuous deployment → Repository → **Link repository** → pick `dharaneesh-sys/clutchd-landing` (branch main). netlify.toml already sets build command `npm run build` + publish dir `dist`, so it just works. Verify after connecting: `netlify api getSite` shows `repo_url` populated, and a push creates a deploy record.
