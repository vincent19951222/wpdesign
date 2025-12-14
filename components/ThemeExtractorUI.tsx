/**
 * Theme Extractor UI Component
 * 
 * Provides user interface for uploading HTML files, 
 * triggering theme extraction, and downloading results.
 */

import React, { useState, useCallback } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, Loader, FileCode, X } from 'lucide-react';
import { PixelButton } from './UI';
import { ITheme } from '../types/ITheme';
import {
    prepareForAI,
    parseAIResponse,
    exportThemeAsJson,
    ExtractionResult,
    ExtractionProgress
} from '../lib/themeExtractor';
import { callKimiK2 } from '../lib/kimiApi';

interface ThemeExtractorUIProps {
    onThemeExtracted: (theme: ITheme) => void;
    onClose: () => void;
}

type ExtractionStep = 'idle' | 'uploading' | 'sanitizing' | 'extracting' | 'parsing' | 'complete' | 'error';

const ThemeExtractorUI: React.FC<ThemeExtractorUIProps> = ({ onThemeExtracted, onClose }) => {
    const [step, setStep] = useState<ExtractionStep>('idle');
    const [progress, setProgress] = useState<ExtractionProgress | null>(null);
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Handle file upload
    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadedFileName(file.name);
        setStep('uploading');
        setError(null);
        setResult(null);

        try {
            // Read file content
            const content = await readFileAsText(file);

            // Step 1: Sanitize
            setStep('sanitizing');
            setProgress({ step: 'sanitizing', message: 'Cleaning HTML...', progress: 20 });

            const { sanitized, isValid, validationIssues } = prepareForAI(content);

            if (!isValid) {
                throw new Error(`Invalid HTML structure: ${validationIssues.join(', ')}`);
            }

            // Step 2: Call AI API
            setStep('extracting');
            setProgress({ step: 'calling-ai', message: 'Calling Kimi K2 for style extraction...', progress: 40 });

            const styledHtml = await callKimiK2(sanitized.html);

            // Step 3: Parse result
            setStep('parsing');
            setProgress({ step: 'parsing', message: 'Parsing extracted styles...', progress: 80 });

            const extractionResult = parseAIResponse(styledHtml);

            if (!extractionResult.success || !extractionResult.theme) {
                throw new Error(extractionResult.errors.join(', ') || 'Failed to extract theme');
            }

            // Step 4: Complete
            setStep('complete');
            setProgress({ step: 'complete', message: 'Theme extracted successfully!', progress: 100 });
            setResult(extractionResult);

            // Add sanitization warnings to result
            if (sanitized.warnings.length > 0) {
                extractionResult.warnings.push(...sanitized.warnings);
            }

        } catch (err) {
            setStep('error');
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            setProgress({ step: 'error', message: 'Extraction failed', progress: 0 });
        }

        // Reset file input
        event.target.value = '';
    }, []);

    // Apply extracted theme
    const handleApplyTheme = useCallback(() => {
        if (result?.theme) {
            onThemeExtracted(result.theme);
        }
    }, [result, onThemeExtracted]);

    // Download theme as JSON
    const handleDownload = useCallback(() => {
        if (!result?.theme) return;

        const json = exportThemeAsJson(result.theme);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted-theme.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [result]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-pixel-darker border-2 border-pixel-yellow rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[8px_8px_0px_0px_#1a1a1a]">
                {/* Header */}
                <div className="bg-pixel-yellow px-6 py-4 flex justify-between items-center">
                    <h2 className="font-pixel text-pixel-dark text-lg">THEME EXTRACTOR</h2>
                    <button onClick={onClose} className="text-pixel-dark hover:opacity-70">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {/* Upload Section */}
                    {step === 'idle' && (
                        <div className="text-center">
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 hover:border-pixel-yellow transition-colors">
                                <FileCode size={48} className="mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-300 mb-4">Upload an HTML file to extract its styles</p>
                                <input
                                    type="file"
                                    id="html-upload"
                                    accept=".html,.htm"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <PixelButton
                                    primary
                                    icon={Upload}
                                    onClick={() => document.getElementById('html-upload')?.click()}
                                >
                                    SELECT HTML FILE
                                </PixelButton>
                            </div>

                            <div className="mt-6 text-left bg-gray-800/50 p-4 rounded-lg">
                                <h3 className="text-pixel-yellow font-bold mb-2">📋 Instructions:</h3>
                                <ul className="text-gray-400 text-sm space-y-2">
                                    <li>• Upload any HTML file with inline or &lt;style&gt; CSS</li>
                                    <li>• AI will analyze and extract visual styles</li>
                                    <li>• External CSS links are not supported</li>
                                    <li>• Works best with content-focused pages</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Progress Section */}
                    {(step === 'uploading' || step === 'sanitizing' || step === 'extracting' || step === 'parsing') && (
                        <div className="text-center py-12">
                            <Loader size={48} className="mx-auto mb-4 text-pixel-yellow animate-spin" />
                            <p className="text-white font-bold mb-2">{uploadedFileName}</p>
                            <p className="text-gray-400">{progress?.message || 'Processing...'}</p>

                            {/* Progress bar */}
                            <div className="mt-6 max-w-md mx-auto">
                                <div className="h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                                    <div
                                        className="h-full bg-pixel-yellow transition-all duration-300"
                                        style={{ width: `${progress?.progress || 0}%` }}
                                    />
                                </div>
                                <p className="text-gray-500 text-sm mt-2">{progress?.progress || 0}%</p>
                            </div>
                        </div>
                    )}

                    {/* Error Section */}
                    {step === 'error' && (
                        <div className="text-center py-8">
                            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                            <h3 className="text-red-400 font-bold mb-2">Extraction Failed</h3>
                            <p className="text-gray-400 mb-6">{error}</p>
                            <PixelButton
                                icon={Upload}
                                onClick={() => {
                                    setStep('idle');
                                    setError(null);
                                }}
                            >
                                TRY AGAIN
                            </PixelButton>
                        </div>
                    )}

                    {/* Success Section */}
                    {step === 'complete' && result?.theme && (
                        <div className="text-center py-8">
                            <CheckCircle size={48} className="mx-auto mb-4 text-pixel-green" />
                            <h3 className="text-pixel-green font-bold mb-2">Theme Extracted!</h3>

                            {/* Coverage info */}
                            <p className="text-gray-400 mb-4">
                                Style coverage: {Math.round((result.coverage || 0) * 100)}%
                            </p>

                            {/* Warnings */}
                            {result.warnings.length > 0 && (
                                <div className="bg-yellow-900/30 border border-yellow-600 rounded p-4 mb-6 text-left">
                                    <p className="text-yellow-500 font-bold text-sm mb-2">⚠️ Warnings:</p>
                                    <ul className="text-yellow-400 text-sm space-y-1">
                                        {result.warnings.map((w, i) => (
                                            <li key={i}>• {w}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-center gap-4">
                                <PixelButton icon={Download} onClick={handleDownload}>
                                    DOWNLOAD JSON
                                </PixelButton>
                                <PixelButton primary onClick={handleApplyTheme}>
                                    APPLY THEME
                                </PixelButton>
                            </div>

                            <button
                                className="mt-4 text-gray-500 hover:text-gray-300 text-sm"
                                onClick={() => setStep('idle')}
                            >
                                Extract another theme
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper: Read file as text
function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

export default ThemeExtractorUI;
