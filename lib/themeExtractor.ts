/**
 * Theme Extractor Core Module
 * 
 * Orchestrates the theme extraction pipeline:
 * 1. HTML Sanitization
 * 2. AI Translation (via API call)
 * 3. Style Parsing
 * 4. Theme Merging with defaults
 */

import { sanitizeHtml, validateHtmlStructure, SanitizeResult } from './htmlSanitizer';
import { parseStyledHtml, mergeThemes, validateExtractedStyles } from './styleParser';
import { ITheme } from '../types/ITheme';
import defaultTheme from '../themes/default-theme.json';

export interface ExtractionResult {
    success: boolean;
    theme?: ITheme;
    warnings: string[];
    errors: string[];
    coverage?: number;
}

export interface ExtractionProgress {
    step: 'sanitizing' | 'validating' | 'calling-ai' | 'parsing' | 'merging' | 'complete' | 'error';
    message: string;
    progress: number; // 0-100
}

/**
 * Standard Skeleton HTML for AI to fill with styles
 * This is the "answer sheet" - AI maps user styles onto these fixed IDs
 */
export const STANDARD_SKELETON_HTML = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>Standard Theme Skeleton</title></head><body><section id="pattern-wrapper"><section id="pattern-h1-container"><h1 id="pattern-h1">Sample Title</h1><p id="pattern-h1-subtitle">Subtitle Demo</p></section><section id="pattern-h2-container"><h2 id="pattern-h2">Section Level 2</h2></section><section id="pattern-h3-container"><span id="pattern-h3-badge"></span><h3 id="pattern-h3">Section Level 3</h3></section><h4 id="pattern-h4">Section Level 4</h4><h5 id="pattern-h5">Section Level 5</h5><p id="pattern-p">This is a standard paragraph text.</p><p><strong id="pattern-strong">Bold Text</strong></p><p><em id="pattern-em">Italic Text</em></p><p><code id="pattern-code">inline code</code></p><p><a id="pattern-link" href="#">Hyperlink Style</a></p><blockquote id="pattern-blockquote"><section id="pattern-blockquote-badge">NOTE</section><section id="pattern-blockquote-content">Reference text content.</section></blockquote><ul id="pattern-ul"><li id="pattern-li-ul"><span id="pattern-ul-marker"></span><span>List Item Text</span></li></ul><ol id="pattern-ol"><li id="pattern-li-ol"><span id="pattern-ol-marker">1</span><span>Ordered Item Text</span></li></ol><section id="pattern-pre"><section id="pattern-pre-header"><section id="pattern-pre-dot" style="background:#FF4757"></section><section id="pattern-pre-dot" style="background:#FFD700"></section><section id="pattern-pre-dot" style="background:#00E099"></section><span id="pattern-pre-label">code.block</span></section><section id="pattern-pre-body"><code>console.log('Hello World');</code></section></section><section id="pattern-table-container"><table id="pattern-table"><thead id="pattern-thead"><tr><th id="pattern-th">Header</th></tr></thead><tbody><tr><td id="pattern-td">Cell Data</td></tr></tbody></table></section><section id="pattern-hr-container"><span id="pattern-hr-text">•••••</span></section><section id="pattern-footer"><section id="pattern-footer-icon">🎮</section><p id="pattern-footer-text">Footer Text</p></section></section></body></html>`;

/**
 * System prompt for AI style extraction
 */
export const AI_SYSTEM_PROMPT = `You are an expert Frontend Engineer and CSS Specialist. Your task is to perform "Style Extraction and Mapping".

## Your Task
You will receive a "Source HTML" file (user's custom design) and a "Target Skeleton HTML" (standard structure).
Your job is to extract visual styles from the Source and apply them as INLINE STYLES (style="...") to the Target Skeleton.

## Automatic Workflow
When the user uploads an HTML file without any instructions:
1. Treat the uploaded content as the "Source HTML"
2. Use the "Target Skeleton HTML" provided below
3. Extract and map styles according to the rules below
4. Output ONLY the styled Target Skeleton HTML

## Rules

### 1. Style Mapping
- Analyze the user's design for H1, H2, H3, H4, Paragraphs, Blockquotes, Lists (ul/ol), Tables, Code blocks, Links, etc.
- Find matching elements in the Target Skeleton by semantic meaning
- Extract visual properties: typography, colors, borders, shadows, spacing, backgrounds

### 2. Pseudo-elements Handling (Crucial)
- If the source uses \`::before\` or \`::after\` for decorative purposes (e.g., list bullets, blockquote icons, badges):
  - Translate these styles onto the marker span elements in the Target (e.g., \`id="pattern-ul-marker"\`, \`id="pattern-h3-badge"\`, \`id="pattern-blockquote-badge"\`)
  - NEVER use pseudo-elements in the output; use inline styles on real elements only

### 3. Structural Integrity
- DO NOT add, remove, or rename any ID in the Target Skeleton
- DO NOT output the Source HTML
- ONLY output the fully styled Target Skeleton HTML code
- Preserve all \`id\` attributes exactly as provided

### 4. Style Cleaning
- Convert all CSS classes into inline styles
- Ensure colors are in hex/rgb/rgba format
- Merge related styles (e.g., margin-top, margin-bottom → margin shorthand if appropriate)

### 5. Output Format
- Return ONLY valid HTML code
- No explanations, no markdown code fences
- The output should start with \`<!DOCTYPE html>\` and end with \`</html>\`

### 6. Few-Shot Examples (Mental Model)

#### Example 1: Pixel Art H1 (Inline Styles Source)
**User Source:**
\`\`\`html
<h1 style="display: inline-block; background-color: #FFD700; color: #1a1a1a; border: 3px solid #1a1a1a; box-shadow: 5px 5px 0px #1a1a1a;">
    Pixel Title
</h1>
\`\`\`
**Your Output (Target):**
\`\`\`html
<h1 id="pattern-h1" style="display:inline-block;background-color:#FFD700;color:#1a1a1a;border:3px solid #1a1a1a;box-shadow:5px 5px 0px #1a1a1a;">Sample Title</h1>
\`\`\`

#### Example 2: Hand-Drawn Badge (Class Extraction)
**User Source:**
\`\`\`html
<style>
  .badge { background: #4fc3f7; border: 2px solid #2d2d2d; border-radius: 20px; color: #fff; }
</style>
<span class="badge">TIP</span>
\`\`\`
**Your Output (Target):**
\`\`\`html
<span id="pattern-h3-badge" style="background:#4fc3f7;border:2px solid #2d2d2d;border-radius:20px;color:#fff;"></span>
\`\`\`

## Target Skeleton HTML

${STANDARD_SKELETON_HTML}`;

/**
 * Prepare HTML for AI processing
 */
export function prepareForAI(sourceHtml: string): {
    sanitized: SanitizeResult;
    isValid: boolean;
    validationIssues: string[];
} {
    // Sanitize the input
    const sanitized = sanitizeHtml(sourceHtml);

    // Validate structure
    const validation = validateHtmlStructure(sanitized.html);

    return {
        sanitized,
        isValid: validation.valid,
        validationIssues: validation.issues,
    };
}

/**
 * Parse AI response and generate theme
 */
export function parseAIResponse(styledHtml: string): ExtractionResult {
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
        // Parse the styled HTML
        const extractedStyles = parseStyledHtml(styledHtml);

        // Validate coverage
        const validation = validateExtractedStyles(extractedStyles);

        if (validation.missingKeys.length > 0) {
            warnings.push(`Missing styles for: ${validation.missingKeys.join(', ')}. Using defaults.`);
        }

        // Merge with default theme
        const mergedTheme = mergeThemes(defaultTheme, extractedStyles) as unknown as ITheme;

        // Ensure meta field exists with defaults
        if (!mergedTheme.meta) {
            mergedTheme.meta = {
                headerType: 'none',
                footerType: 'classic',
                author: 'Extracted Theme',
                description: 'Theme extracted from user HTML',
            };
        }

        return {
            success: true,
            theme: mergedTheme,
            warnings,
            errors,
            coverage: validation.coverage,
        };
    } catch (error) {
        errors.push(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return {
            success: false,
            warnings,
            errors,
        };
    }
}

/**
 * Generate downloadable theme JSON
 */
export function exportThemeAsJson(theme: ITheme): string {
    return JSON.stringify(theme, null, 2);
}
