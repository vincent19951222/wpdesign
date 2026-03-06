<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Snapshot

`wpdesign` is a React 19 + Vite application for writing Markdown and exporting WeChat Official Account friendly HTML with inline styles. The current product scope is broader than the original pixel-only formatter:

- Theme gallery with multiple built-in JSON themes
- Markdown editor + preview flow
- AI-based theme extraction from uploaded HTML
- Local theme persistence in development and server-side persistence in production

The main user flow in `App.tsx` is:

1. Landing page / theme selection
2. Markdown editor
3. Preview + copy
4. Help/docs view

## Development Commands

### Frontend

```bash
npm install
npm run dev
npm run build
npm run preview
```

- Vite dev server runs on `http://localhost:5173`
- Host is bound to `0.0.0.0`

### Backend Proxy (optional but required in production)

```bash
cd server
npm install
npm run dev
# or
npm start
```

- Express server defaults to `http://localhost:3001`
- Serves `../dist`
- Proxies `/api/moonshot/*`
- Accepts `POST /api/save-theme`

## Environment Variables

The code currently reads:

- `VITE_MOONSHOT_API_KEY` for the Vite dev proxy
- `VITE_MOONSHOT_API_KEY` or `MOONSHOT_API_KEY` in `server/index.js`
- `WECHAT_OFFICIAL_APP_ID` and `WECHAT_OFFICIAL_APP_SECRET` for WeChat draft publishing

Recommended local setup:

```bash
# .env
VITE_MOONSHOT_API_KEY=your_key_here
MOONSHOT_API_KEY=your_key_here
```

## Architecture

### Frontend entry points

- `App.tsx`: top-level state and step navigation
- `index.tsx`: React mount
- `index.css`: shared visual system and Tailwind-driven styling

### UI surface

- `components/LandingPage.tsx`: theme browsing / entry flow
- `components/Editor.tsx`: markdown authoring
- `components/Preview.tsx`: rendered output and copy action
- `components/ThemeExtractorUI.tsx`: AI extraction workflow
- `components/WeChatRenderer.tsx`: markdown-to-HTML rendering using the active theme

### Theme extraction pipeline

- `lib/htmlSanitizer.ts`: trims and normalizes uploaded HTML before sending it to AI
- `lib/themeExtractor.ts`: extraction orchestration, prompt, skeleton HTML, parsing flow
- `lib/kimiApi.ts`: Moonshot/Kimi API client
- `lib/styleParser.ts`: converts AI-returned inline styles into the theme schema
- `types/ITheme.ts`: canonical theme contract
- `themes/*.json`: built-in and saved themes

### Server responsibilities

- `server/index.js`: production API proxy, theme save API, static hosting
- `server/lib/draftPublisher.js`: WeChat draft publishing orchestration
- `server/lib/wechatClient.js`: WeChat token / asset / draft API client

## Working Rules For Agents

- Preserve the WeChat compatibility rule: generated article styles should remain inline and self-contained.
- When changing theme extraction, keep `themeExtractor.ts`, `styleParser.ts`, and `types/ITheme.ts` in sync.
- When changing theme save behavior, check both implementations:
  - Vite middleware in `vite.config.ts`
  - Express API in `server/index.js`
- When changing WeChat draft publishing, keep the shared renderer and the server publishing pipeline aligned:
  - `lib/renderers/`
  - `server/lib/draftPublisher.js`
  - `server/lib/wechatClient.js`
- Prefer updating existing theme JSON files over inventing a parallel schema.
- Use `docs/DEVELOPMENT.md` as the operator-facing runbook; keep this file focused on agent context.

## Known Codebase Nuances

- `vite.config.ts` still contains legacy `GEMINI_API_KEY` defines even though the active AI integration is Moonshot/Kimi.
- Development theme saving is handled by a custom Vite middleware, not the Express server.
- `document.execCommand('copy')` is still used for rich-text copy compatibility with WeChat editor workflows.
- WeChat draft publishing is server-only and uses a fixed classic pixel theme for the first iteration.
