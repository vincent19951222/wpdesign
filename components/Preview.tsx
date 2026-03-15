import React, { useMemo, useState } from 'react';
import { ChevronLeft, Check, Copy, Smartphone, Monitor, Layout, Send, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
        <div className={`w-full bg-white ${mobile ? 'px-4 pb-6 pt-4' : 'px-5 md:px-6 py-6'} min-h-full box-border`}>
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

    const SwitcherButton = ({ mode, icon: Icon, label }: { mode: ViewMode, icon: any, label: string }) => (
        <button
            onClick={() => setViewMode(mode)}
            className={`flex items-center gap-2 px-4 py-2 border-2 border-neo-ink transition-all ${viewMode === mode
                ? 'bg-neo-yellow translate-x-1 translate-y-1 shadow-none'
                : 'bg-white hover:bg-neo-cream shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                }`}
        >
            <Icon size={18} strokeWidth={3} />
            <span className="font-bold text-xs uppercase hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col bg-neo-cream p-4 md:p-8 overflow-x-hidden">
            {/* Header Control Bar */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button onClick={onBack} className="hover:-translate-x-1 transition-transform shrink-0">
                        <div className="bg-neo-ink text-white p-2 border-2 border-black shadow-neo-sm">
                            <ChevronLeft strokeWidth={3} />
                        </div>
                    </button>
                    <div className="flex flex-col">
                        <Badge variant="default" className="bg-neo-ink text-white w-fit mb-1">PREVIEW STUDIO</Badge>
                        <span className="text-xs font-bold text-neo-ink/50 uppercase tracking-widest">Multi-Device Simulation</span>
                    </div>
                </div>

                {/* View Switcher */}
                <div className="flex bg-neo-ink/5 p-1 border-2 border-neo-ink rounded-none gap-1">
                    <SwitcherButton mode="mobile" icon={Smartphone} label="Mobile" />
                    <SwitcherButton mode="pc" icon={Monitor} label="Desktop" />
                    <SwitcherButton mode="dual" icon={Layout} label="Dual View" />
                </div>

                <div className="flex w-full md:w-auto justify-end gap-2">
                    <Button
                        onClick={handleDraftSync}
                        variant={supportsDraftSync ? 'accent' : 'outline'}
                        className="px-5 py-4 text-sm md:text-base"
                        disabled={isSyncing}
                    >
                        {isSyncing ? <><Send strokeWidth={3} className="mr-2" /> SYNCING...</> : <><Send strokeWidth={3} className="mr-2" /> SYNC DRAFT</>}
                    </Button>
                    <div className="hidden md:block">
                        <Button onClick={onCopy} variant={copied ? "secondary" : "primary"} className="px-8 py-6 text-lg">
                            {copied ? <><Check strokeWidth={3} className="mr-2" /> COPIED!</> : <><Copy strokeWidth={3} className="mr-2" /> COPY FOR WECHAT</>}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto mb-6">
                <div className={`border-4 border-neo-ink p-4 text-sm md:text-base ${syncMessage?.type === 'success'
                    ? 'bg-[#E6FFF2]'
                    : syncMessage?.type === 'error'
                        ? 'bg-[#FFECEC]'
                        : 'bg-white'
                    }`}>
                    <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <div className="space-y-1">
                            <p className="font-black uppercase tracking-wide">
                                {supportsDraftSync ? '草稿同步已启用' : '草稿同步范围提示'}
                            </p>
                            <p className="text-neo-ink/80">
                                {supportsDraftSync
                                    ? '当前主题为“经典像素 API”，可以直接创建微信公众号草稿。系统会使用 Markdown 的首个 H1 作为草稿标题。'
                                    : 'v1 仅支持“经典像素 API”主题同步草稿。其他主题仍建议使用现有复制流程。'}
                            </p>
                            {syncMessage && <p className="font-bold">{syncMessage.text}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    {viewMode === 'mobile' && (
                        <motion.div
                            key="mobile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative w-full max-w-[375px] h-[750px] border-8 border-neo-ink bg-white shadow-neo-xl overflow-hidden rounded-[3rem] p-1"
                        >
                            {/* Fake Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-neo-ink rounded-b-3xl z-20 flex items-center justify-center">
                                <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                            </div>

                            <div className="w-full h-full overflow-y-auto bg-white pt-8 custom-scrollbar">
                                <PreviewFrame mobile />
                            </div>
                        </motion.div>
                    )}

                    {viewMode === 'pc' && (
                        <motion.div
                            key="pc"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-5xl h-[80vh] border-4 border-neo-ink bg-white shadow-neo-xl overflow-hidden flex flex-col"
                        >
                            {/* Browser Header */}
                            <div className="h-10 bg-neo-ink flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-neo-accent border border-black/20" />
                                    <div className="w-3 h-3 rounded-full bg-neo-secondary border border-black/20" />
                                    <div className="w-3 h-3 rounded-full bg-neo-muted border border-black/20" />
                                </div>
                                <div className="flex-1 max-w-md mx-auto h-6 bg-white/10 rounded-sm flex items-center px-3">
                                    <div className="w-full h-2 bg-white/20 rounded-full" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-neo-cream/30 p-4 md:p-8 custom-scrollbar">
                                <div className="max-w-[700px] mx-auto bg-white border-2 border-neo-ink/10 shadow-sm min-h-full">
                                    <PreviewFrame />
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
                            className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-8 pb-12"
                        >
                            {/* Mini Mobile */}
                            <div className="relative w-full max-w-[320px] h-[640px] border-4 border-neo-ink bg-white shadow-neo-lg overflow-hidden rounded-[2.5rem] shrink-0 scale-90 md:scale-100 origin-top">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neo-ink rounded-b-2xl z-20" />
                                <div className="w-full h-full overflow-y-auto bg-white pt-6 custom-scrollbar">
                                    <PreviewFrame mobile />
                                </div>
                            </div>

                            {/* Mini PC */}
                            <div className="flex-1 w-full max-w-4xl h-[640px] border-4 border-neo-ink bg-white shadow-neo-lg overflow-hidden flex flex-col">
                                <div className="h-8 bg-neo-ink flex items-center px-3 gap-1.5 shrink-0">
                                    <div className="w-2.5 h-2.5 rounded-full bg-neo-accent" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-neo-secondary" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-neo-muted" />
                                </div>
                                <div className="flex-1 overflow-y-auto bg-neo-cream/20 p-4 custom-scrollbar">
                                    <div className="max-w-[600px] mx-auto bg-white border border-neo-ink/5 shadow-sm min-h-full">
                                        <PreviewFrame />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Floating Buttons */}
            <div className="fixed bottom-6 right-6 md:hidden z-50 flex flex-col gap-3">
                <button
                    onClick={handleDraftSync}
                    disabled={isSyncing}
                    className={`w-16 h-16 border-4 border-neo-ink shadow-neo-sm flex items-center justify-center active:translate-y-1 active:shadow-none transition-all ${supportsDraftSync ? 'bg-neo-accent text-white' : 'bg-white'
                        }`}
                >
                    <Send size={24} strokeWidth={3} />
                </button>
                <button
                    onClick={onCopy}
                    className={`w-16 h-16 border-4 border-neo-ink shadow-neo-sm flex items-center justify-center active:translate-y-1 active:shadow-none transition-all ${copied ? 'bg-neo-muted' : 'bg-neo-yellow'
                        }`}
                >
                    {copied ? <Check size={28} strokeWidth={3} /> : <Copy size={28} strokeWidth={3} />}
                </button>
            </div>
        </div>
    );
};
