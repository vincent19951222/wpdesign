/**
 * Style Parser for Theme Extraction
 * 
 * Parses AI-generated HTML with inline styles and extracts them as React CSSProperties.
 * Uses ID whitelist to ensure only expected elements are processed.
 */

import { CSSProperties } from 'react';

/**
 * Mapping from skeleton HTML IDs to ITheme property names
 */
export const ID_TO_THEME_KEY: Record<string, string> = {
    'pattern-wrapper': 'wrapper',
    'pattern-h1-container': 'h1Container',
    'pattern-h1': 'h1',
    'pattern-h1-subtitle': 'h1Subtitle',
    'pattern-h2-container': 'h2Container',
    'pattern-h2': 'h2',
    'pattern-h3-container': 'h3Container',
    'pattern-h3-badge': 'h3Badge',
    'pattern-h3': 'h3',
    'pattern-h4': 'h4',
    'pattern-h5': 'h5',
    'pattern-p': 'p',
    'pattern-strong': 'strong',
    'pattern-em': 'em',
    'pattern-code': 'code',
    'pattern-link': 'a',
    'pattern-blockquote': 'blockquote',
    'pattern-blockquote-badge': 'blockquoteBadge',
    'pattern-blockquote-content': 'blockquoteContent',
    'pattern-ul': 'ul',
    'pattern-ol': 'ol',
    'pattern-li-ul': 'liUl',
    'pattern-li-ol': 'liOl',
    'pattern-ul-marker': 'ulMarker',
    'pattern-ol-marker': 'olMarker',
    'pattern-pre': 'pre',
    'pattern-pre-header': 'preHeader',
    'pattern-pre-dot': 'preDot',
    'pattern-pre-label': 'preLabel',
    'pattern-pre-body': 'preBody',
    'pattern-table-container': 'tableContainer',
    'pattern-table': 'table',
    'pattern-thead': 'thead',
    'pattern-th': 'th',
    'pattern-td': 'td',
    'pattern-hr-container': 'hrContainer',
    'pattern-hr-text': 'hrText',
    'pattern-footer': 'footer',
    'pattern-footer-icon': 'footerIcon',
    'pattern-footer-text': 'footerText',
};

/**
 * Convert kebab-case CSS property to camelCase
 */
export function kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Parse CSS style string into React CSSProperties object
 * 
 * @example
 * parseStyleString('background-color: red; font-size: 16px;')
 * // Returns: { backgroundColor: 'red', fontSize: '16px' }
 */
export function parseStyleString(styleStr: string): CSSProperties {
    if (!styleStr || typeof styleStr !== 'string') {
        return {};
    }

    const result: Record<string, string | number> = {};

    // Split by semicolons, handling potential edge cases
    const declarations = styleStr.split(';').filter(d => d.trim());

    for (const declaration of declarations) {
        const colonIndex = declaration.indexOf(':');
        if (colonIndex === -1) continue;

        const property = declaration.substring(0, colonIndex).trim();
        const value = declaration.substring(colonIndex + 1).trim();

        if (!property || !value) continue;

        // Convert property name to camelCase
        const camelProperty = kebabToCamel(property);

        // Try to convert numeric values
        const numericValue = parseNumericValue(value);
        result[camelProperty] = numericValue !== null ? numericValue : value;
    }

    return result as CSSProperties;
}

/**
 * Try to parse a value as a number if appropriate
 */
function parseNumericValue(value: string): number | null {
    // Properties that should remain as numbers without units
    const numericProperties = ['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order'];

    // Check if it's a pure number
    const num = parseFloat(value);
    if (!isNaN(num) && value === String(num)) {
        return num;
    }

    return null;
}

/**
 * Extract style attribute from an HTML element string
 */
export function extractStyleFromElement(elementHtml: string): string {
    const styleMatch = elementHtml.match(/style\s*=\s*["']([^"']*)["']/i);
    return styleMatch ? styleMatch[1] : '';
}

/**
 * Parse AI-generated HTML and extract styles by ID
 * 
 * @param html - The AI-generated HTML with inline styles
 * @returns Object mapping theme keys to CSSProperties
 */
export function parseStyledHtml(html: string): Record<string, CSSProperties> {
    const result: Record<string, CSSProperties> = {};

    // Process each ID in the whitelist
    for (const [patternId, themeKey] of Object.entries(ID_TO_THEME_KEY)) {
        // Match element with this ID and extract its style
        // Handles both single and double quotes, and various attribute orderings
        const idPattern = new RegExp(
            `<[^>]*\\bid\\s*=\\s*["']${patternId}["'][^>]*>`,
            'i'
        );

        const match = html.match(idPattern);
        if (match) {
            const styleStr = extractStyleFromElement(match[0]);
            if (styleStr) {
                result[themeKey] = parseStyleString(styleStr);
            }
        }
    }

    return result;
}

/**
 * Deep merge two theme objects, with extracted styles overriding defaults
 * 
 * @param defaultTheme - The default theme object
 * @param extractedStyles - Styles extracted from AI output
 * @returns Merged theme object
 */
export function mergeThemes<T extends Record<string, unknown>>(
    defaultTheme: T,
    extractedStyles: Record<string, CSSProperties>
): T {
    const result = { ...defaultTheme };

    for (const [key, value] of Object.entries(extractedStyles)) {
        if (key in result && typeof result[key] === 'object' && result[key] !== null) {
            // Deep merge for style objects
            (result as Record<string, unknown>)[key] = {
                ...(result[key] as object),
                ...value,
            };
        } else {
            // Direct assignment for new keys or non-object values
            (result as Record<string, unknown>)[key] = value;
        }
    }

    return result;
}

/**
 * Validate that extracted styles cover minimum required fields
 */
export function validateExtractedStyles(
    styles: Record<string, CSSProperties>
): { valid: boolean; missingKeys: string[]; coverage: number } {
    const requiredKeys = [
        'wrapper', 'h1', 'h2', 'h3', 'p', 'blockquote', 'ul', 'ol', 'code', 'pre'
    ];

    const presentKeys = Object.keys(styles);
    const missingKeys = requiredKeys.filter(k => !presentKeys.includes(k));
    const coverage = (requiredKeys.length - missingKeys.length) / requiredKeys.length;

    return {
        valid: missingKeys.length === 0,
        missingKeys,
        coverage,
    };
}
