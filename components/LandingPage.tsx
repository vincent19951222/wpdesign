import React from 'react';
import { ArrowRight, BookOpen, Compass, Search, ShieldCheck, Sparkles, Wand2 } from 'lucide-react';
import type { ITheme } from '../types/ITheme';
import type { Template, TemplateCategory } from '../types';

type DiscoveryFilter = 'all' | 'pixel' | 'clean' | 'editorial' | 'api-safe';

type TemplateMeta = {
    label: string;
    route: string;
    vibe: string;
    highlight: string;
    difficulty: string;
    filter: DiscoveryFilter;
    accent: string;
};

const templateMetaById: Record<string, TemplateMeta> = {
    'pixel-classic': {
        label: '像素主题',
        route: '复古高辨识',
        vibe: '8-bit',
        highlight: '适合做强风格公众号封面与标题体系',
        difficulty: 'Beginner',
        filter: 'pixel',
        accent: '#FFD500'
    },
    'pixel-v4': {
        label: '像素主题',
        route: '清新原野',
        vibe: 'Bright Pixel',
        highlight: '更轻盈的像素语言，适合日常更新',
        difficulty: 'Intermediate',
        filter: 'pixel',
        accent: '#34D399'
    },
    'pixel-v4-api-safe': {
        label: 'API-safe',
        route: '草稿同步',
        vibe: 'Publishing',
        highlight: '为公众号草稿同步收敛外层装饰',
        difficulty: 'Advanced',
        filter: 'api-safe',
        accent: '#38BDF8'
    },
    'pixel-classic-api-safe': {
        label: 'API-safe',
        route: '经典同步',
        vibe: 'Publishing',
        highlight: '保留经典像素识别度，适合 API-safe 发布',
        difficulty: 'Intermediate',
        filter: 'api-safe',
        accent: '#F97316'
    },
    'tech-minimalist': {
        label: '科技极简',
        route: '留白控场',
        vibe: 'Minimal',
        highlight: '适合做更克制的科技文章版式',
        difficulty: 'Intermediate',
        filter: 'clean',
        accent: '#60A5FA'
    },
    'classic-theme': {
        label: '商务经典',
        route: '稳重排版',
        vibe: 'Editorial',
        highlight: '适合正式文稿、通讯和专业内容',
        difficulty: 'Beginner',
        filter: 'editorial',
        accent: '#A78BFA'
    },
    'default-theme': {
        label: '极简默认',
        route: '快速起稿',
        vibe: 'Minimal',
        highlight: '默认风格，适合快速开始和二次调整',
        difficulty: 'Beginner',
        filter: 'clean',
        accent: '#4ADE80'
    },
    'hand-drawn-theme': {
        label: '手绘表达',
        route: '个性内容',
        vibe: 'Creative',
        highlight: '适合更轻松、插画感更强的内容',
        difficulty: 'Intermediate',
        filter: 'editorial',
        accent: '#FB7185'
    }
};

const filterItems: { id: DiscoveryFilter; label: string }[] = [
    { id: 'all', label: '全部主题' },
    { id: 'pixel', label: '像素风' },
    { id: 'clean', label: '极简风' },
    { id: 'editorial', label: '内容表达' },
    { id: 'api-safe', label: 'API-safe' }
];

const categoryLabels: Record<TemplateCategory, string> = {
    standard: '常规主题',
    'api-safe': '草稿同步'
};

const capabilityChips = ['Markdown 编辑', '主题切换', '实时预览', '复制到公众号', '草稿同步'];

export const LandingPage: React.FC<{
    templates: (Template & { theme: ITheme })[];
    isLoading: boolean;
    onEnterStudio: () => void;
    onOpenDocs: () => void;
    onAdminTrigger: () => void;
    onSelectTheme: (theme: ITheme, templateId?: string) => void;
    currentThemeId: string;
}> = ({ templates, isLoading, onEnterStudio, onOpenDocs, onAdminTrigger, onSelectTheme, currentThemeId }) => {
    const [query, setQuery] = React.useState('');
    const [activeFilter, setActiveFilter] = React.useState<DiscoveryFilter>('all');
    const [activeCategory, setActiveCategory] = React.useState<TemplateCategory | 'all'>('all');
    const [adminTapCount, setAdminTapCount] = React.useState(0);
    const adminTapResetRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        return () => {
            if (adminTapResetRef.current) {
                window.clearTimeout(adminTapResetRef.current);
            }
        };
    }, []);

    const enrichedTemplates = React.useMemo(() => {
        return templates.map((template, index) => {
            const meta = templateMetaById[template.id] ?? {
                label: '主题模板',
                route: `路线 ${index + 1}`,
                vibe: 'Typography',
                highlight: template.description,
                difficulty: index % 3 === 0 ? 'Beginner' : index % 3 === 1 ? 'Intermediate' : 'Advanced',
                filter: template.category === 'api-safe' ? 'api-safe' : 'clean',
                accent: '#FFD500'
            };

            return {
                ...template,
                meta,
                searchText: [
                    template.name,
                    template.description,
                    meta.label,
                    meta.route,
                    meta.vibe,
                    meta.highlight,
                    template.category
                ].join(' ').toLowerCase()
            };
        });
    }, [templates]);

    const currentTemplate = React.useMemo(() => {
        return enrichedTemplates.find((template) => template.id === currentThemeId) ?? enrichedTemplates[0];
    }, [currentThemeId, enrichedTemplates]);

    const filteredTemplates = React.useMemo(() => {
        const lowered = query.trim().toLowerCase();

        return enrichedTemplates.filter((template) => {
            const matchesFilter = activeFilter === 'all' ? true : template.meta.filter === activeFilter;
            const matchesCategory = activeCategory === 'all' ? true : template.category === activeCategory;
            const matchesQuery = lowered.length === 0 ? true : template.searchText.includes(lowered);
            return matchesFilter && matchesCategory && matchesQuery;
        });
    }, [activeCategory, activeFilter, enrichedTemplates, query]);

    const handleAdminTap = () => {
        const nextCount = adminTapCount + 1;
        setAdminTapCount(nextCount);

        if (adminTapResetRef.current) {
            window.clearTimeout(adminTapResetRef.current);
        }

        if (nextCount >= 5) {
            setAdminTapCount(0);
            onAdminTrigger();
            return;
        }

        adminTapResetRef.current = window.setTimeout(() => {
            setAdminTapCount(0);
        }, 1600);
    };

    const handleSelectTemplate = (template: Template & { theme: ITheme }) => {
        onSelectTheme(template.theme, template.id);
        onEnterStudio();
    };

    return (
        <div className="homepage-shell homepage-noise font-home-sans">
            <header className="homepage-nav sticky top-0 z-30">
                <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-5 md:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleAdminTap}
                            className="homepage-coin font-en-display text-[10px] leading-none"
                            aria-label="Hidden admin trigger"
                        >
                            P
                        </button>
                        <div>
                            <div lang="en" className="font-en-display text-base text-white md:text-xl">
                                Pixel Lab
                            </div>
                            <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400 md:text-sm">
                                排版实验室
                            </div>
                        </div>
                    </div>

                    <nav className="hidden items-center gap-3 lg:flex">
                        <button
                            type="button"
                            className="homepage-ghost-btn px-4 py-3 text-sm font-medium"
                            onClick={() => {
                                setActiveFilter('all');
                                setActiveCategory('all');
                                setQuery('');
                            }}
                        >
                            主题广场
                        </button>
                        <button
                            type="button"
                            className="homepage-ghost-btn px-4 py-3 text-sm font-medium"
                            onClick={onOpenDocs}
                        >
                            使用说明
                        </button>
                        <button
                            type="button"
                            className="homepage-cta rounded-[14px] px-4 py-3 text-sm font-semibold"
                            onClick={onEnterStudio}
                        >
                            进入编辑台
                        </button>
                    </nav>
                </div>
            </header>

            <main>
                <section className="homepage-hero-frame">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/assets/bg.jpg')"
                        }}
                    />
                    <div className="homepage-hero-glow" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050816] to-transparent" />

                    <div className="relative mx-auto grid max-w-[1480px] gap-10 px-4 py-14 md:px-8 md:py-18 lg:min-h-[560px] lg:grid-cols-[minmax(0,1.2fr)_420px] lg:items-end">
                        <div className="max-w-[820px] pb-6 lg:pb-12">
                            <p className="homepage-section-kicker text-xs md:text-sm">
                                WeChat typography playground
                            </p>
                            <h1 className="mt-6 text-[44px] font-black leading-[1.08] text-white md:text-[58px] lg:text-[72px]">
                                排版实验室
                            </h1>
                            <p className="mt-6 max-w-[760px] text-lg leading-8 text-slate-200 md:text-2xl md:leading-10">
                                挑一个合适的主题，把 Markdown 推进编辑台，完成预览、复制和公众号草稿同步。首页的任务不是展示假产品导航，而是帮你更快找到合适的排版路线。
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button
                                    type="button"
                                    className="homepage-cta rounded-[16px] px-5 py-4 text-base font-semibold md:px-6"
                                    onClick={() => currentTemplate && handleSelectTemplate(currentTemplate)}
                                >
                                    继续当前主题
                                    <ArrowRight size={18} />
                                </button>
                                <button
                                    type="button"
                                    className="homepage-ghost-btn px-5 py-4 text-base font-medium"
                                    onClick={onOpenDocs}
                                >
                                    <BookOpen size={18} />
                                    查看说明
                                </button>
                            </div>
                        </div>

                        <div className="pb-6 lg:pb-12">
                            <div className="homepage-panel relative overflow-hidden p-6 md:p-7">
                                <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                                    当前推荐
                                </div>
                                <p className="homepage-section-kicker text-[10px] md:text-xs">
                                    Active theme
                                </p>
                                <div className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
                                    {currentTemplate?.name || '经典像素'}
                                </div>
                                <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">
                                    {currentTemplate?.meta.highlight || '挑一个风格，直接进入编辑台继续创作。'}
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <span className="homepage-level-pill px-3 py-2 text-sm font-medium">{currentTemplate?.meta.route || '主题路线'}</span>
                                    <span className="homepage-level-pill px-3 py-2 text-sm font-medium">{currentTemplate?.meta.vibe || 'Typography'}</span>
                                    <span className="homepage-level-pill px-3 py-2 text-sm font-medium">{categoryLabels[currentTemplate?.category || 'standard']}</span>
                                </div>

                                <div className="mt-6 flex items-center gap-3 text-sm text-slate-300">
                                    <Sparkles size={16} className="text-[#FFD500]" />
                                    进入编辑台后会直接带入当前主题与既有内容工作流。
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-y border-[#202839] bg-[#08101f]/76">
                    <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-3 px-4 py-5 md:px-8">
                        <span className="homepage-section-kicker text-[10px] md:text-xs">Capabilities</span>
                        {capabilityChips.map((item) => (
                            <span key={item} className="homepage-sponsor-chip px-4 py-2 text-sm font-medium md:text-base">
                                {item}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-[1480px] px-4 py-14 md:px-8 md:py-18">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-[920px]">
                            <div className="flex items-center gap-3 text-[#9acb59]">
                                <Compass size={24} />
                                <span className="homepage-section-kicker text-xs md:text-sm">Theme discovery</span>
                            </div>
                            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                                找到适合内容气质的排版主题
                            </h2>
                            <p className="mt-5 max-w-[980px] text-lg leading-8 text-slate-300 md:text-[22px] md:leading-10">
                                这里展示的是排版实验室真实可用的主题库。你可以按风格、发布方式和内容气质筛选，然后一键进入编辑台继续写作。
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button type="button" className="homepage-ghost-btn px-4 py-3 text-sm font-medium" onClick={onOpenDocs}>
                                <ShieldCheck size={18} />
                                API-safe 说明
                            </button>
                            <button type="button" className="homepage-cta rounded-[14px] px-4 py-3 text-sm font-semibold" onClick={onEnterStudio}>
                                <Wand2 size={18} />
                                直接开始写
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
                        <div className="homepage-panel p-5 md:p-6">
                            <label htmlFor="homepage-search" className="homepage-section-kicker text-[10px] md:text-xs">
                                Search themes
                            </label>
                            <div className="relative mt-4">
                                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    id="homepage-search"
                                    className="homepage-search h-14 w-full pl-12 pr-4 text-base"
                                    placeholder="搜索主题名、风格或发布方式..."
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <div className="homepage-section-kicker text-[10px] md:text-xs">Category</div>
                                    <div className="homepage-scroll-row mt-3 flex gap-3 overflow-x-auto pb-1">
                                        <button
                                            type="button"
                                            data-active={activeCategory === 'all'}
                                            onClick={() => setActiveCategory('all')}
                                            className="homepage-filter shrink-0 px-4 py-3 text-sm font-medium"
                                        >
                                            全部
                                        </button>
                                        {(Object.keys(categoryLabels) as TemplateCategory[]).map((category) => (
                                            <button
                                                key={category}
                                                type="button"
                                                data-active={activeCategory === category}
                                                onClick={() => setActiveCategory(category)}
                                                className="homepage-filter shrink-0 px-4 py-3 text-sm font-medium"
                                            >
                                                {categoryLabels[category]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="homepage-section-kicker text-[10px] md:text-xs">Style filter</div>
                                    <div className="homepage-scroll-row mt-3 flex gap-3 overflow-x-auto pb-1">
                                        {filterItems.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                data-active={activeFilter === item.id}
                                                onClick={() => setActiveFilter(item.id)}
                                                className="homepage-filter shrink-0 px-4 py-3 text-sm font-medium"
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="homepage-panel p-5 md:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="homepage-section-kicker text-[10px] md:text-xs">Current result</div>
                                    <div className="mt-3 text-xl font-semibold text-white">
                                        {filteredTemplates.length} 个可用主题
                                    </div>
                                </div>
                                <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 md:inline-flex">
                                    点击卡片直接进入编辑台
                                </div>
                            </div>

                            <p className="mt-4 text-base leading-7 text-slate-300">
                                当前首页不再承载假的产品导航和无效按钮，所有主要入口都直接对应真实功能：挑主题、查看说明、进入编辑台。
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="homepage-panel mt-8 p-8 text-center text-lg text-slate-300">
                            正在装载主题库...
                        </div>
                    ) : filteredTemplates.length === 0 ? (
                        <div className="homepage-panel mt-8 p-8 md:p-10">
                            <div className="text-2xl font-semibold text-white">没有找到匹配的主题</div>
                            <p className="mt-4 max-w-[640px] text-base leading-7 text-slate-300">
                                可以清空搜索词或切换筛选条件，回到完整的主题列表。
                            </p>
                            <button
                                type="button"
                                className="homepage-cta mt-6 rounded-[14px] px-4 py-3 text-sm font-semibold"
                                onClick={() => {
                                    setQuery('');
                                    setActiveFilter('all');
                                    setActiveCategory('all');
                                }}
                            >
                                重置筛选
                            </button>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {filteredTemplates.map((template, index) => {
                                const isCurrent = template.id === currentThemeId;
                                const routeIndex = String(index + 1).padStart(2, '0');

                                return (
                                    <button
                                        key={template.id}
                                        type="button"
                                        onClick={() => handleSelectTemplate(template)}
                                        className={`homepage-card text-left ${isCurrent ? 'homepage-card--active' : ''}`}
                                    >
                                        <div className="homepage-card-media h-44 md:h-48">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{
                                                    backgroundColor: template.thumbnailColor,
                                                    backgroundImage: template.thumbnailUrl ? `url(${template.thumbnailUrl})` : undefined
                                                }}
                                            />
                                            <div className="absolute left-4 top-4 rounded-full bg-[#08101f]/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-slate-200">
                                                Theme {routeIndex}
                                            </div>
                                            <div
                                                className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#08101f]"
                                                style={{ backgroundColor: template.meta.accent }}
                                            >
                                                {isCurrent ? '当前' : template.meta.label}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="text-sm font-medium uppercase tracking-[0.26em] text-slate-400">
                                                {template.meta.route}
                                            </div>
                                            <div className="mt-4 text-[28px] font-semibold leading-[1.15] tracking-tight text-white">
                                                {template.name}
                                            </div>
                                            <p className="mt-4 min-h-24 text-lg leading-8 text-slate-300">
                                                {template.description}
                                            </p>

                                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                                <span className="homepage-level-pill px-3 py-2 text-sm font-medium">{template.meta.vibe}</span>
                                                <span className="homepage-level-pill px-3 py-2 text-sm font-medium">{categoryLabels[template.category]}</span>
                                                <span className="homepage-level-pill px-3 py-2 text-sm font-medium">{template.meta.difficulty}</span>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
                                                <span>选择主题并进入编辑台</span>
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
