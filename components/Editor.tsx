import React, { useMemo, useRef } from 'react';
import {
    ArrowRight,
    ChevronLeft,
    FileText,
    Image as ImageIcon,
    Palette,
    Sparkles,
    Upload
} from 'lucide-react';

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
    const themeUploadRef = useRef<HTMLInputElement>(null);
    const markdownUploadRef = useRef<HTMLInputElement>(null);

    const stats = useMemo(() => {
        const trimmed = markdown.trim();
        const headings = markdown.match(/^#{1,6}\s/mg)?.length ?? 0;
        const imageCount = markdown.match(/!\[[^\]]*\]\(/g)?.length ?? 0;

        return {
            characters: markdown.length,
            paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0,
            headings,
            imageCount
        };
    }, [markdown]);

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
        <div className="landing-flow-shell studio-flow-shell landing-flow-font px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-[1480px]">
                <div className="studio-flow-page-head">
                    <div className="studio-flow-page-intro">
                        <button type="button" onClick={onBack} className="studio-flow-icon-btn" aria-label="返回首页">
                            <ChevronLeft strokeWidth={3} />
                        </button>
                        <div>
                            <div className="studio-flow-kicker">Writing desk</div>
                            <h1 className="studio-flow-title">Markdown 编辑台</h1>
                            <p className="studio-flow-copy">
                                这里是和首页同一套工作室风格的正式写作工位。继续整理 Markdown、导入现有素材、
                                粘贴图片，然后把内容推进到预览与发布确认页。
                            </p>
                            <div className="studio-flow-chip-row">
                                <span className="studio-flow-chip">纯文本工作流</span>
                                <span className="studio-flow-chip">支持图片粘贴</span>
                                <span className="studio-flow-chip">主题即时预览</span>
                            </div>
                        </div>
                    </div>

                    <div className="studio-flow-action-row">
                        <input ref={themeUploadRef} type="file" accept=".json" className="hidden" onChange={onThemeUpload} />
                        <button
                            type="button"
                            className="landing-flow-secondary-btn"
                            onClick={() => themeUploadRef.current?.click()}
                        >
                            <Palette size={16} />
                            导入主题
                        </button>

                        <input ref={markdownUploadRef} type="file" accept=".md" className="hidden" onChange={onFileUpload} />
                        <button
                            type="button"
                            className="landing-flow-secondary-btn"
                            onClick={() => markdownUploadRef.current?.click()}
                        >
                            <Upload size={16} />
                            导入 Markdown
                        </button>

                        <button type="button" className="landing-flow-primary-btn" onClick={onPreview}>
                            OPEN PREVIEW
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="studio-flow-panel studio-flow-panel--editor">
                        <div className="studio-flow-panel-head">
                            <div>
                                <div className="studio-flow-kicker">Markdown input</div>
                                <div className="studio-flow-panel-title">正文编辑区</div>
                            </div>
                            <div className="studio-flow-panel-note">
                                支持直接粘贴图片、导入 `.md` 文件，并保留纯文本结构。
                            </div>
                        </div>

                        <div className="studio-flow-editor-stage">
                            <textarea
                                ref={textareaRef}
                                className="studio-flow-textarea pixel-scroll"
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                onPaste={handlePaste}
                                spellCheck={false}
                                placeholder="# 开始写作..."
                            />
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="studio-flow-panel">
                            <div className="studio-flow-kicker">Live counters</div>
                            <div className="studio-flow-compact-stat-grid">
                                <div className="studio-flow-compact-stat studio-flow-compact-stat--yellow">
                                    <div className="studio-flow-compact-stat-label">Characters</div>
                                    <div className="studio-flow-compact-stat-value">{stats.characters}</div>
                                </div>
                                <div className="studio-flow-compact-stat studio-flow-compact-stat--blue">
                                    <div className="studio-flow-compact-stat-label">Paragraphs</div>
                                    <div className="studio-flow-compact-stat-value">{stats.paragraphs}</div>
                                </div>
                                <div className="studio-flow-compact-stat studio-flow-compact-stat--green">
                                    <div className="studio-flow-compact-stat-label">Headings</div>
                                    <div className="studio-flow-compact-stat-value">{stats.headings}</div>
                                </div>
                                <div className="studio-flow-compact-stat studio-flow-compact-stat--pink">
                                    <div className="studio-flow-compact-stat-label">Images</div>
                                    <div className="studio-flow-compact-stat-value">{stats.imageCount}</div>
                                </div>
                            </div>
                            <div className="studio-flow-panel-note">
                                统计改成侧边实时读数，不再挤占正文工作台高度。
                            </div>
                        </div>

                        <div className="studio-flow-panel">
                            <div className="studio-flow-kicker">Operations</div>
                            <div className="mt-4 grid gap-4">
                                <div className="studio-flow-note-card">
                                    <div className="studio-flow-note-icon">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <div className="studio-flow-note-title">导入现有 Markdown 素材</div>
                                        <div className="studio-flow-note-copy">把已有文章拖进当前工作区，继续精修内容结构。</div>
                                    </div>
                                </div>
                                <div className="studio-flow-note-card">
                                    <div className="studio-flow-note-icon studio-flow-note-icon--yellow">
                                        <ImageIcon size={18} />
                                    </div>
                                    <div>
                                        <div className="studio-flow-note-title">从剪贴板粘贴图片</div>
                                        <div className="studio-flow-note-copy">图片会转成 Base64 Markdown 片段，直接插入光标位置。</div>
                                    </div>
                                </div>
                                <div className="studio-flow-note-card">
                                    <div className="studio-flow-note-icon studio-flow-note-icon--green">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <div className="studio-flow-note-title">主题只影响呈现，不改源文</div>
                                        <div className="studio-flow-note-copy">导入主题后可立即进入预览验证版式，但 Markdown 内容保持独立。</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="studio-flow-panel">
                            <div className="studio-flow-kicker">Checklist</div>
                            <div className="mt-4 grid gap-3">
                                <div className="studio-flow-check-item">1. 先确认文章标题使用一级标题 `#`。</div>
                                <div className="studio-flow-check-item">2. 控制正文段落长度，预览时更容易判断层级。</div>
                                <div className="studio-flow-check-item">3. 准备完成后进入预览区，检查复制与草稿同步链路。</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
