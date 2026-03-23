import React, { useMemo, useRef } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  FileText,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Upload,
} from 'lucide-react';
import type { EditorMode } from '../types/publish';

interface EditorProps {
  editorMode: EditorMode;
  onEditorModeChange: (mode: EditorMode) => void;
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
  editorMode,
  onEditorModeChange,
  markdown,
  setMarkdown,
  onBack,
  onPreview,
  onThemeUpload,
  onFileUpload,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const themeUploadRef = useRef<HTMLInputElement>(null);
  const markdownUploadRef = useRef<HTMLInputElement>(null);
  const isArticleMode = editorMode === 'article';

  const stats = useMemo(() => {
    const trimmed = markdown.trim();
    const headings = markdown.match(/^#{1,6}\s/mg)?.length ?? 0;
    const imageCount = markdown.match(/!\[[^\]]*\]\(/g)?.length ?? 0;

    return {
      characters: markdown.length,
      paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0,
      headings,
      imageCount,
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

  const ModeButton = ({
    mode,
    label,
  }: {
    mode: EditorMode;
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => onEditorModeChange(mode)}
      data-active={editorMode === mode}
      className="studio-flow-switcher-btn"
    >
      <span>{label}</span>
    </button>
  );

  return (
    <div className="landing-flow-shell studio-flow-shell landing-flow-font px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1480px]">
        <div className="studio-flow-page-head">
          <div className="studio-flow-page-intro">
            <button type="button" onClick={onBack} className="studio-flow-icon-btn" aria-label="返回首页">
              <ChevronLeft strokeWidth={3} />
            </button>
            <div className="max-w-[920px]">
              <div className="studio-flow-kicker">Writing desk</div>
              <h1 className="studio-flow-title">{isArticleMode ? '文章模式编辑台' : '卡片模式编辑台'}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.94rem] font-semibold text-[#1d1d1f]/58">
                <span className="rounded-full border border-[#1d1d1f]/10 bg-white/72 px-4 py-2 shadow-[0_8px_20px_rgba(17,17,17,0.05)]">
                  {isArticleMode ? '长文编辑 / 微信预览' : 'H1 封面 / H2 分页'}
                </span>
                <span className="rounded-full border border-[#1d1d1f]/10 bg-white/72 px-4 py-2 shadow-[0_8px_20px_rgba(17,17,17,0.05)]">
                  {isArticleMode ? '支持主题 JSON' : '内建卡片主题'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 xl:items-end">
            <div className="studio-flow-switcher" aria-label="编辑模式切换">
              <ModeButton mode="article" label="ARTICLE" />
              <ModeButton mode="card" label="CARD" />
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
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

            <div className="flex min-h-[24px] items-center xl:justify-end">
              {isArticleMode ? (
                <>
                  <input ref={themeUploadRef} type="file" accept=".json" className="hidden" onChange={onThemeUpload} />
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-[0.95rem] font-semibold text-[#1d1d1f]/62 transition hover:text-[#1d1d1f]"
                    onClick={() => themeUploadRef.current?.click()}
                  >
                    <Palette size={15} />
                    导入主题 JSON
                  </button>
                </>
              ) : (
                <span className="text-[0.95rem] font-semibold text-[#1d1d1f]/48">卡片模式固定使用内建主题</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="studio-flow-panel studio-flow-panel--editor">
            <div className="studio-flow-panel-head">
              <div>
                <div className="studio-flow-kicker">Markdown input</div>
                <div className="studio-flow-panel-title">
                  {isArticleMode ? '文章正文编辑区' : '卡片 Markdown 编辑区'}
                </div>
              </div>
              <div className="studio-flow-panel-note">
                {isArticleMode
                  ? '支持直接粘贴图片、导入 `.md` 文件，并保留适合微信公众号长文的纯文本结构。'
                  : '卡片模式要求用 `#` 写封面标题，再用多个 `##` section 定义每一张图片页。'}
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
                placeholder={isArticleMode ? '# 开始写公众号长文...' : '# 写卡片标题\n\n## 第一张卡片\n这里写第一页正文...'}
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
                统计读数始终针对当前模式的草稿，不会和另一套内容混在一起。
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
                    <div className="studio-flow-note-title">
                      {isArticleMode ? '导入文章 Markdown' : '导入卡片 Markdown'}
                    </div>
                    <div className="studio-flow-note-copy">
                      {isArticleMode
                        ? '把已有长文拖进当前工作区，继续精修公众号文章结构。'
                        : '把卡片草稿拖进当前工作区，按 H1/H2 结构继续精修每一页。'}
                    </div>
                  </div>
                </div>
                <div className="studio-flow-note-card">
                  <div className="studio-flow-note-icon studio-flow-note-icon--yellow">
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <div className="studio-flow-note-title">从剪贴板粘贴图片</div>
                    <div className="studio-flow-note-copy">
                      图片会转成 Base64 Markdown 片段，直接插入光标位置。
                    </div>
                  </div>
                </div>
                <div className="studio-flow-note-card">
                  <div className="studio-flow-note-icon studio-flow-note-icon--green">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="studio-flow-note-title">
                      {isArticleMode ? '文章主题与源文解耦' : '卡片主题固定，内容结构更重要'}
                    </div>
                    <div className="studio-flow-note-copy">
                      {isArticleMode
                        ? '首页选的主题和自定义主题只影响文章模式的呈现，不会改动源文内容。'
                        : '卡片模式不复用公众号 theme，重点是把 H1/H2 结构写清楚，每个 H2 只负责一页。'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="studio-flow-panel">
              <div className="studio-flow-kicker">Checklist</div>
              <div className="mt-4 grid gap-3">
                {isArticleMode ? (
                  <>
                    <div className="studio-flow-check-item">1. 先确认文章标题使用一级标题 `#`。</div>
                    <div className="studio-flow-check-item">2. 控制正文段落长度，预览时更容易判断层级。</div>
                    <div className="studio-flow-check-item">3. 准备完成后进入预览区，检查微信复制与草稿同步链路。</div>
                  </>
                ) : (
                  <>
                    <div className="studio-flow-check-item">1. 一级标题 `#` 只用于封面页，不写额外正文。</div>
                    <div className="studio-flow-check-item">2. 每个二级标题 `##` 都会生成一张图片页，页内内容写在该 H2 下方。</div>
                    <div className="studio-flow-check-item">3. 如果某个 H2 section 内容过长，预览会直接提示该页溢出，需要你手动精简。</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
