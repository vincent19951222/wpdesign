import React, { useRef } from 'react';
import { ChevronLeft, Palette, Upload, ArrowRight, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface EditorProps {
    markdown: string;
    setMarkdown: (value: string) => void;
    onBack: () => void;
    onPreview: () => void;
    onThemeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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

    const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items;

        for (const item of Array.from(items)) {
            if (!item.type.startsWith('image/')) continue;

            e.preventDefault();
            const blob = item.getAsFile();
            if (!blob) break;

            try {
                const base64 = await blobToBase64(blob);
                const textarea = textareaRef.current;
                if (!textarea) break;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const imageMarkdown = `![image](${base64})`;
                const nextMarkdown = markdown.slice(0, start) + imageMarkdown + markdown.slice(end);
                setMarkdown(nextMarkdown);

                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
                    textarea.focus();
                }, 0);
            } catch (err) {
                console.error('图片粘贴失败:', err);
            }
            break;
        }
    };

    return (
        <div className="lab-shell font-home-sans px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-[1480px]">
                <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-[880px]">
                        <div className="homepage-section-kicker text-xs md:text-sm">Writing workflow</div>
                        <div className="mt-4 flex items-start gap-4">
                            <button type="button" onClick={onBack} className="homepage-ghost-btn h-12 w-12 p-0" aria-label="返回首页">
                                <ChevronLeft strokeWidth={3} />
                            </button>
                            <div>
                                <div className="text-3xl font-semibold leading-[1.15] text-white md:text-5xl">Markdown 编辑台</div>
                                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg md:leading-9">
                                    这里是排版实验室的正式写作工位。你可以继续整理 Markdown、导入现有素材、
                                    粘贴图片，然后把内容推进到预览与发布确认页。
                                </p>
                                <div className="mt-5 flex flex-wrap gap-3">
                                    <span className="homepage-level-pill px-3 py-2 text-sm font-medium">纯文本工作流</span>
                                    <span className="homepage-level-pill px-3 py-2 text-sm font-medium">支持图片粘贴</span>
                                    <span className="homepage-level-pill px-3 py-2 text-sm font-medium">主题即时预览</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <input type="file" id="theme-upload" accept=".json" className="hidden" onChange={onThemeUpload} />
                        <Button
                            size="sm"
                            className="homepage-ghost-btn px-4 py-3 text-sm font-medium"
                            onClick={() => document.getElementById('theme-upload')?.click()}
                        >
                            <Palette size={16} />
                            导入主题
                        </Button>

                        <input type="file" id="md-upload" accept=".md" className="hidden" onChange={onFileUpload} />
                        <Button
                            size="sm"
                            className="homepage-ghost-btn px-4 py-3 text-sm font-medium"
                            onClick={() => document.getElementById('md-upload')?.click()}
                        >
                            <Upload size={16} />
                            导入 Markdown
                        </Button>

                        <Button onClick={onPreview} size="lg" className="homepage-cta rounded-[14px] px-5 py-3 text-sm font-semibold md:px-6" lang="en">
                            OPEN PREVIEW
                            <ArrowRight size={18} />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="grid gap-6">
                        <div
                            className="homepage-panel relative overflow-hidden p-6 md:p-7"
                            style={{
                                backgroundImage:
                                    "linear-gradient(135deg, rgba(5,8,22,0.94) 0%, rgba(7,14,26,0.76) 40%, rgba(10,20,36,0.92) 100%), url('/assets/bg.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,213,0,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(0,255,204,0.08),transparent_22%)]" />
                            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-2xl">
                                    <div className="homepage-section-kicker text-[10px] md:text-xs">Writing console</div>
                                    <div lang="en" className="mt-4 font-en-display text-xl leading-[1.45] text-white md:text-2xl">
                                        PREPARE THE ARTICLE BEFORE FINAL PREVIEW
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base md:leading-8">
                                        编辑区保持源 Markdown 不变，方便你持续加工内容；预览区再负责样式呈现、
                                        HTML 复制和公众号草稿同步。
                                    </p>
                                </div>

                                <div className="lab-chip self-start px-4 py-3">
                                    <div className="homepage-section-kicker text-[10px] md:text-xs">Buffer</div>
                                    <div className="mt-2 text-2xl font-semibold text-white">{markdown.length}</div>
                                    <div className="text-sm text-slate-300">字符</div>
                                </div>
                            </div>
                        </div>

                        <div className="lab-panel overflow-hidden p-0">
                            <div className="border-b border-[#243042] px-6 py-5 md:px-7">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="homepage-section-kicker text-[10px] md:text-xs">Markdown input</div>
                                        <div className="mt-3 text-xl font-semibold text-white md:text-2xl">正文编辑区</div>
                                    </div>
                                    <div className="text-sm leading-7 text-slate-400">
                                        支持直接粘贴图片、导入 `.md` 文件，并保留纯文本结构。
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0c1321] p-4 md:p-6">
                                <textarea
                                    ref={textareaRef}
                                    className="pixel-input pixel-scroll min-h-[560px] w-full resize-none bg-[#fcfaf4] px-4 py-4 text-base leading-[1.9] text-neo-ink md:min-h-[640px] md:px-6 md:py-6"
                                    value={markdown}
                                    onChange={(e) => setMarkdown(e.target.value)}
                                    onPaste={handlePaste}
                                    spellCheck={false}
                                    placeholder="# 开始写作..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="lab-panel p-6 md:p-7">
                            <div className="homepage-section-kicker text-[10px] md:text-xs">Operations</div>
                            <div className="mt-4 grid gap-4">
                                <div className="lab-panel-muted bg-[#131d2c] px-4 py-4">
                                    <div className="flex items-start gap-3">
                                        <FileText className="mt-1 shrink-0 text-cyan-300" size={18} />
                                        <div>
                                            <div className="text-base text-white">导入现有 Markdown 素材</div>
                                            <div className="mt-2 text-sm leading-[1.8] text-slate-300">把已有文章直接拖进当前工作区，继续精修内容结构。</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lab-panel-muted bg-[#111b2a] px-4 py-4">
                                    <div className="flex items-start gap-3">
                                        <ImageIcon className="mt-1 shrink-0 text-[#FFD500]" size={18} />
                                        <div>
                                            <div className="text-base text-white">从剪贴板粘贴图片</div>
                                            <div className="mt-2 text-sm leading-[1.8] text-slate-300">图片会转成 Base64 Markdown 片段，直接插入光标位置。</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lab-panel-muted bg-[#0f1a2b] px-4 py-4">
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="mt-1 shrink-0 text-[#9acb59]" size={18} />
                                        <div>
                                            <div className="text-base text-white">主题只影响呈现，不改源文</div>
                                            <div className="mt-2 text-sm leading-[1.8] text-slate-300">导入主题后可立即进入预览验证版式，但 Markdown 内容保持独立。</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lab-panel p-6 md:p-7">
                            <div lang="en" className="font-en-display text-lg leading-[1.5] text-white md:text-xl">
                                CHECKLIST
                            </div>
                            <div className="mt-4 grid gap-3">
                                <div className="lab-panel-muted px-4 py-3 text-sm leading-[1.8] text-slate-200">1. 先确认文章标题使用一级标题 `#`。</div>
                                <div className="lab-panel-muted px-4 py-3 text-sm leading-[1.8] text-slate-200">2. 控制正文段落长度，预览时更容易判断层级。</div>
                                <div className="lab-panel-muted px-4 py-3 text-sm leading-[1.8] text-slate-200">3. 准备完成后进入预览区，检查复制与草稿同步链路。</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
