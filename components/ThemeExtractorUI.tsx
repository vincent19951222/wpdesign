import React, { useState, useCallback } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, Loader, FileCode, X, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
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

        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setSaveName(nameWithoutExt);

        try {
            const content = await readFileAsText(file);

            setStep('sanitizing');
            setProgress({ step: 'sanitizing', message: '正在清理 HTML...', progress: 20 });
            const { sanitized, isValid, validationIssues } = prepareForAI(content);
            if (!isValid) throw new Error(`HTML 结构无效: ${validationIssues.join(', ')}`);

            setStep('extracting');
            setProgress({ step: 'calling-ai', message: '正在调用 Kimi K2 提取样式...', progress: 40 });
            const styledHtml = await callKimiK2(sanitized.html);

            setStep('parsing');
            setProgress({ step: 'parsing', message: '正在解析提取的样式...', progress: 80 });
            const extractionResult = parseAIResponse(styledHtml);

            if (!extractionResult.success || !extractionResult.theme) {
                throw new Error(extractionResult.errors.join(', ') || '无法提取主题');
            }

            setStep('complete');
            setProgress({ step: 'complete', message: '主题提取成功！', progress: 100 });
            setResult(extractionResult);

            if (sanitized.warnings.length > 0) {
                extractionResult.warnings.push(...sanitized.warnings);
            }

        } catch (err) {
            setStep('error');
            setError(err instanceof Error ? err.message : '发生未知错误');
            setProgress({ step: 'error', message: '提取失败', progress: 0 });
        }
        event.target.value = '';
    }, []);

    const handleApplyTheme = useCallback(() => {
        if (result?.theme) {
            onThemeExtracted(result.theme);
        }
    }, [result, onThemeExtracted]);

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

    const handleSaveToProject = useCallback(async () => {
        if (!result?.theme || !saveName.trim()) return;
        setIsSaving(true);
        try {
            const response = await fetch('/api/save-theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: result.theme, filename: saveName })
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-0 shadow-neo-xl">
                {/* Header */}
                <div className="bg-neo-yellow px-6 py-4 flex justify-between items-center shrink-0 border-b-4 border-neo-ink">
                    <h2 className="font-sans font-bold text-xl uppercase tracking-wide">THEME EXTRACTOR <span className="text-sm bg-white px-2 border-2 border-black ml-2">AI POWERED</span></h2>
                    <button onClick={onClose} className="hover:bg-white p-1 border-2 border-transparent hover:border-black transition-all rounded-none">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-neo-bg">
                    {/* Left Panel */}
                    <div className={`p-6 overflow-y-auto ${step === 'complete' ? 'md:w-1/3 border-r-4 border-neo-ink' : 'w-full'}`}>
                        {step === 'idle' && (
                            <div className="text-center h-full flex flex-col justify-center">
                                <div className="border-4 border-dashed border-neo-ink/20 p-12 hover:border-neo-accent hover:bg-white transition-all cursor-pointer group" onClick={() => document.getElementById('html-upload')?.click()}>
                                    <FileCode size={64} className="mx-auto mb-6 text-neo-ink/20 group-hover:text-neo-accent transition-colors" />
                                    <h3 className="text-xl font-bold mb-2 uppercase">Upload HTML File</h3>
                                    <p className="text-neo-ink/60 mb-8 font-mono text-sm">Upload a page to extract its style DNA</p>
                                    <input
                                        type="file"
                                        id="html-upload"
                                        accept=".html,.htm"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <Button onClick={(e) => { e.stopPropagation(); document.getElementById('html-upload')?.click(); }}>
                                        <Upload className="mr-2 h-4 w-4" /> SELECT FILE
                                    </Button>
                                </div>
                                <div className="mt-8 text-left bg-white p-6 border-4 border-neo-ink shadow-neo-sm">
                                    <h3 className="font-bold mb-4 uppercase flex items-center gap-2"><div className="w-4 h-4 bg-neo-accent"></div> Instructions</h3>
                                    <ul className="text-sm space-y-3 font-mono">
                                        <li>1. Upload HTML with inline styles</li>
                                        <li>2. AI analyzes visual patterns</li>
                                        <li>3. Generate generic theme JSON</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {(step === 'uploading' || step === 'sanitizing' || step === 'extracting' || step === 'parsing') && (
                            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                                <Loader size={48} className="mx-auto mb-6 text-neo-ink animate-spin" />
                                <Badge variant="secondary" className="mb-4">{step.toUpperCase()}</Badge>
                                <p className="font-bold text-xl mb-2">{uploadedFileName}</p>
                                <p className="text-neo-ink/60 font-mono text-sm mb-6">{progress?.message || 'Processing...'}</p>

                                <div className="w-full max-w-xs h-6 border-4 border-neo-ink p-1">
                                    <div className="h-full bg-neo-accent transition-all duration-300" style={{ width: `${progress?.progress || 0}%` }} />
                                </div>
                            </div>
                        )}

                        {step === 'error' && (
                            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                                <AlertCircle size={64} className="mx-auto mb-6 text-neo-accent" />
                                <h3 className="text-neo-accent font-black text-2xl uppercase mb-4">Extraction Failed</h3>
                                <div className="bg-red-50 border-2 border-red-200 p-4 mb-8 text-left w-full">
                                    <p className="font-mono text-sm text-red-800 break-all">{error}</p>
                                </div>
                                <Button onClick={() => { setStep('idle'); setError(null); }}>
                                    TRY AGAIN
                                </Button>
                            </div>
                        )}

                        {step === 'complete' && result?.theme && (
                            <div className="text-center flex flex-col h-full">
                                <div className="mb-8">
                                    <CheckCircle size={48} className="mx-auto mb-4 text-neo-ink fill-neo-green" />
                                    <h3 className="font-black text-2xl uppercase">Success!</h3>
                                    <Badge variant="outline" className="mt-2 text-xs font-mono">COVERAGE: {Math.round((result.coverage || 0) * 100)}%</Badge>
                                </div>

                                {result.warnings.length > 0 && (
                                    <div className="bg-yellow-50 border-l-4 border-neo-secondary p-4 mb-6 text-left max-h-32 overflow-y-auto text-xs font-mono">
                                        <p className="font-bold mb-1">WARNINGS:</p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex-1"></div>

                                <div className="bg-white border-4 border-neo-ink p-4 mb-6 text-left shadow-neo-sm">
                                    <label className="block text-xs font-bold uppercase mb-2">Save Theme As</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={saveName}
                                            onChange={(e) => setSaveName(e.target.value)}
                                            placeholder="theme-name"
                                            className="flex-1 border-2 border-neo-ink px-2 py-1 font-mono text-sm focus:outline-none focus:bg-neo-yellow"
                                        />
                                        <Button size="sm" onClick={handleSaveToProject} disabled={isSaving || !saveName.trim()}>
                                            {isSaving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button onClick={handleApplyTheme} className="w-full">APPLY THEME</Button>
                                    <Button variant="outline" onClick={handleDownload} className="w-full">DOWNLOAD JSON</Button>
                                    <button onClick={() => setStep('idle')} className="text-xs font-bold underline hover:text-neo-accent mt-2">EXTRACT ANOTHER</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    {step === 'complete' && result?.theme && (
                        <div className="flex-1 bg-neo-cream/50 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                            <div className="max-w-[375px] mx-auto bg-white min-h-[600px] border-4 border-neo-ink shadow-neo-lg overflow-hidden">
                                <div className="bg-neo-ink text-white p-2 text-center text-xs font-mono border-b-4 border-neo-ink">
                                    PREVIEW MODE
                                </div>
                                <WeChatRenderer content={PREVIEW_MARKDOWN} theme={result.theme} />
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

export default ThemeExtractorUI;
