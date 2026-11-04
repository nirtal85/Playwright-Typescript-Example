---
name: setup-env
description: Use when setting up a fresh checkout of Playwright-Typescript-Example or diagnosing missing pnpm dependencies, Playwright browsers, environment settings, or display support before tests.
---

# Setup environment

Run from the repository root. Use the package manager declared in `package.json` and preserve the lockfile and existing local configuration.

## Install

Inspect `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and `.github/workflows/devRun.yml`.
Use a current Node.js LTS release supported by the pinned pnpm (CI uses `lts/*`).
The repository currently declares `pnpm@11.9.0`; re-read that field before setup if it has changed.

```bash
node --version
corepack enable
corepack prepare pnpm@11.9.0 --activate
pnpm --version
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

If Corepack is missing, install it using https://pnpm.io/installation or use that page's supported method for the exact pinned pnpm version. Do not switch to npm/yarn or create another lockfile.
On Linux with missing shared libraries, use `pnpm exec playwright install --with-deps chromium`
with appropriate system package-manager privileges.
The installed Playwright package selects the browser revision; do not copy an arbitrary Docker image version.
Preserve the checked-in dependency build policy in `pnpm-workspace.yaml`.

## Configure

Inspect `playwright.config.ts` and the selected tests for required configuration.
The repository has no `.env.example`.
If a local `.env` is needed, create it only when absent and confirm it is ignored by Git.
Preserve existing values; populate credentials privately from user-provided values.

`DOMAIN` selects logical environment behavior (default DEV), while `BASE_URL` is read by relevant tests/fixtures.
Choose an intended application URL matching the page objects before execution.
Database, SFTP, visual regression, and other service credentials are needed only for tests using those integrations.
Do not invent tokens or run the complete suite merely to check installation.

## Verify

Check TypeScript and test discovery first:

```bash
pnpm exec tsc --noEmit
pnpm exec playwright test --list --reporter=list
```

Check Chromium independently of the repository's headed configuration and application fixtures:

```bash
node --input-type=module - <<'JS'
import { chromium } from "@playwright/test";

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent("<title>setup-env</title>");
  if ((await page.title()) !== "setup-env") throw new Error("Unexpected page title");
} finally {
  await browser.close();
}
console.log("Chromium launch passed");
JS
```

After the intended application and necessary settings are available, run the pre-merge selection:

```bash
pnpm run test:dev
```

`playwright.config.ts` forces `launchOptions.headless: false`.
On Linux without a display, install Xvfb through the distribution's package manager and use:

```bash
xvfb-run -a pnpm run test:dev
```

This application run contacts websites and may require credentials; test listing and the standalone browser check do not execute those application fixtures.

## Report and troubleshoot

Report Node/pnpm versions, frozen installation, type checking, discovery, browser launch, and application tests separately.
Identify failures and skipped checks explicitly; discovery alone does not establish successful browser execution.
Use `pnpm exec` or package scripts for project tools rather than global `playwright`.
For missing binaries, repeat the local Playwright installer; for missing Linux libraries use `--with-deps`; for display failures use Xvfb.
On registry/download errors, retain proxy/TLS settings and report the actual error. Do not regenerate the lockfile or change test configuration as a setup workaround.
