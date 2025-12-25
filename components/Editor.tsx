import React, { useRef } from 'react';
import { ChevronLeft, Palette, Upload, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface EditorProps {
    markdown: string;
    setMarkdown: (value: string) => void;
    onBack: () => void;
    onPreview: () => void;
    onThemeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 将 Blob 转换为 base64 字符串
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const Editor: React.FC<EditorProps> = ({
    markdown,
    setMarkdown,
    onBack,
    onPreview,
    onThemeUpload,
    onFileUpload
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 处理粘贴事件，支持图片粘贴
    const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items;

        for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
                e.preventDefault();
                const blob = item.getAsFile();
                if (blob) {
                    try {
                        const base64 = await blobToBase64(blob);
                        const textarea = textareaRef.current;
                        if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const imageMarkdown = `![image](${base64})`;
                            const newMarkdown = markdown.slice(0, start) + imageMarkdown + markdown.slice(end);
                            setMarkdown(newMarkdown);
                            // 将光标移动到插入内容之后
                            setTimeout(() => {
                                textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
                                textarea.focus();
                            }, 0);
                        }
                    } catch (err) {
                        console.error('图片粘贴失败:', err);
                    }
                }
                break;
            }
        }
    };
    return (
        <div className="h-[calc(100dvh-140px)] flex flex-col bg-neo-cream p-4 md:p-6 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4 md:gap-0">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <button onClick={onBack} className="hover:-translate-x-1 transition-transform">
                        <div className="bg-neo-ink text-white p-2 border-2 border-black shadow-neo-sm">
                            <ChevronLeft strokeWidth={3} />
                        </div>
                    </button>
                    <Badge variant="default">EDITOR V2.0</Badge>
                </div>

                <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-end flex-wrap">
                    <input type="file" id="theme-upload" accept=".json" className="hidden" onChange={onThemeUpload} />
                    <Button size="sm" variant="secondary" className="flex-1 md:flex-none" onClick={() => document.getElementById('theme-upload')?.click()}>
                        <Palette size={16} className="mr-2" /> THEME
                    </Button>

                    <input type="file" id="md-upload" accept=".md" className="hidden" onChange={onFileUpload} />
                    <Button size="sm" variant="secondary" className="flex-1 md:flex-none" onClick={() => document.getElementById('md-upload')?.click()}>
                        <Upload size={16} className="mr-2" /> UPLOAD
                    </Button>

                    <Button onClick={onPreview} className="w-full md:w-auto mt-2 md:mt-0">
                        PREVIEW <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            </div>

            <Card className="flex-1 p-0 overflow-hidden relative shadow-neo-lg border-4">
                <div className="absolute top-0 left-0 bg-neo-ink text-white font-mono text-xs px-2 py-1 border-b-4 border-r-4 border-black z-10">
                    MARKDOWN INPUT
                </div>
                <textarea
                    ref={textareaRef}
                    className="w-full h-full bg-white text-neo-ink font-mono resize-none focus:outline-none p-4 md:p-8 pt-10 text-base md:text-lg"
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    onPaste={handlePaste}
                    spellCheck={false}
                    placeholder="# START TYPING..."
                />
            </Card>
        </div>
    );
};
