import React, { useMemo, useState } from 'react';
import { ChevronLeft, Check, Copy, Smartphone, Monitor, Layout, Send, AlertCircle } from 'lucide-react';
import WeChatRenderer from './WeChatRenderer';
import { ITheme } from '../types/ITheme';
import { motion, AnimatePresence } from 'framer-motion';
import { buildDraftHtmlFromPreview, CLASSIC_PIXEL_API_SAFE_THEME_ID, extractDraftTitleFromMarkdown } from '../lib/wechatDraft';

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

    const PreviewFrame = ({ mobile = false }: { mobile?: boolean }) => (
        <div className={`w-full bg-white ${mobile ? 'px-4 py-4' : 'px-6 py-6'} min-h-full box-border`}>
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

    const SwitcherButton = ({ mode, icon: Icon, label }: { mode: ViewMode; icon: typeof Smartphone; label: string }) => (
        <button
            type="button"
            onClick={() => setViewMode(mode)}
            data-active={viewMode === mode}
            className="homepage-filter flex items-center gap-2 px-4 py-3 text-sm"
        >
            <Icon size={18} strokeWidth={3} />
            <span className="font-home-sans font-medium">{label}</span>
        </button>
    );

    return (
        <div className="lab-shell font-home-sans px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={onBack} className="homepage-ghost-btn h-12 w-12 p-0">
                            <ChevronLeft strokeWidth={3} />
                        </button>
                        <div>
                            <div className="homepage-section-kicker text-[10px] md:text-xs">Preview workflow</div>
                            <div className="mt-3 text-2xl font-semibold leading-[1.3] text-white md:text-3xl">预览与发布确认</div>
                            <p className="mt-2 text-sm leading-[1.8] text-slate-300 md:text-base">
                                这一步只做真实业务动作：确认最终排版，然后复制到公众号或走草稿同步链路。
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 xl:justify-items-end">
                        <div className="flex flex-wrap gap-4">
                            <SwitcherButton mode="mobile" icon={Smartphone} label="MOBILE" />
                            <SwitcherButton mode="pc" icon={Monitor} label="DESKTOP" />
                            <SwitcherButton mode="dual" icon={Layout} label="DUAL" />
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                type="button"
                                onClick={handleDraftSync}
                                disabled={isSyncing}
                                className={supportsDraftSync ? 'homepage-cta rounded-[14px] px-4 py-3 text-sm font-semibold disabled:opacity-60' : 'homepage-ghost-btn px-4 py-3 text-sm font-medium disabled:opacity-60'}
                            >
                                <Send strokeWidth={3} />
                                {isSyncing ? '同步中' : '同步草稿'}
                            </button>
                            <button type="button" onClick={onCopy} className={copied ? 'homepage-ghost-btn px-4 py-3 text-sm font-medium' : 'homepage-cta rounded-[14px] px-4 py-3 text-sm font-semibold'}>
                                {copied ? <><Check strokeWidth={3} /> 已复制</> : <><Copy strokeWidth={3} /> 复制 HTML</>}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_304px]">
                    <div className={`lab-panel p-6 md:p-8 ${syncMessage?.type === 'success'
                        ? 'bg-[#10241b]'
                        : syncMessage?.type === 'error'
                            ? 'bg-[#2a1714]'
                            : ''
                        }`}>
                        <div className="flex items-start gap-4">
                            <AlertCircle className="mt-1 shrink-0 text-cyan-300" size={18} />
                            <div>
                                <div className="text-lg leading-[1.6] text-white">{supportsDraftSync ? '草稿同步已启用' : '草稿同步范围提示'}</div>
                                <p className="mt-3 text-sm leading-[1.8] text-slate-300 md:text-base">
                                    {supportsDraftSync
                                        ? '当前主题为“经典像素 API”，可以直接创建微信公众号草稿。系统会使用 Markdown 的首个 H1 作为草稿标题。'
                                        : 'v1 仅支持“经典像素 API”主题同步草稿。其他主题仍建议使用现有复制流程。'}
                                </p>
                                {syncMessage && <p className="mt-3 text-sm leading-[1.8] text-slate-200 md:text-base">{syncMessage.text}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="lab-panel p-6 md:p-8">
                        <div className="homepage-section-kicker text-[10px] md:text-xs">Title source</div>
                        <div className="mt-3 text-base leading-[1.7] text-white">
                            {draftTitle || '当前 Markdown 还没有一级标题'}
                        </div>
                        <div className="mt-4 border-t border-[#243042]" />
                        <div className="mt-4 text-sm leading-[1.8] text-slate-300">
                            草稿同步会把首个一级标题作为文章标题，正文中对应模块会被移除，避免重复。
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {viewMode === 'mobile' && (
                            <motion.div
                                key="mobile"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mx-auto w-full max-w-[392px]"
                            >
                                <div className="lab-preview-frame p-4 md:p-6">
                                    <div className="homepage-section-kicker mb-4 text-[10px] md:text-xs">Mobile view</div>
                                    <div className="pixel-screen pixel-scroll h-[720px] overflow-y-auto bg-[#fcfaf4]">
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
                                exit={{ opacity: 0, scale: 1.04 }}
                                className="w-full"
                            >
                                <div className="lab-preview-frame p-4 md:p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="homepage-section-kicker text-[10px] md:text-xs">Desktop view</div>
                                        <div className="flex gap-2">
                                            <span className="h-3 w-3 rounded-full bg-[#fb7185]" />
                                            <span className="h-3 w-3 rounded-full bg-[#facc15]" />
                                            <span className="h-3 w-3 rounded-full bg-[#4ade80]" />
                                        </div>
                                    </div>
                                    <div className="pixel-screen pixel-scroll h-[768px] overflow-y-auto bg-[#fcfaf4]">
                                        <div className="mx-auto max-w-[736px]">
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
                                className="grid gap-6 xl:grid-cols-[392px_minmax(0,1fr)]"
                            >
                                <div className="lab-preview-frame p-4">
                                    <div className="homepage-section-kicker mb-4 text-[10px] md:text-xs">Mobile view</div>
                                    <div className="pixel-screen pixel-scroll h-[640px] overflow-y-auto bg-[#fcfaf4]">
                                        <PreviewFrame mobile />
                                    </div>
                                </div>

                                <div className="lab-preview-frame p-4 md:p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="homepage-section-kicker text-[10px] md:text-xs">Desktop view</div>
                                        <div className="flex gap-2">
                                            <span className="h-3 w-3 rounded-full bg-[#fb7185]" />
                                            <span className="h-3 w-3 rounded-full bg-[#facc15]" />
                                            <span className="h-3 w-3 rounded-full bg-[#4ade80]" />
                                        </div>
                                    </div>
                                    <div className="pixel-screen pixel-scroll h-[640px] overflow-y-auto bg-[#fcfaf4]">
                                        <div className="mx-auto max-w-[688px]">
                                            <PreviewFrame />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
