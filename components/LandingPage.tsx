import React from 'react';
import {
    ArrowRight,
    BookOpen,
    Compass,
    Copy,
    Eye,
    FileText,
    Search,
    ShieldCheck,
    Sparkles,
    Wand2
} from 'lucide-react';
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
        accent: '#ffd32a'
    },
    'pixel-v4': {
        label: '像素主题',
        route: '清新原野',
        vibe: 'Bright Pixel',
        highlight: '更轻盈的像素语言，适合日常更新',
        difficulty: 'Intermediate',
        filter: 'pixel',
        accent: '#2ed573'
    },
    'pixel-v4-api-safe': {
        label: 'API-safe',
        route: '草稿同步',
        vibe: 'Publishing',
        highlight: '为公众号草稿同步收敛外层装饰',
        difficulty: 'Advanced',
        filter: 'api-safe',
        accent: '#70a1ff'
    },
    'pixel-classic-api-safe': {
        label: 'API-safe',
        route: '经典同步',
        vibe: 'Publishing',
        highlight: '保留经典像素识别度，适合 API-safe 发布',
        difficulty: 'Intermediate',
        filter: 'api-safe',
        accent: '#ff8f4c'
    },
    'tech-minimalist': {
        label: '科技极简',
        route: '留白控场',
        vibe: 'Minimal',
        highlight: '适合做更克制的科技文章版式',
        difficulty: 'Intermediate',
        filter: 'clean',
        accent: '#5b8cff'
    },
    'classic-theme': {
        label: '商务经典',
        route: '稳重排版',
        vibe: 'Editorial',
        highlight: '适合正式文稿、通讯和专业内容',
        difficulty: 'Beginner',
        filter: 'editorial',
        accent: '#b197fc'
    },
    'default-theme': {
        label: '极简默认',
        route: '快速起稿',
        vibe: 'Minimal',
        highlight: '默认风格，适合快速开始和二次调整',
        difficulty: 'Beginner',
        filter: 'clean',
        accent: '#7bed9f'
    },
    'hand-drawn-theme': {
        label: '手绘表达',
        route: '个性内容',
        vibe: 'Creative',
        highlight: '适合更轻松、插画感更强的内容',
        difficulty: 'Intermediate',
        filter: 'editorial',
        accent: '#ff7aa2'
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
const HERO_READY_THEME_COUNT = 8266;
const HERO_ACCENT_TITLES = ['Writing Studio', 'Draft Workshop', 'Publish Engine'];

const bloomSlotClasses = [
    'landing-flow-bloom-card--northwest',
    'landing-flow-bloom-card--north',
    'landing-flow-bloom-card--northeast',
    'landing-flow-bloom-card--southwest',
    'landing-flow-bloom-card--southeast'
];

type EnrichedTemplate = Template & { theme: ITheme; meta: TemplateMeta; searchText: string };

const getTemplateVisual = (template?: Template) => ({
    backgroundColor: template?.thumbnailColor ?? '#fff7df',
    backgroundImage: template?.thumbnailUrl ? `url(${template.thumbnailUrl})` : undefined
});

export const LandingPage: React.FC<{
    templates: (Template & { theme: ITheme })[];
    isLoading: boolean;
    onEnterStudio: () => void;
    onOpenDocs: () => void;
    onSelectTheme: (theme: ITheme, templateId?: string) => void;
    currentThemeId: string;
}> = ({ templates, isLoading, onEnterStudio, onOpenDocs, onSelectTheme, currentThemeId }) => {
    const [query, setQuery] = React.useState('');
    const [activeFilter, setActiveFilter] = React.useState<DiscoveryFilter>('all');
    const [activeCategory, setActiveCategory] = React.useState<TemplateCategory | 'all'>('all');
    const [displayReadyThemeCount, setDisplayReadyThemeCount] = React.useState(8000);
    const [typedHeroAccent, setTypedHeroAccent] = React.useState('');

    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            setDisplayReadyThemeCount(HERO_READY_THEME_COUNT);
            return;
        }

        const start = 8000;
        const end = HERO_READY_THEME_COUNT;
        const duration = 1400;
        let frameId = 0;
        let startTime: number | null = null;

        const tick = (timestamp: number) => {
            if (startTime === null) {
                startTime = timestamp;
            }

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (end - start) * eased);
            setDisplayReadyThemeCount(current);

            if (progress < 1) {
                frameId = window.requestAnimationFrame(tick);
            }
        };

        frameId = window.requestAnimationFrame(tick);

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, []);

    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            setTypedHeroAccent(HERO_ACCENT_TITLES[0]);
            return;
        }

        let timeoutId = 0;
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        setTypedHeroAccent('');

        const tick = () => {
            const currentPhrase = HERO_ACCENT_TITLES[phraseIndex];

            if (!isDeleting) {
                charIndex += 1;
                setTypedHeroAccent(currentPhrase.slice(0, charIndex));

                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    timeoutId = window.setTimeout(tick, 1300);
                    return;
                }

                timeoutId = window.setTimeout(tick, 82);
                return;
            }

            charIndex -= 1;
            setTypedHeroAccent(currentPhrase.slice(0, Math.max(charIndex, 0)));

            if (charIndex <= 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % HERO_ACCENT_TITLES.length;
                timeoutId = window.setTimeout(tick, 260);
                return;
            }

            timeoutId = window.setTimeout(tick, 46);
        };

        timeoutId = window.setTimeout(tick, 420);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, []);

    const enrichedTemplates = React.useMemo<EnrichedTemplate[]>(() => {
        return templates.map((template, index) => {
            const meta = templateMetaById[template.id] ?? {
                label: '主题模板',
                route: `路线 ${index + 1}`,
                vibe: 'Typography',
                highlight: template.description,
                difficulty: index % 3 === 0 ? 'Beginner' : index % 3 === 1 ? 'Intermediate' : 'Advanced',
                filter: template.category === 'api-safe' ? 'api-safe' : 'clean',
                accent: '#ffd32a'
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

    const apiSafeCount = React.useMemo(() => {
        return enrichedTemplates.filter((template) => template.category === 'api-safe').length;
    }, [enrichedTemplates]);

    const heroPreviewTemplates = React.useMemo(() => {
        const pool = enrichedTemplates.filter((template) => template.id !== currentThemeId);
        return pool.slice(0, bloomSlotClasses.length);
    }, [currentThemeId, enrichedTemplates]);

    const footerTemplates = React.useMemo(() => {
        return enrichedTemplates.slice(0, 3);
    }, [enrichedTemplates]);

    const signalCards = React.useMemo(() => {
        return [
            {
                icon: Sparkles,
                title: '主题先行',
                stat: `${enrichedTemplates.length} 个可用主题`,
                description: '先在首页筛风格和发布路线，再进入编辑台继续写作，避免正文写完才返工。'
            },
            {
                icon: Eye,
                title: '实时预览',
                stat: '写作回路更短',
                description: 'Markdown 输入、主题切换和预览结果在一个闭环里完成，适合快速迭代标题与正文层级。'
            },
            {
                icon: ShieldCheck,
                title: '发布友好',
                stat: `${apiSafeCount} 个 API-safe 版本`,
                description: '需要走公众号草稿同步时，可以直接切换到更克制、发布更稳的主题版本。'
            }
        ];
    }, [apiSafeCount, enrichedTemplates.length]);

    const workflowSteps = React.useMemo(() => {
        return [
            { icon: Compass, title: '挑主题', detail: '先定路线和气质' },
            { icon: FileText, title: '写 Markdown', detail: '直接推进正文' },
            { icon: Eye, title: '看预览', detail: '同步检查层级与版式' },
            { icon: Copy, title: '复制或同步', detail: '发布到公众号' }
        ];
    }, []);

    const handleSelectTemplate = (template: Template & { theme: ITheme }) => {
        onSelectTheme(template.theme, template.id);
        onEnterStudio();
    };

    const handleScrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="landing-flow-shell landing-flow-font">
            <header className="landing-flow-nav">
                <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-4 py-4 md:px-8">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="landing-flow-admin-trigger" aria-label="Logo">
                            P
                        </div>
                        <div>
                            <div className="landing-flow-brand-name">Pixel Lab</div>
                            <div className="landing-flow-brand-subtitle">Theme-first writing studio</div>
                        </div>
                    </div>

                    <nav className="hidden items-center gap-2 lg:flex">
                        <button type="button" className="landing-flow-nav-link" onClick={() => handleScrollTo('landing-top')}>
                            Studio
                        </button>
                        <button type="button" className="landing-flow-nav-link" onClick={() => handleScrollTo('studio-workflow')}>
                            Workflow
                        </button>
                        <button type="button" className="landing-flow-nav-link" onClick={() => handleScrollTo('theme-discovery')}>
                            Theme Library
                        </button>
                        <button type="button" className="landing-flow-nav-link" onClick={() => handleScrollTo('publish-ready')}>
                            Publish Ready
                        </button>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button type="button" className="landing-flow-secondary-btn hidden sm:inline-flex" onClick={onOpenDocs}>
                            <BookOpen size={18} />
                            查看文档
                        </button>
                        <button type="button" className="landing-flow-primary-btn" onClick={onEnterStudio}>
                            <Wand2 size={18} />
                            进入编辑台
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <section id="landing-top" className="landing-flow-hero">
                    <div className="mx-auto grid max-w-[1480px] gap-14 px-4 py-12 md:px-8 md:py-16 xl:grid-cols-[minmax(0,1fr)_minmax(420px,672px)] xl:items-center">
                        <div className="max-w-[680px]">
                            <div className="landing-flow-stat-pill">
                                <span className="landing-flow-stat-pill-badge">
                                    <span className="landing-flow-stat-pill-dot" />
                                    <span className="landing-flow-stat-pill-number">
                                        {displayReadyThemeCount.toLocaleString('en-US')}
                                    </span>
                                </span>
                                <span className="landing-flow-stat-pill-label">READY THEMES</span>
                            </div>

                            <p className="landing-flow-eyebrow">WeChat markdown workflow, with real publishing paths</p>
                            <h1 className="landing-flow-hero-title" aria-label="The Theme-Driven Writing Studio">
                                <span className="landing-flow-hero-title-lead" aria-hidden="true">
                                    The Theme-Driven
                                </span>
                                <span className="landing-flow-hero-title-accent" aria-hidden="true">
                                    <span className="landing-flow-hero-title-accent-text">{typedHeroAccent}</span>
                                    <span className="landing-flow-hero-title-caret" />
                                </span>
                            </h1>
                            <p className="landing-flow-hero-copy">
                                Pixel Lab 先帮你找到合适的排版路线，再把 Markdown 推进编辑台，完成预览、复制和公众号草稿同步。
                                首页不做假入口，所有按钮都直接对应真实工作流。
                            </p>

                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <button
                                    type="button"
                                    className="landing-flow-primary-btn landing-flow-primary-btn--large"
                                    onClick={() => (currentTemplate ? handleSelectTemplate(currentTemplate) : onEnterStudio())}
                                >
                                    继续当前主题
                                    <ArrowRight size={18} />
                                </button>
                                <button type="button" className="landing-flow-secondary-btn landing-flow-secondary-btn--large" onClick={onOpenDocs}>
                                    <BookOpen size={18} />
                                    查看使用说明
                                </button>
                            </div>

                            <div className="landing-flow-chip-row mt-8">
                                {capabilityChips.map((item) => (
                                    <span key={item} className="landing-flow-chip">
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <div className="landing-flow-workflow-row mt-8">
                                {workflowSteps.map((step, index) => (
                                    <div key={step.title} className="landing-flow-workflow-pill">
                                        <step.icon size={16} />
                                        <div>
                                            <div className="landing-flow-workflow-pill-title">
                                                {index + 1}. {step.title}
                                            </div>
                                            <div className="landing-flow-workflow-pill-detail">{step.detail}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="landing-flow-stage-shell">
                            <div className="landing-flow-bloom" aria-label="Theme showcase stage">
                                {heroPreviewTemplates.map((template, index) => (
                                    <button
                                        key={template.id}
                                        type="button"
                                        onClick={() => handleSelectTemplate(template)}
                                        className={`landing-flow-bloom-card ${bloomSlotClasses[index] ?? ''}`}
                                        aria-label={`选择主题 ${template.name}`}
                                    >
                                        <div className="landing-flow-bloom-media" style={getTemplateVisual(template)} />
                                        <div className="landing-flow-bloom-card-label">{template.name}</div>
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    className="landing-flow-bloom-center"
                                    onClick={() => (currentTemplate ? handleSelectTemplate(currentTemplate) : onEnterStudio())}
                                    aria-label={currentTemplate ? `使用当前主题 ${currentTemplate.name}` : '进入编辑台'}
                                >
                                    <div className="landing-flow-bloom-center-dot" />
                                    <div className="landing-flow-bloom-center-art" style={getTemplateVisual(currentTemplate)} />
                                    <div className="landing-flow-bloom-center-caption">
                                        <div className="landing-flow-bloom-center-kicker">CURRENT PICK</div>
                                        <div className="landing-flow-bloom-center-title">{currentTemplate?.name ?? 'Pixel Lab'}</div>
                                        <div className="landing-flow-bloom-center-meta">
                                            <span>{currentTemplate?.meta.route ?? 'Theme route'}</span>
                                            <span>{currentTemplate ? categoryLabels[currentTemplate.category] : '常规主题'}</span>
                                        </div>
                                    </div>
                                </button>

                            </div>
                        </div>
                    </div>
                </section>

                <section id="studio-workflow" className="landing-flow-signal-section">
                    <div className="mx-auto max-w-[1480px] px-4 py-16 md:px-8 md:py-20">
                        <div className="text-center">
                            <div className="landing-flow-signal-banner">
                                <span className="landing-flow-signal-banner-number">{enrichedTemplates.length || 0}</span>
                                <span>THEMES READY</span>
                            </div>
                            <div className="landing-flow-signal-subtitle">真实能力，不用虚构增长数字和用户评价来撑页面</div>
                        </div>

                        <div className="mt-12 grid gap-6 lg:grid-cols-3">
                            {signalCards.map((card, index) => (
                                <article
                                    key={card.title}
                                    className={`landing-flow-signal-card ${index === 1 ? 'landing-flow-signal-card--featured' : ''}`}
                                >
                                    <div className="landing-flow-signal-card-head">
                                        <div className="landing-flow-signal-card-icon">
                                            <card.icon size={22} />
                                        </div>
                                        <div>
                                            <div className="landing-flow-signal-card-title">{card.title}</div>
                                            <div className="landing-flow-signal-card-stat">{card.stat}</div>
                                        </div>
                                    </div>
                                    <p className="landing-flow-signal-card-copy">{card.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="theme-discovery" className="landing-flow-library">
                    <div className="mx-auto max-w-[1480px] px-4 py-16 md:px-8 md:py-20">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-[800px]">
                                <div className="landing-flow-section-tag">
                                    <Compass size={18} />
                                    Theme library
                                </div>
                                <h2 className="landing-flow-section-title">找到最适合内容气质的排版路线</h2>
                                <p className="landing-flow-section-copy">
                                    这里展示的是 Pixel Lab 真实可用的主题库。你可以先按风格、发布方式和内容表达去筛选，
                                    再一键进入编辑台继续写作，不需要穿过无效入口。
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button type="button" className="landing-flow-secondary-btn" onClick={onOpenDocs}>
                                    <ShieldCheck size={18} />
                                    API-safe 说明
                                </button>
                                <button type="button" className="landing-flow-primary-btn" onClick={onEnterStudio}>
                                    <Wand2 size={18} />
                                    直接开始写
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
                            <div className="landing-flow-panel">
                                <label htmlFor="landing-flow-search" className="landing-flow-panel-label">
                                    Search themes
                                </label>
                                <div className="landing-flow-search-wrap">
                                    <Search className="landing-flow-search-icon" size={18} />
                                    <input
                                        id="landing-flow-search"
                                        className="landing-flow-search-input"
                                        placeholder="搜索主题名、风格或发布方式..."
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                </div>

                                <div className="mt-6 space-y-5">
                                    <div>
                                        <div className="landing-flow-panel-label">Category</div>
                                        <div className="landing-flow-filter-row">
                                            <button
                                                type="button"
                                                data-active={activeCategory === 'all'}
                                                onClick={() => setActiveCategory('all')}
                                                className="landing-flow-filter"
                                            >
                                                全部
                                            </button>
                                            {(Object.keys(categoryLabels) as TemplateCategory[]).map((category) => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    data-active={activeCategory === category}
                                                    onClick={() => setActiveCategory(category)}
                                                    className="landing-flow-filter"
                                                >
                                                    {categoryLabels[category]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="landing-flow-panel-label">Style filter</div>
                                        <div className="landing-flow-filter-row">
                                            {filterItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    data-active={activeFilter === item.id}
                                                    onClick={() => setActiveFilter(item.id)}
                                                    className="landing-flow-filter"
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="landing-flow-panel landing-flow-panel--summary">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="landing-flow-panel-label">Current result</div>
                                        <div className="landing-flow-summary-count">{filteredTemplates.length} 个可用主题</div>
                                        <p className="landing-flow-summary-copy">
                                            首页保留真实功能入口。你可以搜索、筛选、点卡片直接进入编辑台，或者继续当前主题开始写作。
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="landing-flow-secondary-btn landing-flow-secondary-btn--compact"
                                        onClick={() => (currentTemplate ? handleSelectTemplate(currentTemplate) : onEnterStudio())}
                                    >
                                        点击卡片直接进入编辑台
                                    </button>
                                </div>

                                <div className="landing-flow-current-theme-card">
                                    <div className="landing-flow-current-theme-visual" style={getTemplateVisual(currentTemplate)} />
                                    <div>
                                        <div className="landing-flow-panel-label">Current pick</div>
                                        <div className="landing-flow-current-theme-title">{currentTemplate?.name ?? 'Pixel Lab'}</div>
                                        <div className="landing-flow-current-theme-tags">
                                            <span>{currentTemplate?.meta.route ?? 'Theme route'}</span>
                                            <span>{currentTemplate ? categoryLabels[currentTemplate.category] : '常规主题'}</span>
                                            <span>{currentTemplate?.meta.difficulty ?? 'Ready'}</span>
                                        </div>
                                        <p className="landing-flow-current-theme-copy">
                                            {currentTemplate?.meta.highlight ?? '选择一个主题，直接进入编辑台继续创作。'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="landing-flow-empty-state mt-8">正在装载主题库...</div>
                        ) : filteredTemplates.length === 0 ? (
                            <div className="landing-flow-empty-state mt-8">
                                <div className="landing-flow-empty-state-title">没有找到匹配的主题</div>
                                <p className="landing-flow-empty-state-copy">
                                    可以清空搜索词或切换筛选条件，回到完整的主题列表。
                                </p>
                                <button
                                    type="button"
                                    className="landing-flow-primary-btn mt-6"
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
                                            className={`landing-flow-template-card ${isCurrent ? 'landing-flow-template-card--active' : ''}`}
                                        >
                                            <div className="landing-flow-template-media" style={getTemplateVisual(template)}>
                                                <span className="landing-flow-template-badge">Theme {routeIndex}</span>
                                                <span
                                                    className="landing-flow-template-chip"
                                                    style={{ backgroundColor: template.meta.accent }}
                                                >
                                                    {isCurrent ? '当前' : template.meta.label}
                                                </span>
                                            </div>

                                            <div className="p-6">
                                                <div className="landing-flow-template-route">{template.meta.route}</div>
                                                <div className="landing-flow-template-title">{template.name}</div>
                                                <p className="landing-flow-template-copy">{template.description}</p>

                                                <div className="landing-flow-template-tags">
                                                    <span>{template.meta.vibe}</span>
                                                    <span>{categoryLabels[template.category]}</span>
                                                    <span>{template.meta.difficulty}</span>
                                                </div>

                                                <div className="landing-flow-template-footer">
                                                    <span>选择主题并进入编辑台</span>
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <section id="publish-ready" className="landing-flow-footer">
                    <div className="mx-auto max-w-[1480px] px-4 py-16 md:px-8 md:py-20">
                        <div className="landing-flow-footer-cta">
                            <div className="landing-flow-footer-thumbs">
                                {footerTemplates.map((template, index) => (
                                    <div
                                        key={template.id}
                                        className={`landing-flow-footer-thumb landing-flow-footer-thumb--${index + 1}`}
                                        style={getTemplateVisual(template)}
                                    />
                                ))}
                            </div>
                            <h2 className="landing-flow-footer-title">Ready to start the next draft?</h2>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <button
                                    type="button"
                                    className="landing-flow-primary-btn landing-flow-primary-btn--large"
                                    onClick={() => (currentTemplate ? handleSelectTemplate(currentTemplate) : onEnterStudio())}
                                >
                                    Launch Current Theme
                                </button>
                                <button type="button" className="landing-flow-secondary-btn landing-flow-secondary-btn--large" onClick={onOpenDocs}>
                                    Try API-safe Notes
                                </button>
                            </div>
                            <div className="landing-flow-footer-note">Theme first, then write faster.</div>
                        </div>

                        <div className="landing-flow-footer-grid">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="landing-flow-footer-logo">P</div>
                                    <div className="landing-flow-footer-brand">Pixel Lab</div>
                                </div>
                                <p className="landing-flow-footer-copy">
                                    面向真实公众号写作的排版工作台。先选主题，再写 Markdown，再看预览，然后复制或同步到草稿。
                                </p>
                            </div>

                            <div>
                                <div className="landing-flow-footer-heading">Workflow</div>
                                <div className="landing-flow-footer-list">
                                    {workflowSteps.map((step) => (
                                        <div key={step.title} className="landing-flow-footer-list-item">
                                            <step.icon size={16} />
                                            <span>{step.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="landing-flow-footer-heading">Publishing</div>
                                <div className="landing-flow-footer-list">
                                    <div className="landing-flow-footer-list-item">
                                        <ShieldCheck size={16} />
                                        <span>{apiSafeCount} 个 API-safe 主题</span>
                                    </div>
                                    <div className="landing-flow-footer-list-item">
                                        <Copy size={16} />
                                        <span>支持复制到公众号</span>
                                    </div>
                                    <div className="landing-flow-footer-list-item">
                                        <Sparkles size={16} />
                                        <span>实时预览与主题切换</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
