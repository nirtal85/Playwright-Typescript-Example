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
Reuse that pnpm version if already available; otherwise install the exact declared version using https://pnpm.io/installation.

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

Do not switch to npm/yarn or create another lockfile.
On Linux with missing shared libraries, use `pnpm exec playwright install --with-deps chromium`
with appropriate system package-manager privileges.
The installed Playwright package selects the browser revision; do not copy an arbitrary Docker image version.
Preserve the checked-in dependency build policy in `pnpm-workspace.yaml`.

## Configure

Inspect `playwright.config.ts` and the selected tests for required configuration.
The repository has no `.env.example`.
If a local `.env` is needed, create it only when absent and confirm it is ignored by Git.
Preserve existing values; populate credentials privately from user-provided values.

`DOMAIN` selects logical environment behavior (default DEV). `playwright.config.ts` uses `BASE_URL` as the base URL, defaulting to https://playwright.dev.
Choose an intended application URL matching the page objects before execution.
Database, SFTP, visual regression, and other service credentials are needed only for tests using those integrations.
Do not invent tokens or run the complete suite merely to check installation.

## Finish setup

Setup is complete when frozen dependency installation and the Chromium installer exit successfully with no unresolved host-validation warnings.
Read the installer output: Playwright can warn about missing system libraries without failing. Resolve those warnings using the Linux dependency installation above; if blocked, report setup as incomplete and list the unresolved dependencies.
Stop there: do not run TypeScript checks, collect or run tests, launch a browser, or visit the target application unless explicitly requested.
Successful installation is not a claim that application tests pass.

## Report and troubleshoot

Report dependency and Chromium installation outcomes, any unresolved host-validation warnings, and state that tests and TypeScript checks were not run and display support was not checked.
The default Playwright configuration is headed. On Linux without a display, Xvfb is an option for a separately requested test run; do not install it or run tests as part of this setup.
Use `pnpm exec` or package scripts for project tools rather than global `playwright`.
For missing binaries, repeat the local Playwright installer; for missing Linux libraries use `--with-deps`; for display failures use Xvfb.
On registry/download errors, retain proxy/TLS settings and report the actual error. Do not regenerate the lockfile or change test configuration as a setup workaround.
