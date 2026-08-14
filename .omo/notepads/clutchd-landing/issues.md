# ClutchD Landing — Issues

## 2026-08-13
- (none yet)

## 2026-08-14
- Netlify git integration NOT connected: `netlify api getSite` → `build_settings.repo_url=None`, `provider=None`. All deploys are CLI-based (`netlify deploy --prod --dir dist`); a push to origin/main triggers GitHub Actions CI but NOT a Netlify deploy, so there are no git-backed deploy records or per-PR preview deploys. Unblock (one-time, dashboard): Netlify → Site config → Build & deploy → Git → connect `dharaneesh-sys/clutchd-landing` (netlify.toml already sets build command `npm run build` + publish dir `dist`, so it just works). Verify after connecting: `netlify api getSite` shows `repo_url` populated, and a push creates a deploy.
