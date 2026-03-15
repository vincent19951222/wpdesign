import React from 'react';
import { Button } from './ui/button';
import { Wand2, Layout } from 'lucide-react';
import { InfiniteMarquee, NeoGridBackground } from './NeoEffects';
import ThemeGallery from './ThemeGallery';
import type { ITheme } from '../types/ITheme';
import type { Template, TemplateCategory } from '../types';
import TypewriterLogo from './Logo';

export const LandingPage: React.FC<{
    templates: (Template & { theme: ITheme })[];
    isLoading: boolean;
    onEnterStudio: () => void;
    onOpenExtractor: () => void;
    onOpenDocs: () => void;
    onSelectTheme: (theme: ITheme, templateId?: string) => void;
    currentThemeId: string;
}> = ({ templates, isLoading, onEnterStudio, onOpenExtractor, onOpenDocs, onSelectTheme, currentThemeId }) => {
    const currentTemplate = templates.find((template) => template.id === currentThemeId);
    const [activeTab, setActiveTab] = React.useState<TemplateCategory>(currentTemplate?.category ?? 'standard');

    React.useEffect(() => {
        if (currentTemplate) {
            setActiveTab(currentTemplate.category);
        }
    }, [currentTemplate]);

    const tabItems: { id: TemplateCategory; label: string; hint: string }[] = [
        { id: 'standard', label: '常规主题', hint: '适合手动复制和常规预览' },
        { id: 'api-safe', label: 'API-safe', hint: '为草稿 API 和低保真通道收敛' }
    ];

    const templatesByTab = templates.filter((template) => template.category === activeTab);

    return (
        <NeoGridBackground>
            <div className="flex min-h-screen flex-col relative">
                <nav className="sticky top-0 z-50 relative flex items-center justify-between border-b-4 border-neo-ink bg-white p-4 md:p-6">
                    <div className="flex items-center gap-3">
                        <TypewriterLogo size={44} />
                        <div className="hidden sm:block">
                            <div className="font-sans text-xl font-black uppercase tracking-wider">Wp Design</div>
                            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-neo-ink/50">WeChat publishing workbench</div>
                        </div>
                    </div>
                    <div className="flex gap-2 md:gap-4">
                        <Button size="sm" className="bg-neo-yellow border-neo-ink text-neo-ink font-bold hover:bg-[#FFE170]" onClick={onOpenExtractor}>
                            <Wand2 size={16} className="mr-0 md:mr-2" /> <span className="hidden md:inline">提取主题</span>
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-neo-ink hover:text-white" onClick={onOpenDocs}>
                            文档
                        </Button>
                        <Button size="sm" variant="ghost" className="hidden sm:flex hover:bg-neo-ink hover:text-white" onClick={() => window.open('https://github.com', '_blank')}>
                            GitHub
                        </Button>
                    </div>
                </nav>

                <header className="border-b-4 border-neo-ink bg-neo-bg px-4 pb-10 pt-14 md:pb-14 md:pt-20">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-6 inline-flex items-center gap-3 border-4 border-neo-ink bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] shadow-neo-sm md:mb-8 md:text-sm">
                            <span className="inline-block h-2.5 w-2.5 border-2 border-neo-ink bg-neo-yellow" />
                            Markdown → Preview → Copy
                        </div>

                        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
                            <div className="text-left">
                                <p className="mb-5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-neo-ink/50 md:text-base">
                                    为公众号创作者和内容团队准备
                                </p>
                                <h1 className="font-cnhy text-5xl leading-[0.92] tracking-wide text-neo-ink md:text-8xl">
                                    微信公众号
                                    <br />
                                    <span className="mt-3 inline-block border-4 border-neo-ink bg-neo-yellow px-3 py-1 text-4xl shadow-neo-sm md:px-5 md:text-7xl">
                                        排版工作台
                                    </span>
                                </h1>
                                <p className="mt-8 max-w-2xl text-xl font-medium leading-relaxed text-neo-ink/80 md:text-2xl">
                                    从 Markdown 到可复制的公众号成稿预览，减少手工排版时间，保留你真正关心的内容风格和发布效率。
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <div className="border-4 border-neo-ink bg-white px-4 py-2 text-sm font-bold shadow-neo-sm md:text-base">
                                        实时主题预览
                                    </div>
                                    <div className="border-4 border-neo-ink bg-white px-4 py-2 text-sm font-bold shadow-neo-sm md:text-base">
                                        复制即用
                                    </div>
                                    <div className="border-4 border-neo-ink bg-white px-4 py-2 text-sm font-bold shadow-neo-sm md:text-base">
                                        面向公众号编辑器
                                    </div>
                                </div>
                            </div>

                            <div className="lg:pt-6">
                                <div className="border-4 border-neo-ink bg-white p-6 shadow-neo-md md:p-8">
                                    <div className="mb-5 inline-block border-4 border-neo-ink bg-neo-yellow px-3 py-1 text-sm font-black uppercase tracking-wide">
                                        产品介绍
                                    </div>
                                    <div className="space-y-5 text-left">
                                        <div>
                                            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-neo-ink/45">01</p>
                                            <p className="text-lg font-bold leading-relaxed md:text-xl">直接粘贴 Markdown，快速切换主题，预览最终排版。</p>
                                        </div>
                                        <div>
                                            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-neo-ink/45">02</p>
                                            <p className="text-lg font-bold leading-relaxed md:text-xl">重点不是花哨模板，而是一套稳定、清晰、适合持续写作的内容工作流。</p>
                                        </div>
                                        <div>
                                            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-neo-ink/45">03</p>
                                            <p className="text-lg font-bold leading-relaxed md:text-xl">适合独立创作者、品牌账号，以及需要高频产出的内容团队。</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="relative z-20 border-b-4 border-neo-ink bg-white py-3">
                    <InfiniteMarquee
                        text="MARKDOWN • THEME PREVIEW • WECHAT COPYFLOW • FAST ITERATION • CONTENT WORKBENCH • "
                        className="text-lg font-black text-neo-ink md:text-xl"
                    />
                </div>

                <main className="relative z-10 flex flex-1 flex-col items-center justify-center bg-white py-20">
                    <div className="pointer-events-none absolute top-0 left-0 h-12 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-20 h-full"></div>

                    {isLoading ? (
                        <div className="border-4 border-neo-ink bg-neo-yellow px-8 py-4 text-2xl font-black shadow-neo-md">LOADING RESOURCES...</div>
                    ) : (
                        <div className="w-full max-w-7xl px-4">
                            <div className="mb-10 max-w-3xl">
                                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-neo-ink/45">Theme Gallery</p>
                                <h2 className="mb-3 text-3xl font-black md:text-5xl">选择一个适合你内容气质的主题</h2>
                                <p className="text-lg leading-relaxed text-neo-ink/70 md:text-xl">
                                    先预览，再进入编辑器。你不需要从零搭样式，而是从一个稳定的排版基线开始。
                                </p>
                            </div>

                            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-wrap gap-3">
                                    {tabItems.map((tab) => {
                                        const isActive = activeTab === tab.id;
                                        const count = templates.filter((template) => template.category === tab.id).length;

                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`min-w-[172px] border-4 border-neo-ink px-4 py-3 text-left transition-all ${isActive
                                                    ? 'bg-neo-yellow shadow-none translate-x-[4px] translate-y-[4px]'
                                                    : 'bg-white shadow-neo-sm hover:-translate-y-1'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-base font-black uppercase tracking-wide">{tab.label}</span>
                                                    <span className="border-2 border-neo-ink bg-white px-2 py-0.5 font-mono text-xs font-black">
                                                        {count}
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-xs font-bold text-neo-ink/60">
                                                    {tab.hint}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="border-4 border-neo-ink bg-neo-bg px-4 py-3 text-sm font-bold text-neo-ink/75 shadow-neo-sm">
                                    当前分类：{activeTab === 'api-safe' ? 'API-safe 模式' : '常规主题'}
                                </div>
                            </div>

                            <ThemeGallery
                                templates={templatesByTab}
                                onSelect={(t) => {
                                    onSelectTheme(t.theme, t.id);
                                    onEnterStudio();
                                }}
                                currentId={currentThemeId}
                            />

                            <div className="mt-20 flex justify-center">
                                <div className="group rotate-[0.6deg] border-4 border-neo-ink bg-neo-yellow p-2 shadow-neo-xl transition-transform duration-300 hover:rotate-0">
                                    <Button
                                        size="xl"
                                        onClick={onEnterStudio}
                                        className="h-auto border-2 border-neo-ink bg-white px-12 py-8 text-2xl text-neo-ink shadow-none transition-all hover:bg-neo-bg hover:scale-105"
                                    >
                                        进入编辑台 <Layout className="ml-4 h-8 w-8" strokeWidth={3} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="relative overflow-hidden border-t-4 border-neo-ink bg-neo-bg p-12 text-center font-mono text-sm font-bold text-neo-ink">
                    <div className="absolute top-0 left-0 h-2 w-full bg-neo-yellow"></div>
                    <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="text-2xl font-black uppercase tracking-tighter">Wp Design</div>
                        <div className="flex flex-wrap justify-center gap-4 opacity-70">
                            <span>© 2026</span>
                            <span>•</span>
                            <span>Made for WeChat publishing workflows</span>
                        </div>
                    </div>
                </footer>
            </div>
        </NeoGridBackground>
    );
};
