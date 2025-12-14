/**
 * HTML Sanitizer for Theme Extraction
 * 
 * Cleans user-uploaded HTML before sending to AI for style extraction.
 * Removes scripts, Base64 images, truncates long text, and detects external CSS.
 */

export interface SanitizeResult {
    html: string;
    warnings: string[];
    hasExternalCSS: boolean;
}

export interface SanitizeOptions {
    maxTextLength?: number;  // Maximum characters per text node (default: 200)
    removeImages?: boolean;  // Whether to remove all images (default: false)
}

const DEFAULT_OPTIONS: SanitizeOptions = {
    maxTextLength: 200,
    removeImages: false,
};

/**
 * Sanitize HTML content for AI processing
 */
export function sanitizeHtml(html: string, options: SanitizeOptions = {}): SanitizeResult {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const warnings: string[] = [];
    let hasExternalCSS = false;

    // Step 1: Remove script tags and their content
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Step 2: Remove noscript tags
    sanitized = sanitized.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

    // Step 3: Remove Base64 encoded images (data:image/...)
    const base64Pattern = /src\s*=\s*["']data:image\/[^"']+["']/gi;
    const base64Matches = sanitized.match(base64Pattern);
    if (base64Matches && base64Matches.length > 0) {
        warnings.push(`Removed ${base64Matches.length} Base64 encoded image(s)`);
        sanitized = sanitized.replace(base64Pattern, 'src=""');
    }

    // Step 4: Detect external CSS links
    const externalCSSPattern = /<link[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi;
    const externalCSSMatches = sanitized.match(externalCSSPattern);
    if (externalCSSMatches && externalCSSMatches.length > 0) {
        hasExternalCSS = true;
        warnings.push(`Detected ${externalCSSMatches.length} external CSS link(s). Please inline styles into <style> tags for best results.`);
        // Remove external CSS links
        sanitized = sanitized.replace(externalCSSPattern, '');
    }

    // Step 5: Remove comments
    sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

    // Step 6: Truncate long text content (keeps structure, reduces tokens)
    if (opts.maxTextLength && opts.maxTextLength > 0) {
        // Match text between tags, but not inside tag attributes
        sanitized = sanitized.replace(/>([^<]{201,})</g, (match, text) => {
            const truncated = text.substring(0, opts.maxTextLength) + '...';
            return `>${truncated}<`;
        });
    }

    // Step 7: Remove inline event handlers (security)
    sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Step 8: Clean up excessive whitespace
    sanitized = sanitized.replace(/\s+/g, ' ');
    sanitized = sanitized.replace(/>\s+</g, '><');

    return {
        html: sanitized.trim(),
        warnings,
        hasExternalCSS,
    };
}

/**
 * Extract inline styles from HTML <style> tags and combine them
 */
export function extractStyleTags(html: string): string {
    const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
    const styles: string[] = [];
    let match;

    while ((match = stylePattern.exec(html)) !== null) {
        styles.push(match[1]);
    }

    return styles.join('\n');
}

/**
 * Check if HTML has sufficient structure for theme extraction
 */
export function validateHtmlStructure(html: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for basic HTML structure
    if (!html.includes('<')) {
        issues.push('No HTML tags found');
    }

    // Check for body or content
    if (!/<body/i.test(html) && !/<div/i.test(html) && !/<section/i.test(html)) {
        issues.push('No body or container elements found');
    }

    // Check for headings or paragraphs (at least some content structure)
    if (!/<(h[1-6]|p|div|section)/i.test(html)) {
        issues.push('No structural elements (headings, paragraphs) found');
    }

    return {
        valid: issues.length === 0,
        issues,
    };
}
