import React, { useState, useCallback } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, Loader, FileCode, X, Save } from 'lucide-react';
import { PixelButton } from './UI';
import { ITheme } from '../types/ITheme';
import WeChatRenderer from './WeChatRenderer';
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

const PREVIEW_MARKDOWN = `# H1 Main Title
## H1 Subtitle Text

### H2 Section Title

#### H3 Badge Title

##### H4 Subsection Title

###### H5 Detail Title

This is a normal paragraph with **bold text**, *italic text*, and \`inline code\`.
Here is a [link example](#).

> **NOTE**
> This is a blockquote area for important notices or summaries.

*   List item one
*   List item two
*   List item three

1.  Ordered item one
2.  Ordered item two
3.  Ordered item three

\`\`\`javascript
// Code block example
function hello() {
  console.log("Hello World");
}
\`\`\`

| Header 1 | Header 2 |
| :--- | :--- |
| Cell 1 | Cell 2 |
| Cell 3 | Cell 4 |

---
`;

const ThemeExtractorUI: React.FC<ThemeExtractorUIProps> = ({ onThemeExtracted, onClose }) => {
    const [step, setStep] = useState<ExtractionStep>('idle');
    const [progress, setProgress] = useState<ExtractionProgress | null>(null);
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [saveName, setSaveName] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    // Handle file upload
    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadedFileName(file.name);
        setStep('uploading');
        setError(null);
        setResult(null);

        // Pre-fill save name with filename (minus extension)
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setSaveName(nameWithoutExt);

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

    // Save theme to project
    const handleSaveToProject = useCallback(async () => {
        if (!result?.theme || !saveName.trim()) return;
        
        setIsSaving(true);
        try {
            const response = await fetch('/api/save-theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theme: result.theme,
                    filename: saveName
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error || 'Failed to save');
            
            alert(`Theme saved successfully to ${data.path}`);
        } catch (err) {
            alert('Error saving theme: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsSaving(false);
        }
    }, [result, saveName]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className={`bg-pixel-darker border-2 border-pixel-yellow rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-[8px_8px_0px_0px_#1a1a1a] flex flex-col ${step === 'complete' ? 'h-[90vh]' : ''}`}>
                {/* Header */}
                <div className="bg-pixel-yellow px-6 py-4 flex justify-between items-center shrink-0">
                    <h2 className="font-pixel text-pixel-dark text-lg">THEME EXTRACTOR</h2>
                    <button onClick={onClose} className="text-pixel-dark hover:opacity-70">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left Panel: Upload / Progress / Controls */}
                    <div className={`p-6 overflow-y-auto ${step === 'complete' ? 'md:w-1/3 border-r border-gray-700' : 'w-full'}`}>
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

                        {/* Success Section (Controls) */}
                        {step === 'complete' && result?.theme && (
                            <div className="text-center py-4">
                                <CheckCircle size={48} className="mx-auto mb-4 text-pixel-green" />
                                <h3 className="text-pixel-green font-bold mb-2">Theme Extracted!</h3>

                                {/* Coverage info */}
                                <p className="text-gray-400 mb-4">
                                    Style coverage: {Math.round((result.coverage || 0) * 100)}%
                                </p>

                                {/* Warnings */}
                                {result.warnings.length > 0 && (
                                    <div className="bg-yellow-900/30 border border-yellow-600 rounded p-4 mb-6 text-left max-h-40 overflow-y-auto">
                                        <p className="text-yellow-500 font-bold text-sm mb-2">⚠️ Warnings:</p>
                                        <ul className="text-yellow-400 text-sm space-y-1">
                                            {result.warnings.map((w, i) => (
                                                <li key={i}>• {w}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Save Controls */}
                                <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                                    <p className="text-left text-gray-300 text-sm mb-2">Save to Project:</p>
                                    <div className="flex gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            value={saveName}
                                            onChange={(e) => setSaveName(e.target.value)}
                                            placeholder="theme-name"
                                            className="flex-1 bg-gray-900 border border-gray-600 text-white px-3 py-2 rounded text-sm focus:border-pixel-yellow focus:outline-none"
                                        />
                                        <button 
                                            onClick={handleSaveToProject}
                                            disabled={isSaving || !saveName.trim()}
                                            className="bg-pixel-yellow text-black px-3 py-2 rounded flex items-center gap-2 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                            SAVE
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 text-left">Saves to local /themes folder for development</p>
                                </div>

                                {/* Main Actions */}
                                <div className="flex flex-col gap-3">
                                    <PixelButton primary onClick={handleApplyTheme}>
                                        APPLY THEME NOW
                                    </PixelButton>
                                    <PixelButton icon={Download} onClick={handleDownload}>
                                        DOWNLOAD JSON
                                    </PixelButton>
                                </div>

                                <button
                                    className="mt-6 text-gray-500 hover:text-gray-300 text-sm"
                                    onClick={() => setStep('idle')}
                                >
                                    Extract another theme
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Preview (Only visible when complete) */}
                    {step === 'complete' && result?.theme && (
                        <div className="flex-1 bg-[#f7f9fa] overflow-y-auto p-4 md:p-8 custom-scrollbar">
                            <div className="max-w-[400px] mx-auto bg-white min-h-[600px] shadow-xl rounded-xl overflow-hidden border border-gray-200">
                                <div className="bg-gray-100 p-2 border-b border-gray-200 text-center text-xs text-gray-500 font-mono">
                                    PREVIEW MODE
                                </div>
                                <WeChatRenderer 
                                    content={PREVIEW_MARKDOWN} 
                                    theme={result.theme} 
                                />
                            </div>
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
