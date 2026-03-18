import React, { useMemo, useState } from 'react';
import {
    AlertCircle,
    Check,
    ChevronLeft,
    Copy,
    Layout,
    Monitor,
    Send,
    Smartphone
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import WeChatRenderer from './WeChatRenderer';
import { ITheme } from '../types/ITheme';
import {
    buildDraftHtmlFromPreview,
    CLASSIC_PIXEL_API_SAFE_THEME_ID,
    extractDraftTitleFromMarkdown
} from '../lib/wechatDraft';

interface PreviewProps {
    markdown: string;
    theme: ITheme;
    currentThemeId: string;
    copied: boolean;
    onBack: () => void;
    onCopy: () => void;
}

type ViewMode = 'mobile' | 'pc' | 'dual';

export const Preview: React.FC<PreviewProps> = ({
    markdown,
    theme,
    currentThemeId,
    copied,
    onBack,
    onCopy
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('dual');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

    const supportsDraftSync = currentThemeId === CLASSIC_PIXEL_API_SAFE_THEME_ID;
    const draftTitle = useMemo(() => extractDraftTitleFromMarkdown(markdown), [markdown]);

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
            setSyncMessage({ type: 'info', text: 'v1 仅支持“经典像素 API"主题同步草稿。你仍可继续使用复制功能。' });
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: draftTitle,
                    contentHtml
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || data.error || '同步草稿失败');
            }

            setSyncMessage({
                type: 'success',
                text: `草稿已创建成功${data.mediaId ? `，media_id: ${data.mediaId}` : ''}。如需继续调整，仍可使用复制功能。`
            });
        } catch (error) {
            setSyncMessage({
                type: 'error',
                text: `${error instanceof Error ? error.message : '同步草稿失败'}。你仍可继续使用复制功能。`
            });
        } finally {
            setIsSyncing(false);
        }
    };

    const SwitcherButton = ({
        mode,
        icon: Icon,
        label
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

    return (
        <div className="landing-flow-shell studio-flow-shell landing-flow-font px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-[1520px]">
                <div className="studio-flow-page-head">
                    <div className="studio-flow-page-intro">
                        <button type="button" onClick={onBack} className="studio-flow-icon-btn" aria-label="返回编辑台">
                            <ChevronLeft strokeWidth={3} />
                        </button>
                        <div>
                            <div className="studio-flow-kicker">Preview workflow</div>
                            <h1 className="studio-flow-title">预览与发布确认</h1>
                            <p className="studio-flow-copy">
                                这一步只做最终呈现确认。你可以切换移动端和桌面端版式，复制 HTML，或者在 API-safe
                                主题下直接同步微信公众号草稿。
                            </p>
                            <div className="studio-flow-chip-row">
                                <span className="studio-flow-chip">真实渲染结果</span>
                                <span className="studio-flow-chip">HTML 复制链路</span>
                                <span className="studio-flow-chip">公众号草稿同步</span>
                            </div>
                        </div>
                    </div>

                    <div className="studio-flow-toolbar">
                        <div className="studio-flow-switcher" aria-label="预览模式切换">
                            <SwitcherButton mode="mobile" icon={Smartphone} label="MOBILE" />
                            <SwitcherButton mode="pc" icon={Monitor} label="DESKTOP" />
                            <SwitcherButton mode="dual" icon={Layout} label="DUAL" />
                        </div>

                        <div className="studio-flow-action-row">
                            <button
                                type="button"
                                onClick={handleDraftSync}
                                disabled={isSyncing}
                                className={supportsDraftSync ? 'landing-flow-secondary-btn' : 'landing-flow-secondary-btn opacity-80'}
                            >
                                <Send size={16} />
                                {isSyncing ? '同步中' : '同步草稿'}
                            </button>
                            <button type="button" onClick={onCopy} className={copied ? 'landing-flow-secondary-btn' : 'landing-flow-primary-btn'}>
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? '已复制 HTML' : '复制 HTML'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
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
                                            ? '当前主题为"经典像素 API"，可以直接创建微信公众号草稿。系统会使用 Markdown 的首个 H1 作为草稿标题。'
                                            : '当前主题仍建议使用 HTML 复制流程。若需要公众号草稿同步，请切换到"经典像素 API"主题。')}
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

                    <div className="grid gap-6">
                        <div className="studio-flow-panel">
                            <div className="studio-flow-kicker">Title source</div>
                            <div className="mt-4 studio-flow-panel-title">草稿标题</div>
                            <div className="studio-flow-source-value">
                                {draftTitle || '当前 Markdown 还没有一级标题'}
                            </div>
                            <div className="studio-flow-panel-note">
                                草稿同步会把首个一级标题作为文章标题，正文里对应标题容器会自动移除，避免重复出现。
                            </div>
                        </div>

                        <div className="studio-flow-panel">
                            <div className="studio-flow-kicker">Publish checklist</div>
                            <div className="mt-4 grid gap-4">
                                <div className="studio-flow-check-item">1. 先在手机端确认正文宽度、标题节奏和图片比例。</div>
                                <div className="studio-flow-check-item">2. 再在桌面端校对长表格、代码块和引用容器的边界。</div>
                                <div className="studio-flow-check-item">3. 使用复制或草稿同步前，确认一级标题已经填写完成。</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
