import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Copy,
  Image as ImageIcon,
  Layout,
  Monitor,
  Send,
  Smartphone,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import WeChatRenderer from './WeChatRenderer';
import { XiaohongshuCard } from './XiaohongshuCard';
import { ITheme } from '../types/ITheme';
import type { EditorMode } from '../types/publish';
import {
  buildDraftHtmlFromPreview,
  CLASSIC_PIXEL_API_SAFE_THEME_ID,
  extractDraftTitleFromMarkdown,
} from '../lib/wechatDraft';
import {
  exportXhsImages,
  parseCardDocument,
  XHS_MAX_PAGES,
} from '../lib/xiaohongshu';

interface PreviewProps {
  editorMode: EditorMode;
  onEditorModeChange: (mode: EditorMode) => void;
  markdown: string;
  theme: ITheme;
  currentThemeId: string;
  copied: boolean;
  onBack: () => void;
  onCopy: () => void;
}

type ViewMode = 'mobile' | 'pc' | 'dual';
type StatusTone = 'success' | 'error' | 'info';

export const Preview: React.FC<PreviewProps> = ({
  editorMode,
  onEditorModeChange,
  markdown,
  theme,
  currentThemeId,
  copied,
  onBack,
  onCopy,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('dual');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExportingCards, setIsExportingCards] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: StatusTone; text: string } | null>(null);
  const [cardMessage, setCardMessage] = useState<{ type: StatusTone; text: string } | null>(null);
  const [overflowPages, setOverflowPages] = useState<number[]>([]);

  const isArticleMode = editorMode === 'article';
  const cardPageBodyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardExportRefs = useRef<Array<HTMLElement | null>>([]);
  const measurementTimerRef = useRef<number | null>(null);

  const supportsDraftSync = currentThemeId === CLASSIC_PIXEL_API_SAFE_THEME_ID;
  const draftTitle = useMemo(() => extractDraftTitleFromMarkdown(markdown), [markdown]);
  const cardResult = useMemo(() => parseCardDocument(markdown), [markdown]);
  const cardDocument = cardResult.document;

  const measureCardOverflow = useCallback(() => {
    const nextOverflowPages = cardPageBodyRefs.current.flatMap((node, index) => {
      if (!node) {
        return [];
      }

      return node.scrollHeight > node.clientHeight + 2 ? [index + 1] : [];
    });

    setOverflowPages((previous) => {
      const previousKey = previous.join(',');
      const nextKey = nextOverflowPages.join(',');
      return previousKey === nextKey ? previous : nextOverflowPages;
    });
  }, []);

  const scheduleCardMeasurement = useCallback(() => {
    if (measurementTimerRef.current) {
      window.clearTimeout(measurementTimerRef.current);
    }

    measurementTimerRef.current = window.setTimeout(() => {
      measureCardOverflow();
    }, 160);
  }, [measureCardOverflow]);

  useEffect(() => {
    if (isArticleMode) {
      setOverflowPages([]);
      return;
    }

    scheduleCardMeasurement();

    const resizeHandler = () => scheduleCardMeasurement();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);

      if (measurementTimerRef.current) {
        window.clearTimeout(measurementTimerRef.current);
      }
    };
  }, [isArticleMode, markdown, scheduleCardMeasurement]);

  useEffect(() => {
    cardPageBodyRefs.current = cardPageBodyRefs.current.slice(0, cardDocument.pages.length);
    cardExportRefs.current = cardExportRefs.current.slice(0, cardDocument.pages.length);
  }, [cardDocument.pages.length]);

  const cardErrors = useMemo(() => {
    const overflowErrors = overflowPages.map(
      (pageNumber) => `第 ${pageNumber} 页内容超出卡片高度，请精简对应的 H2 section。`
    );

    return [...cardResult.errors, ...overflowErrors];
  }, [cardResult.errors, overflowPages]);

  const cardTone: StatusTone = cardMessage?.type ?? (cardErrors.length > 0 ? 'error' : 'success');
  const cardTitle = cardMessage
    ? cardMessage.type === 'success'
      ? '卡片导出已更新'
      : cardMessage.type === 'error'
        ? '卡片导出暂未完成'
        : '卡片模式提示'
    : cardErrors.length > 0
      ? '导出前需修正'
      : '卡片预览已就绪';
  const cardDescription = cardMessage?.text ??
    (cardErrors.length > 0
      ? cardErrors.join(' ')
      : `已解析 1 张封面和 ${Math.max(cardDocument.pages.length - 1, 0)} 张正文卡片。每个 H2 section 都会对应一张图片页。`);

  const syncTone = syncMessage?.type ?? (supportsDraftSync ? 'success' : 'info');
  const syncTitle = syncMessage
    ? syncMessage.type === 'success'
      ? '草稿同步完成'
      : syncMessage.type === 'error'
        ? '同步暂未完成'
        : '同步提示'
    : supportsDraftSync
      ? '草稿同步已启用'
      : '当前主题更适合复制流程';

  const PreviewFrame = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`w-full min-h-full box-border bg-white ${mobile ? 'px-4 py-4' : 'px-6 py-6'}`}>
      <WeChatRenderer content={markdown} theme={theme} />
    </div>
  );

  const handleDraftSync = async () => {
    if (!supportsDraftSync) {
      setSyncMessage({ type: 'info', text: 'v1 仅支持“经典像素 API”主题同步草稿。你仍可继续使用复制功能。' });
      return;
    }

    if (!draftTitle) {
      setSyncMessage({ type: 'error', text: '请先在 Markdown 中提供一个一级标题（# 标题），再同步草稿。' });
      return;
    }

    const node = document.getElementById('wechat-output');
    if (!node) {
      setSyncMessage({ type: 'error', text: '未找到预览内容，无法生成草稿正文。' });
      return;
    }

    setIsSyncing(true);
    setSyncMessage({ type: 'info', text: '正在同步到微信公众号草稿箱…' });

    try {
      const contentHtml = buildDraftHtmlFromPreview(node);
      const response = await fetch('/api/wechat/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: draftTitle,
          contentHtml,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || '同步草稿失败');
      }

      setSyncMessage({
        type: 'success',
        text: `草稿已创建成功${data.mediaId ? `，media_id: ${data.mediaId}` : ''}。如需继续调整，仍可使用复制功能。`,
      });
    } catch (error) {
      setSyncMessage({
        type: 'error',
        text: `${error instanceof Error ? error.message : '同步草稿失败'}。你仍可继续使用复制功能。`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCardExport = async () => {
    if (cardErrors.length > 0) {
      setCardMessage({ type: 'error', text: cardErrors.join(' ') });
      return;
    }

    setIsExportingCards(true);
    setCardMessage({ type: 'info', text: '正在导出卡片模式 PNG 图片…' });

    try {
      await exportXhsImages(cardDocument, cardExportRefs.current);
      setCardMessage({
        type: 'success',
        text: `已开始导出 ${cardDocument.pages.length} 张图片。若浏览器拦截多文件下载，请允许当前站点继续下载。`,
      });
    } catch (error) {
      setCardMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '导出卡片图片失败。',
      });
    } finally {
      setIsExportingCards(false);
    }
  };

  const ViewButton = ({
    mode,
    icon: Icon,
    label,
  }: {
    mode: ViewMode;
    icon: typeof Smartphone;
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => setViewMode(mode)}
      data-active={viewMode === mode}
      className="studio-flow-switcher-btn"
    >
      <Icon size={18} strokeWidth={3} />
      <span>{label}</span>
    </button>
  );

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

  const renderArticlePreview = () => (
    <div className="grid gap-6">
      <section
        className={`studio-flow-status-card studio-flow-status-card--${syncTone}`}
        role="status"
        aria-live="polite"
      >
        <div className="studio-flow-status-icon">
          <AlertCircle size={18} />
        </div>
        <div>
          <div className="studio-flow-status-title">{syncTitle}</div>
          <p className="studio-flow-status-copy">
            {syncMessage?.text ||
              (supportsDraftSync
                ? '当前主题为“经典像素 API”，可以直接创建微信公众号草稿。系统会使用 Markdown 的首个 H1 作为草稿标题。'
                : '当前主题仍建议使用 HTML 复制流程。若需要公众号草稿同步，请切换到“经典像素 API”主题。')}
          </p>
        </div>
      </section>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {viewMode === 'mobile' && (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-[408px]"
            >
              <div className="studio-flow-preview-window studio-flow-preview-window--mobile">
                <div className="studio-flow-window-head">
                  <div>
                    <div className="studio-flow-window-kicker">Mobile view</div>
                    <div className="studio-flow-window-title">公众号手机端阅读体验</div>
                  </div>
                </div>
                <div className="studio-flow-preview-surface studio-flow-preview-surface--mobile pixel-scroll">
                  <PreviewFrame mobile />
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'pc' && (
            <motion.div
              key="pc"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="studio-flow-preview-window studio-flow-preview-window--desktop">
                <div className="studio-flow-window-head">
                  <div>
                    <div className="studio-flow-window-kicker">Desktop view</div>
                    <div className="studio-flow-window-title">大屏校对与导出确认</div>
                  </div>
                  <div className="studio-flow-window-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="studio-flow-preview-surface studio-flow-preview-surface--desktop pixel-scroll">
                  <div className="studio-flow-preview-document studio-flow-preview-document--desktop">
                    <PreviewFrame />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'dual' && (
            <motion.div
              key="dual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-6 xl:grid-cols-[392px_minmax(0,1fr)]"
            >
              <div className="studio-flow-preview-window studio-flow-preview-window--mobile">
                <div className="studio-flow-window-head">
                  <div>
                    <div className="studio-flow-window-kicker">Mobile view</div>
                    <div className="studio-flow-window-title">手机端排版</div>
                  </div>
                </div>
                <div className="studio-flow-preview-surface studio-flow-preview-surface--dual-mobile pixel-scroll">
                  <PreviewFrame mobile />
                </div>
              </div>

              <div className="studio-flow-preview-window studio-flow-preview-window--desktop">
                <div className="studio-flow-window-head">
                  <div>
                    <div className="studio-flow-window-kicker">Desktop view</div>
                    <div className="studio-flow-window-title">桌面端校对</div>
                  </div>
                  <div className="studio-flow-window-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="studio-flow-preview-surface studio-flow-preview-surface--dual-desktop pixel-scroll">
                  <div className="studio-flow-preview-document studio-flow-preview-document--desktop">
                    <PreviewFrame />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderCardPreview = () => (
    <div className="grid gap-6">
      <section
        className={`studio-flow-status-card studio-flow-status-card--${cardTone}`}
        role="status"
        aria-live="polite"
      >
        <div className="studio-flow-status-icon">
          <AlertCircle size={18} />
        </div>
        <div>
          <div className="studio-flow-status-title">{cardTitle}</div>
          <p className="studio-flow-status-copy">{cardDescription}</p>
        </div>
      </section>

      <div className="studio-flow-preview-window">
        <div className="studio-flow-window-head">
          <div>
            <div className="studio-flow-window-kicker">Card mode</div>
            <div className="studio-flow-window-title">卡片预览与出图确认</div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <span className="studio-flow-chip">{cardDocument.pages.length} / {XHS_MAX_PAGES} pages</span>
            <span className="studio-flow-chip">H2 per page</span>
            <span className="studio-flow-chip">PNG export</span>
          </div>
        </div>

        <div className="rounded-[28px] border-[3px] border-[#1d1d1f] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(255,241,214,0.94))] p-4 md:p-6">
          {cardDocument.pages.length > 0 ? (
            <div className="grid justify-center gap-6 xl:grid-cols-2">
              {cardDocument.pages.map((page, index) => (
                <div key={`card-page-${page.index}`} className="flex justify-center">
                  <XiaohongshuCard
                    page={page}
                    title={cardDocument.title}
                    totalPages={cardDocument.pages.length}
                    exportRef={(node) => {
                      cardExportRefs.current[index] = node;
                    }}
                    bodyRef={(node) => {
                      cardPageBodyRefs.current[index] = node;
                    }}
                    onContentLoad={scheduleCardMeasurement}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border-[3px] border-dashed border-[#1d1d1f]/30 bg-white/70 px-6 py-12 text-center">
              <div className="text-[1.6rem] font-black tracking-[-0.05em] text-[#1d1d1f]">还没有可导出的卡片</div>
              <p className="mt-3 text-[0.96rem] leading-[1.8] text-[#1d1d1f]/68">
                卡片模式至少需要 1 个 `#` 标题和 1 个 `##` section，才能生成封面页和正文页。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="landing-flow-shell studio-flow-shell landing-flow-font px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1520px]">
        <div className="studio-flow-page-head xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start xl:gap-x-8 xl:gap-y-4">
          <div className="studio-flow-page-intro max-w-none">
            <button type="button" onClick={onBack} className="studio-flow-icon-btn" aria-label="返回编辑台">
              <ChevronLeft strokeWidth={3} />
            </button>
            <div>
              <div className="studio-flow-kicker">Preview workflow</div>
              <h1 className="studio-flow-title">{isArticleMode ? '文章模式预览' : '卡片模式预览'}</h1>
              <div className="studio-flow-chip-row">
                {isArticleMode ? (
                  <>
                    <span className="studio-flow-chip">真实渲染结果</span>
                    <span className="studio-flow-chip">复制 HTML</span>
                    <span className="studio-flow-chip">公众号草稿同步</span>
                  </>
                ) : (
                  <>
                    <span className="studio-flow-chip">H1 封面页</span>
                    <span className="studio-flow-chip">H2 正文页</span>
                    <span className="studio-flow-chip">图片导出</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="studio-flow-toolbar xl:self-start">
            {isArticleMode ? (
              <div className="grid gap-4 xl:justify-items-end">
                <div className="flex w-full flex-col gap-4 xl:w-auto xl:flex-row xl:flex-nowrap xl:items-start xl:justify-end">
                  <div className="studio-flow-switcher xl:min-w-[440px] xl:flex-nowrap" aria-label="预览模式切换">
                    <ViewButton mode="mobile" icon={Smartphone} label="MOBILE" />
                    <ViewButton mode="pc" icon={Monitor} label="DESKTOP" />
                    <ViewButton mode="dual" icon={Layout} label="DUAL" />
                  </div>
                  <div className="studio-flow-switcher xl:flex-nowrap" aria-label="模式切换">
                    <ModeButton mode="article" label="ARTICLE" />
                    <ModeButton mode="card" label="CARD" />
                  </div>
                </div>

                <div className="studio-flow-action-row xl:flex-nowrap xl:pr-1">
                  <button
                    type="button"
                    onClick={handleDraftSync}
                    disabled={isSyncing}
                    className={supportsDraftSync ? 'landing-flow-secondary-btn' : 'landing-flow-secondary-btn opacity-80'}
                  >
                    <Send size={16} />
                    {isSyncing ? '同步中' : '同步草稿'}
                  </button>
                  <button
                    type="button"
                    onClick={onCopy}
                    className={copied ? 'landing-flow-secondary-btn' : 'landing-flow-primary-btn'}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? '已复制 HTML' : '复制 HTML'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="studio-flow-switcher" aria-label="模式切换">
                  <ModeButton mode="article" label="ARTICLE" />
                  <ModeButton mode="card" label="CARD" />
                </div>

                <div className="studio-flow-action-row">
                  <button
                    type="button"
                    onClick={handleCardExport}
                    disabled={isExportingCards}
                    className={cardErrors.length > 0 ? 'landing-flow-secondary-btn opacity-80' : 'landing-flow-primary-btn'}
                  >
                    <ImageIcon size={16} />
                    {isExportingCards ? '导出中' : '导出全部图片'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>{isArticleMode ? renderArticlePreview() : renderCardPreview()}</div>

          <div className="grid gap-6">
            <div className="studio-flow-panel">
              <div className="studio-flow-kicker">Title source</div>
              <div className="mt-4 studio-flow-panel-title">
                {isArticleMode ? '文章标题' : '封面标题'}
              </div>
              <div className="studio-flow-source-value">
                {(isArticleMode ? draftTitle : cardDocument.title) || '当前 Markdown 还没有一级标题'}
              </div>
              <div className="studio-flow-panel-note">
                {isArticleMode
                  ? '文章模式会把首个一级标题作为草稿标题，正文中对应标题容器会在同步时自动移除。'
                  : '卡片模式里 H1 只生成第 1 页封面标题，不参与后续正文卡片排版。'}
              </div>
            </div>

            <div className="studio-flow-panel">
              <div className="studio-flow-kicker">Package stats</div>
              <div className="mt-4 grid gap-3">
                {isArticleMode ? (
                  <>
                    <div className="studio-flow-check-item">
                      当前主题：{supportsDraftSync ? '经典像素 API，可同步草稿' : '非 API-safe，优先复制 HTML'}
                    </div>
                    <div className="studio-flow-check-item">微信链路会复用当前预览 DOM 序列化 HTML。</div>
                    <div className="studio-flow-check-item">复制与同步都建立在当前页面真实渲染结果上。</div>
                  </>
                ) : (
                  <>
                    <div className="studio-flow-check-item">
                      当前图片数：{cardDocument.pages.length} 页（封面 1 + 正文 {Math.max(cardDocument.pages.length - 1, 0)}）
                    </div>
                    <div className="studio-flow-check-item">卡片模式固定使用内建 3:4 卡片主题，不复用首页选中的文章 theme。</div>
                    <div className="studio-flow-check-item">卡片规则固定为 H1 封面、每个 H2 一页；H3/H4 只作为页内层级。</div>
                  </>
                )}
              </div>
            </div>

            <div className="studio-flow-panel">
              <div className="studio-flow-kicker">Publish checklist</div>
              <div className="mt-4 grid gap-4">
                {isArticleMode ? (
                  <>
                    <div className="studio-flow-check-item">1. 先在手机端确认正文宽度、标题节奏和图片比例。</div>
                    <div className="studio-flow-check-item">2. 再在桌面端校对长表格、代码块和引用容器的边界。</div>
                    <div className="studio-flow-check-item">3. 使用复制或草稿同步前，确认一级标题已经填写完成。</div>
                  </>
                ) : (
                  <>
                    <div className="studio-flow-check-item">1. 一级标题 `#` 只用于封面；每个 `##` 都会对应一张正文图片页。</div>
                    <div className="studio-flow-check-item">2. 如果 H1 和第一个 H2 之间存在正文内容，系统会直接报错，避免内容丢失。</div>
                    <div className="studio-flow-check-item">3. 某个 H2 section 溢出时，不会自动拆成两页；需要你手动精简该页内容。</div>
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
