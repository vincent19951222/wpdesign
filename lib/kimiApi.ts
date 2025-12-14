/**
 * Kimi K2 API Service
 * 
 * Handles communication with Moonshot's Kimi K2 API for style extraction.
 * In development: Uses Vite proxy to add API key
 * In production: Should use a backend proxy server
 */

import { AI_SYSTEM_PROMPT } from './themeExtractor';

interface KimiMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface KimiResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

/**
 * Call Kimi K2 API to extract styles from HTML
 * 
 * @param sourceHtml - The sanitized source HTML from user
 * @returns The styled skeleton HTML with inline styles
 */
export async function callKimiK2(sourceHtml: string): Promise<string> {
    const messages: KimiMessage[] = [
        {
            role: 'system',
            content: AI_SYSTEM_PROMPT,
        },
        {
            role: 'user',
            content: sourceHtml,
        },
    ];

    // Use proxy path in development
    // In production, this should point to your backend API
    const apiUrl = '/api/moonshot/v1/chat/completions';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'kimi-k2-0711-preview', // Kimi K2 model
                messages,
                temperature: 0.3, // Lower temperature for more consistent output
                max_tokens: 16000, // Enough for full skeleton HTML with styles
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Kimi K2 API error:', errorText);

            if (response.status === 401) {
                throw new Error('API 认证失败。请检查 .env 文件中的 VITE_MOONSHOT_API_KEY 是否正确。');
            }
            if (response.status === 429) {
                throw new Error('API 请求频率超限。请稍后重试。');
            }
            if (response.status === 500) {
                throw new Error('Kimi K2 服务暂时不可用。请稍后重试。');
            }

            throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
        }

        const data: KimiResponse = await response.json();

        if (!data.choices || data.choices.length === 0) {
            throw new Error('API 返回空响应');
        }

        const content = data.choices[0].message.content;

        // Validate that the response looks like HTML
        if (!content.includes('<!DOCTYPE') && !content.includes('<html')) {
            console.warn('Response may not be valid HTML:', content.substring(0, 200));
        }

        return content;
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('网络连接失败。请检查网络连接。');
        }
        throw error;
    }
}

/**
 * Check if Kimi K2 API is available
 */
export async function checkKimiK2Available(): Promise<boolean> {
    try {
        const response = await fetch('/api/moonshot/v1/models', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.ok;
    } catch {
        return false;
    }
}
