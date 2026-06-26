# Denker Landing

Standalone Next.js app for the public Denker marketing site. This repo slice is safe to share with designers because it does not include the product app, backend, companion, or deployment secrets.

## Local Development

```bash
bun install
bun dev
```

Open `http://localhost:3000`.

## Build Check

```bash
bun run build
```

## Standalone Preview Deploys

The app can be deployed as its own Vercel project for designer testing.

Recommended Vercel setup:

- Framework preset: `Next.js`
- Build command: `bun run build`
- Install command: `bun install`
- Output directory: leave default
- Production domain: do not attach `denker.ai` or `www.denker.ai` for designer previews

Required only when the corresponding feature is enabled:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `RESEND_API_KEY`
- `RESEND_FULL_ACCESS_API_KEY`
- `RESEND_AUDIENCE_ID`
- `BROADCAST_SECRET`

For designer preview deploys, leave the Resend and broadcast variables empty unless you are using a test Resend audience/key. Do not put production email credentials in preview projects; otherwise preview signups can write to the production audience and `/api/broadcast` can create/send production broadcasts.

Do not commit `.env`, `.next`, `node_modules`, `.vercel`, `next-env.d.ts`, or `*.tsbuildinfo`.

## External Connections

This app compiles without the main Denker repo. Runtime links intentionally point to production services:

- Product app: `https://space.denker.ai`
- Desktop update manifest: `https://updates.denker.ai`
- Public marketing origin: `https://www.denker.ai`

Designer preview deploys should keep those URLs as-is unless they are explicitly testing a different environment.

## Merge Back Into Monorepo

Keep this app as a subtree of the main repo under `landing/`.

Preferred path when `git subtree` is available:

```bash
git remote add landing git@github.com:Denker-AI/denker-landing.git
git subtree pull --prefix=landing landing main --squash
cd landing && bun run build
```

If the remote already exists, skip `git remote add`.

If `git subtree` is not installed, use a clean overlay import from a temporary clone:

```bash
tmpdir=$(mktemp -d)
git clone --depth=1 git@github.com:Denker-AI/denker-landing.git "$tmpdir/landing"
rsync -a --delete \
  --exclude .git \
  --exclude .env \
  --exclude .next \
  --exclude node_modules \
  --exclude .vercel \
  --exclude next-env.d.ts \
  --exclude '*.tsbuildinfo' \
  "$tmpdir/landing/" landing/
cd landing && bun run build
```

Review the resulting diff in the main repo before committing and deploying.
