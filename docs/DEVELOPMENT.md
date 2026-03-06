# Development Guide

This document is the practical setup guide for working on `wpdesign`.

## 1. What This Project Is

`wpdesign` is a WeChat article formatter built with React + Vite. It lets users:

- write Markdown
- preview styled WeChat-friendly output
- switch between built-in themes
- extract a new theme from uploaded HTML using Moonshot Kimi
- save generated theme JSON locally

## 2. Local Setup

### Frontend

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Backend

The backend is only needed when you want to run the production-style proxy/static server locally, or test the standalone Express server behavior.

```bash
cd server
npm install
npm run dev
```

Backend runs at `http://localhost:3001` by default.

## 3. Environment Variables

Create or update the root `.env` file:

```env
VITE_MOONSHOT_API_KEY=your_moonshot_key
MOONSHOT_API_KEY=your_moonshot_key
WECHAT_OFFICIAL_APP_ID=your_wechat_app_id
WECHAT_OFFICIAL_APP_SECRET=your_wechat_app_secret
PORT=3001
```

Notes:

- Vite dev proxy reads `VITE_MOONSHOT_API_KEY`
- Express server reads `VITE_MOONSHOT_API_KEY` first, then `MOONSHOT_API_KEY`
- WeChat draft publishing reads `WECHAT_OFFICIAL_APP_ID` and `WECHAT_OFFICIAL_APP_SECRET`
- `PORT` is optional for the server

## 4. Run Modes

### Mode A: Frontend-only development

Use this for normal UI work:

```bash
npm run dev
```

In this mode:

- Vite proxies `/api/moonshot/*` to Moonshot
- Vite exposes a local `POST /api/save-theme` middleware
- saved themes are written into the root `themes/` directory

### Mode B: Production-like local test

Use this to verify the standalone server path:

```bash
npm run build
cd server
npm start
```

In this mode:

- Express serves `../dist`
- Express proxies `/api/moonshot/*`
- Express handles `POST /api/save-theme`
- Express also exposes `POST /api/wechat/draft` for draft creation

## 5. Key File Map

- `App.tsx`: main app state and screen flow
- `components/LandingPage.tsx`: theme entry page
- `components/Editor.tsx`: markdown editing interface
- `components/Preview.tsx`: preview and copy panel
- `components/ThemeExtractorUI.tsx`: HTML upload and extraction flow
- `components/WeChatRenderer.tsx`: themed markdown renderer
- `lib/themeExtractor.ts`: extraction pipeline and AI prompt
- `lib/kimiApi.ts`: API calls to Moonshot
- `lib/styleParser.ts`: converts AI HTML back into theme JSON
- `types/ITheme.ts`: theme type definition
- `themes/*.json`: built-in and user-saved themes
- `vite.config.ts`: Vite config, Moonshot proxy, local save-theme middleware
- `server/index.js`: Express proxy and static server
- `server/lib/draftPublisher.js`: orchestrates WeChat draft publishing
- `server/lib/wechatClient.js`: WeChat token / upload / draft API client

## 5.1 Draft Publishing API

The new backend publishing entrypoint is:

```bash
POST /api/wechat/draft
```

Request format:

- `multipart/form-data`
- required fields:
  - `markdown`
  - `title`
  - `author`
  - `digest`
  - `coverImage`
- optional fields:
  - `contentSourceUrl`
  - `showCoverPic`

This API:

- renders Markdown with the fixed classic pixel theme
- uploads inline content images to WeChat
- uploads the cover image as a thumb asset
- creates a draft in the WeChat draft box

## 6. Safe Change Boundaries

When you modify one of these areas, check the adjacent files too:

- Theme extraction logic:
  - `lib/themeExtractor.ts`
  - `lib/styleParser.ts`
  - `types/ITheme.ts`
- Theme persistence:
  - `vite.config.ts`
  - `server/index.js`
- Rendering output:
  - `components/WeChatRenderer.tsx`
  - `components/Preview.tsx`
  - relevant theme JSON files

## 7. Project-Specific Constraints

- WeChat output should stay inline-style based. Avoid moving article styles into external CSS.
- Theme JSON is the source of truth for article rendering styles.
- The copy flow uses browser selection + `document.execCommand('copy')` for compatibility. Be careful when refactoring.
- This repo has OpenSpec enabled. For feature work, breaking changes, or architecture changes, check `openspec/AGENTS.md` first.

## 8. Useful Existing Docs

- `README.md`: product-facing overview
- `docs/VPS-DEPLOYMENT.md`: deployment steps
- `docs/VPS-SETUP-GUIDE.md`: server environment notes
- `docs/HTML-STYLE-PROMPT-TEMPLATE.md`: prompt-related reference
- `CLAUDE.md`: agent-oriented repo guidance
