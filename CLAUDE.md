# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pixel Lab - WeChat Formatter is a React-based web application that converts Markdown content into stylized HTML specifically designed for WeChat Official Account articles. The app features a retro, pixel-art aesthetic inspired by 8-bit games and cyberpunk themes.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Core Components

- **App.tsx**: Main application component managing the 3-step workflow (theme selection → markdown editor → preview/copy)
- **components/WeChatRenderer.tsx**: Converts Markdown to WeChat-compatible HTML with inline styles
- **components/UI.tsx**: Reusable pixel-styled UI components (PixelButton, TemplateCard)
- **utils/pixelStyles.ts**: Inline CSS styles for WeChat compatibility (WeChat ignores external CSS)

### Key Technical Decisions

1. **Inline Styles Only**: All WeChat output uses inline styles because WeChat's editor ignores external CSS classes and stylesheets
2. **Copy Strategy**: Uses `document.execCommand('copy')` with manual selection fallback for reliable rich text copying to WeChat
3. **Mobile Preview**: Simulated phone interface to preview mobile appearance
4. **Markdown Processing**: Uses react-markdown with remark-gfm for GitHub Flavored Markdown support

### WeChat Compatibility Requirements

- All styles must be inline (no classes or external CSS)
- Uses specific color palette: `#FFD700` (yellow), `#00E099` (green), `#1a1a1a` (dark)
- Font families: `"Courier New"`, monospace fonts for code blocks
- Box shadows and borders for pixel-art aesthetic

### State Management Pattern

The app uses React useState for simple state management:
- `step`: Current workflow step (1|2|3)
- `markdown`: Markdown content string
- `copied`: Copy success feedback state

### File Upload Handling

File uploads are handled via FileReader API with `.md` file extension filtering. The uploaded content replaces the current markdown state.

### Build Configuration

Vite configuration includes:
- Development server on port 3000 with host binding
- Environment variable support for `GEMINI_API_KEY`
- Path alias `@` mapped to project root
- React plugin for JSX transformation