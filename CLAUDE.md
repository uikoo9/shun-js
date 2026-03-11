# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

shun-js is a Lerna + Nx monorepo (npm workspaces) for running various business services. Pure JavaScript, no TypeScript. All packages live under `packages/`.

## Common Commands

```shell
# Install dependencies
npm install

# Build all packages (lerna + nx caching)
npm run build

# Build a single package
npm run build -w @shun-js/<package-name>

# Lint (runs build first, then prettier + eslint via qiao-project)
npm run lint

# Publish packages
npm run pb

# Start a service locally (from configs/ directory)
cd configs && shunjs start @shun-js/<package-name>

# Build a web app (outputs to corresponding server's static/ and views/)
npm run build:aitubiao-web
npm run build:aibaiban-web
npm run build:mcp-admin-web
npm run build:mcp-index-web

# Dev server for a web package
npm run dev -w @shun-js/<web-package-name>
```

## Commit Conventions

Commits use **conventional commits** enforced by commitlint + husky. Pre-commit hook runs lint-staged (prettier + eslint on all files). Use `npm run cz` for interactive commit.

## Architecture

### Package Categories

**Infrastructure (published to npm):**

- `shun-cli` — CLI tool (`shunjs` binary) that starts services via pm2
- `shun-config` — Reads JSON config files from the working directory
- `shun-service` — Shared service utilities (built with rollup, dual ESM+CJS output)

**Base service modules (ports 8001–8008):**

- `feishu-bot`, `sms`, `user`, `recommend`, `cos`, `config`, `app`, `data`
- Express apps via `qiao-z` framework, entry point is `app.js` with routes in `server/`

**Business modules (ports 7001–7009):**

- Server packages (e.g. `aitubiao-server`, `aibaiban-server`) — Express apps with `app.js` entry
- Web packages (e.g. `aitubiao-web`, `mcp-admin-web`) — React 19 + Tailwind v4 + daisyUI, built with `qiao-webpack`
- Web builds output static assets into the paired server package's `static/` and `views/` directories
- Static assets are uploaded to Tencent COS via `qcos`

### Key Patterns

- Services depend on `@shun-js/shun-config` for config and `@shun-js/shun-service` for shared utilities
- Config JSON files live in `configs/` at the repo root (not committed — contain secrets)
- The `qiao-*` ecosystem provides most utilities: HTTP (`qiao-ajax`), logging (`qiao-log`), MySQL, Redis, file ops, etc.
- Library packages (shun-service) use rollup via `qpro rollup`; web packages use webpack via `qwebpack`
- Lerna uses independent versioning — each package has its own version
