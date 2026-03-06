import React, { useState } from 'react';
import { ChevronLeft, Check, Copy, Rocket, Smartphone, Monitor, Layout } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import WeChatRenderer from './WeChatRenderer';
import { ITheme, RenderMode } from '../types/ITheme';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewProps {
    markdown: string;
    theme: ITheme;
    copied: boolean;
    onBack: () => void;
    onCopy: () => void;
    onPublish?: () => void;
    isPublishing?: boolean;
    skillMode?: boolean;
    renderMode?: RenderMode;
    onRenderModeChange?: (mode: RenderMode) => void;
}

type ViewMode = 'mobile' | 'pc' | 'dual';

export const Preview: React.FC<PreviewProps> = ({
    markdown,
    theme,
    copied,
    onBack,
    onCopy,
    onPublish,
    isPublishing = false,
    skillMode = false,
    renderMode = 'design-preview',
    onRenderModeChange
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('dual');

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

    const RenderModeButton = ({ mode, label }: { mode: RenderMode, label: string }) => (
        <button
            onClick={() => onRenderModeChange?.(mode)}
            className={`px-4 py-2 border-2 border-neo-ink font-bold text-xs uppercase transition-all ${renderMode === mode
                ? 'bg-neo-accent text-white translate-x-1 translate-y-1 shadow-none'
                : 'bg-white text-neo-ink shadow-neo-sm hover:bg-neo-cream active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col bg-neo-cream p-4 md:p-8 overflow-x-hidden">
            {/* Header Control Bar */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {!skillMode && (
                        <button onClick={onBack} className="hover:-translate-x-1 transition-transform shrink-0">
                            <div className="bg-neo-ink text-white p-2 border-2 border-black shadow-neo-sm">
                                <ChevronLeft strokeWidth={3} />
                            </div>
                        </button>
                    )}
                    <div className="flex flex-col">
                        <Badge variant="default" className="bg-neo-ink text-white w-fit mb-1">
                            {skillMode ? 'SKILL PREVIEW' : 'PREVIEW STUDIO'}
                        </Badge>
                        <span className="text-xs font-bold text-neo-ink/50 uppercase tracking-widest">
                            {skillMode ? 'Copy Opens WeChat Composer' : 'Multi-Device Simulation'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 items-center">
                    {!skillMode && (
                        <div className="flex bg-neo-ink/5 p-1 border-2 border-neo-ink rounded-none gap-1">
                            <RenderModeButton mode="design-preview" label="设计预览" />
                            <RenderModeButton mode="wechat-safe" label="微信安全预览" />
                        </div>
                    )}

                    <div className="flex bg-neo-ink/5 p-1 border-2 border-neo-ink rounded-none gap-1">
                        <SwitcherButton mode="mobile" icon={Smartphone} label="Mobile" />
                        <SwitcherButton mode="pc" icon={Monitor} label="Desktop" />
                        <SwitcherButton mode="dual" icon={Layout} label="Dual View" />
                    </div>
                </div>

                <div className="hidden md:block">
                    <div className="flex items-center gap-3">
                        {!skillMode && renderMode === 'wechat-safe' && onPublish && (
                            <Button onClick={onPublish} variant="accent" className="px-8 py-6 text-lg" disabled={isPublishing}>
                                {isPublishing
                                    ? <>发布中...</>
                                    : <><Rocket strokeWidth={3} className="mr-2" /> 一键发布草稿</>}
                            </Button>
                        )}
                        <Button onClick={onCopy} variant={copied ? "secondary" : "primary"} className="px-8 py-6 text-lg">
                            {copied
                                ? <><Check strokeWidth={3} className="mr-2" /> {skillMode ? 'COPIED & OPENED!' : 'COPIED!'}</>
                                : <><Copy strokeWidth={3} className="mr-2" /> {skillMode ? 'COPY & OPEN WECHAT' : 'COPY FOR WECHAT'}</>}
                        </Button>
                    </div>
                </div>
            </div>

            {skillMode && (
                <div className="w-full max-w-7xl mx-auto mb-6">
                    <div className="bg-white border-2 border-neo-ink shadow-neo-sm px-4 py-3 text-sm md:text-base font-bold">
                        点击右上角按钮后，会复制当前预览内容并在新标签页打开公众号新增文章页。你只需要扫码登录后手动粘贴。
                    </div>
                </div>
            )}

            {!skillMode && (
                <div className="w-full max-w-7xl mx-auto mb-6">
                    <div className="bg-white border-2 border-neo-ink shadow-neo-sm px-4 py-3 text-sm md:text-base font-bold">
                        当前模式：
                        {renderMode === 'design-preview'
                            ? ' 设计预览，优先保留像素风的理想浏览器效果。'
                            : ' 微信安全预览，优先逼近公众号编辑器最终落地效果。'}
                    </div>
                </div>
            )}

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
                                <WeChatRenderer content={markdown} theme={theme} renderMode={renderMode} />
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
                                    <WeChatRenderer content={markdown} theme={theme} renderMode={renderMode} />
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
                                    <WeChatRenderer content={markdown} theme={theme} renderMode={renderMode} />
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
                                        <WeChatRenderer content={markdown} theme={theme} renderMode={renderMode} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Floating Button */}
            <div className="fixed bottom-6 right-6 md:hidden z-50">
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
