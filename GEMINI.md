# Project: Pixel Lab - WeChat Formatter

## Overview
This project is a React-based web application designed to format Markdown content into richly styled HTML suitable for WeChat Official Accounts. It features a unique "Theme Extraction" capability powered by AI (Kimi K2), allowing users to clone designs from existing web pages.

## Key Features
1.  **Markdown to WeChat HTML**: Converts standard Markdown into HTML with inline styles safe for WeChat.
2.  **Theming Engine**: Uses a JSON-based theme system (`ITheme`) to define styles for various HTML elements (h1, p, blockquote, etc.).
3.  **AI Theme Extraction**: Users can upload an HTML file. The system sanitizes it, sends it to Kimi AI to extract styles applied to a standard skeleton, and parses the result back into a reusable JSON theme.
4.  **Real-time Preview**: Side-by-side editor and previewer.

## Architecture

### Frontend
-   **Framework**: React 19 + Vite.
-   **Styling**: Tailwind CSS (via Lucide for icons), inline styles for WeChat compatibility.
-   **Markdown**: `react-markdown` with custom renderers.

### Core Logic (`lib/`)
-   **`themeExtractor.ts`**: Orchestrates the AI extraction process. Contains the `AI_SYSTEM_PROMPT` and `STANDARD_SKELETON_HTML`.
-   **`htmlSanitizer.ts`**: Cleans uploaded HTML before sending to AI to reduce token usage and noise.
-   **`styleParser.ts`**: Parses the AI-generated HTML to extract inline styles and map them to the `ITheme` structure.
-   **`kimiApi.ts`**: Handles communication with the Kimi AI API.

### UI Components (`components/`)
-   **`App.tsx`**: Main entry, manages state (current theme, markdown content).
-   **`WeChatRenderer.tsx`**: Renders the Markdown using the active `ITheme`.
-   **`ThemeExtractorUI.tsx`**: Modal interface for the theme extraction workflow.

## Data Models
-   **`types/ITheme.ts`**: Defines the `ITheme` interface. A theme is essentially a collection of React `CSSProperties` keyed by element type (e.g., `primaryHeading`, `paragraph`, `quote`).

## Development Workflow
-   **Local Theme Saving**: `vite.config.ts` includes a custom plugin to save extracted themes directly to the `themes/` directory via a local API endpoint (`/api/save-theme`).

## Conventions
-   **Styles**: All output styles must be inline `style="..."` attributes to ensure compatibility with WeChat's editor.
-   **Theme Format**: JSON files in `themes/` following `ITheme`.
