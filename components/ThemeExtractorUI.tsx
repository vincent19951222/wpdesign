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

const PREVIEW_MARKDOWN = `# H1 主标题
## H1 副标题文本

### H2 章节标题

#### H3 徽章标题

##### H4 子章节标题

###### H5 详情标题

这是普通段落，包含 **加粗文字**、*斜体文字* 和 \`行内代码\`。
这里是一个 [链接示例](#)。

> **注意**
> 这是一个引用块区域，用于显示重要通知或摘要。

*   列表项一
*   列表项二
*   列表项三

1.  有序列表一
2.  有序列表二
3.  有序列表三

\`\`\`javascript
// 代码块示例
function hello() {
  console.log("Hello World");
}
\`\`\`

| 表头 1 | 表头 2 |
| :--- | :--- |
| 单元格 1 | 单元格 2 |
| 单元格 3 | 单元格 4 |

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
            setProgress({ step: 'sanitizing', message: '正在清理 HTML...', progress: 20 });

            const { sanitized, isValid, validationIssues } = prepareForAI(content);

            if (!isValid) {
                throw new Error(`HTML 结构无效: ${validationIssues.join(', ')}`);
            }

            // Step 2: Call AI API
            setStep('extracting');
            setProgress({ step: 'calling-ai', message: '正在调用 Kimi K2 提取样式...', progress: 40 });

            const styledHtml = await callKimiK2(sanitized.html);

            // Step 3: Parse result
            setStep('parsing');
            setProgress({ step: 'parsing', message: '正在解析提取的样式...', progress: 80 });

            const extractionResult = parseAIResponse(styledHtml);

            if (!extractionResult.success || !extractionResult.theme) {
                throw new Error(extractionResult.errors.join(', ') || '无法提取主题');
            }

            // Step 4: Complete
            setStep('complete');
            setProgress({ step: 'complete', message: '主题提取成功！', progress: 100 });
            setResult(extractionResult);

            // Add sanitization warnings to result
            if (sanitized.warnings.length > 0) {
                extractionResult.warnings.push(...sanitized.warnings);
            }

        } catch (err) {
            setStep('error');
            setError(err instanceof Error ? err.message : '发生未知错误');
            setProgress({ step: 'error', message: '提取失败', progress: 0 });
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
            
            if (!response.ok) throw new Error(data.error || '保存失败');
            
            alert(`主题已成功保存到 ${data.path}`);
        } catch (err) {
            alert('保存主题出错：' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsSaving(false);
        }
    }, [result, saveName]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className={`bg-pixel-darker border-2 border-pixel-yellow rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-[8px_8px_0px_0px_#1a1a1a] flex flex-col ${step === 'complete' ? 'h-[90vh]' : ''}`}>
                {/* Header */}
                <div className="bg-pixel-yellow px-6 py-4 flex justify-between items-center shrink-0">
                    <h2 className="font-pixel text-pixel-dark text-lg">主题提取器</h2>
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
                                    <p className="text-gray-300 mb-4">上传 HTML 文件以提取样式</p>
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
                                        选择 HTML 文件
                                    </PixelButton>
                                </div>

                                <div className="mt-6 text-left bg-gray-800/50 p-4 rounded-lg">
                                    <h3 className="text-pixel-yellow font-bold mb-2">📋 使用说明：</h3>
                                    <ul className="text-gray-400 text-sm space-y-2">
                                        <li>• 上传带有内联样式或 &lt;style&gt; 标签的 HTML 文件</li>
                                        <li>• AI 将分析并提取视觉样式</li>
                                        <li>• 暂不支持外部 CSS 链接</li>
                                        <li>• 适用于内容型网页</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Progress Section */}
                        {(step === 'uploading' || step === 'sanitizing' || step === 'extracting' || step === 'parsing') && (
                            <div className="text-center py-12">
                                <Loader size={48} className="mx-auto mb-4 text-pixel-yellow animate-spin" />
                                <p className="text-white font-bold mb-2">{uploadedFileName}</p>
                                <p className="text-gray-400">{progress?.message || '处理中...'}</p>

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
                                <h3 className="text-red-400 font-bold mb-2">提取失败</h3>
                                <p className="text-gray-400 mb-6">{error}</p>
                                <PixelButton
                                    icon={Upload}
                                    onClick={() => {
                                        setStep('idle');
                                        setError(null);
                                    }}
                                >
                                    重试
                                </PixelButton>
                            </div>
                        )}

                        {/* Success Section (Controls) */}
                        {step === 'complete' && result?.theme && (
                            <div className="text-center py-4">
                                <CheckCircle size={48} className="mx-auto mb-4 text-pixel-green" />
                                <h3 className="text-pixel-green font-bold mb-2">主题提取成功！</h3>

                                {/* Coverage info */}
                                <p className="text-gray-400 mb-4">
                                    样式覆盖率：{Math.round((result.coverage || 0) * 100)}%
                                </p>

                                {/* Warnings */}
                                {result.warnings.length > 0 && (
                                    <div className="bg-yellow-900/30 border border-yellow-600 rounded p-4 mb-6 text-left max-h-40 overflow-y-auto">
                                        <p className="text-yellow-500 font-bold text-sm mb-2">⚠️ 警告：</p>
                                        <ul className="text-yellow-400 text-sm space-y-1">
                                            {result.warnings.map((w, i) => (
                                                <li key={i}>• {w}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Save Controls */}
                                <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                                    <p className="text-left text-gray-300 text-sm mb-2">保存到项目：</p>
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
                                            保存
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 text-left">保存到本地 /themes 文件夹（用于开发）</p>
                                </div>

                                {/* Main Actions */}
                                <div className="flex flex-col gap-3">
                                    <PixelButton primary onClick={handleApplyTheme}>
                                        立即应用主题
                                    </PixelButton>
                                    <PixelButton icon={Download} onClick={handleDownload}>
                                        下载 JSON
                                    </PixelButton>
                                </div>

                                <button
                                    className="mt-6 text-gray-500 hover:text-gray-300 text-sm"
                                    onClick={() => setStep('idle')}
                                >
                                    提取另一个主题
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Preview (Only visible when complete) */}
                    {step === 'complete' && result?.theme && (
                        <div className="flex-1 bg-[#f7f9fa] overflow-y-auto p-4 md:p-8 custom-scrollbar">
                            <div className="max-w-[400px] mx-auto bg-white min-h-[600px] shadow-xl rounded-xl overflow-hidden border border-gray-200">
                                <div className="bg-gray-100 p-2 border-b border-gray-200 text-center text-xs text-gray-500 font-mono">
                                    预览模式
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
