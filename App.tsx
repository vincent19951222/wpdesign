import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Help } from './components/Help';
import ThemeExtractorUI from './components/ThemeExtractorUI';
import { Template } from './types';
import { ITheme, RenderMode } from './types/ITheme';
import pixelThemeDefault from './themes/pixel-theme.json';
import classicThemeDefault from './themes/classic-theme.json';
import defaultThemeDefault from './themes/default-theme.json';
import handDrawnThemeDefault from './themes/hand-drawn-theme.json';

import techMinimalistThemeDefault from './themes/tech-minimalist-theme.json';
import magazineFashionThemeDefault from './themes/magazine-fashion-theme.json';
import neumorphismThemeDefault from './themes/neumorphism-theme.json';
import retroNewspaperThemeDefault from './themes/retro-newspaper-theme.json';

const SKILL_PREVIEW_QUERY_KEY = 'skill-preview';
const SKILL_PREVIEW_STORAGE_KEY = 'pixel-post-to-wechat:payload:v1';
const WECHAT_NEW_ARTICLE_URL = 'https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit_v2&action=edit&isNew=1&type=77&createType=0&lang=zh_CN';

const DEFAULT_MD = `# 排版实验室 DEMO

## 1. 基础排版元素

这是普通段落 (p)，通过简单的 Markdown 转换，我们生成符合主题风格的微信排版。
这里展示了 **加粗文字 (strong)** 和 *斜体文字 (em)* 以及 \`行内代码 (code)\` 的混合排版效果。

你可以访问 [排版实验室 (Link)](https://github.com) 了解更多详情。

### 2. 列表与引用 (H3)

#### 无序列表 (H4)

*   列表项一：自动识别样式
*   列表项二：支持多级嵌套
*   列表项三：完美的对齐

#### 有序列表 (H4)

1.  第一步：准备 Markdown 素材
2.  第二步：选择喜欢的主题
3.  第三步：一键复制到公众号

> **引用块 (Blockquote)**
> 这是一个带有徽章装饰的引用块。
> 它可以用来突出显示重要信息或提示。

### 3. 代码与表格 (H3)

#### 代码演示 (H4)

\`\`\`javascript
// 这是一个代码块 (Pre + Code)
function pixelArt() {
  const style = "retro";
  console.log(\`Generating \${style} style...\`);
  return true;
}
\`\`\`

##### 五级标题示例 (H5)

这里是更细分的层级，通常用于注释或补充说明。

#### 数据表格 (Table)

| 组件名称 | 渲染状态 | 复杂度 |
| :--- | :---: | ---: |
| 标题系统 | ✅ 完美 | ⭐⭐ |
| 代码高亮 | ✅ 支持 | ⭐⭐⭐ |
| 复杂表格 | 🚧 适配中 | ⭐⭐⭐⭐ |

---

(上方是分割线 HR)
`;

const INITIAL_TEMPLATES: (Template & { theme: ITheme })[] = [
  {
    id: 'pixel-classic',
    name: '经典像素',
    description: '复古赛博朋克风格，灵感来自 8-bit 游戏。',
    thumbnailColor: '#FFD700',
    thumbnailUrl: '/thumbnails/pixel-classic.jpg',
    theme: pixelThemeDefault as unknown as ITheme
  },
  {
    id: 'tech-minimalist',
    name: '科技极简',
    description: '深色背景与霓虹光效，未来感十足。',
    thumbnailColor: '#0a0a0a',
    thumbnailUrl: '/thumbnails/tech-minimalist.jpg',
    theme: techMinimalistThemeDefault as unknown as ITheme
  },
  {
    id: 'magazine-fashion',
    name: '时尚杂志',
    description: '高端黑白金配色，大气的衬线字体排版。',
    thumbnailColor: '#ffffff',
    thumbnailUrl: '/thumbnails/magazine-fashion.jpg',
    theme: magazineFashionThemeDefault as unknown as ITheme
  },
  {
    id: 'neumorphism',
    name: '新拟态',
    description: '柔和的阴影与圆角设计，极具质感的 Soft UI 风格。',
    thumbnailColor: '#e0e5ec',
    thumbnailUrl: '/thumbnails/neumorphism.jpg',
    theme: neumorphismThemeDefault as unknown as ITheme
  },
  {
    id: 'retro-newspaper',
    name: '复古报纸',
    description: '泛黄的旧报纸风格，Typewriter 字体与衬线体。',
    thumbnailColor: '#f4f1ea',
    thumbnailUrl: '/thumbnails/retro-newspaper.jpg',
    theme: retroNewspaperThemeDefault as unknown as ITheme
  },
  {
    id: 'classic-theme',
    name: '商务经典',
    description: '简洁专业的风格，适合正式文档和通讯。',
    thumbnailColor: '#0056b3',
    thumbnailUrl: '/thumbnails/classic-theme.jpg',
    theme: classicThemeDefault as unknown as ITheme
  },
  {
    id: 'default-theme',
    name: '极简默认',
    description: '干净简约的默认主题，适合微信文章。',
    thumbnailColor: '#f2f2f2',
    thumbnailUrl: '/thumbnails/default-theme.jpg',
    theme: defaultThemeDefault as unknown as ITheme
  },
  {
    id: 'hand-drawn-theme',
    name: '手绘风格',
    description: '俏皮的手绘风格，带有漫画字体和虚线边框。',
    thumbnailColor: '#ffb347',
    thumbnailUrl: '/thumbnails/hand-drawn.jpg',
    theme: handDrawnThemeDefault as unknown as ITheme
  }
];

interface SkillPreviewBootstrap {
  enabled: boolean;
  payloadUrl: string;
  markdown: string;
  title: string;
  theme?: ITheme;
  renderMode: RenderMode;
}

function isRenderMode(value: string | null | undefined): value is RenderMode {
  return value === 'design-preview' || value === 'wechat-safe';
}

function readSkillPreviewBootstrap(): SkillPreviewBootstrap {
  if (typeof window === 'undefined') {
    return { enabled: false, payloadUrl: '', markdown: '', title: '', renderMode: 'design-preview' };
  }

  const url = new URL(window.location.href);
  if (url.searchParams.get(SKILL_PREVIEW_QUERY_KEY) !== '1') {
    return { enabled: false, payloadUrl: '', markdown: '', title: '', renderMode: 'design-preview' };
  }

  let markdown = '';
  let title = '';
  let theme: ITheme | undefined;
  let renderMode: RenderMode = isRenderMode(url.searchParams.get('renderMode'))
    ? url.searchParams.get('renderMode') as RenderMode
    : 'design-preview';

  try {
    const stored = window.localStorage.getItem(SKILL_PREVIEW_STORAGE_KEY);
    if (stored) {
      const payload = JSON.parse(stored) as { markdown?: string; title?: string; theme?: ITheme; renderMode?: RenderMode };
      markdown = typeof payload.markdown === 'string' ? payload.markdown : '';
      title = typeof payload.title === 'string' ? payload.title : '';
      theme = payload.theme;
      if (isRenderMode(payload.renderMode)) {
        renderMode = payload.renderMode;
      }
    }
  } catch (error) {
    console.warn('[pixel-post] Failed to read skill preview payload from localStorage.', error);
  }

  return {
    enabled: true,
    payloadUrl: url.searchParams.get('payload') || '',
    markdown,
    title,
    theme,
    renderMode,
  };
}

function deriveTitleFromMarkdown(markdown: string) {
  const match = markdown.match(/^\s*#\s+(.+)$/m);
  return match?.[1]?.trim() || '像素风排版草稿';
}

const App: React.FC = () => {
  const skillPreviewBootstrap = readSkillPreviewBootstrap();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(skillPreviewBootstrap.enabled ? 3 : 1);
  const [markdown, setMarkdown] = useState(skillPreviewBootstrap.markdown || DEFAULT_MD);
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ITheme>(skillPreviewBootstrap.theme || (pixelThemeDefault as unknown as ITheme));
  const [renderMode, setRenderMode] = useState<RenderMode>(skillPreviewBootstrap.renderMode || 'design-preview');
  const [showExtractor, setShowExtractor] = useState(false);
  const [templates, setTemplates] = useState<(Template & { theme: ITheme })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [skillPreviewLoading, setSkillPreviewLoading] = useState(
    skillPreviewBootstrap.enabled && !skillPreviewBootstrap.markdown && Boolean(skillPreviewBootstrap.payloadUrl)
  );
  const [skillPreviewError, setSkillPreviewError] = useState(
    skillPreviewBootstrap.enabled && !skillPreviewBootstrap.markdown && !skillPreviewBootstrap.payloadUrl
      ? '缺少 skill 预览内容。'
      : ''
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Ensure we have exactly 8 presets for the grid
      const targetCount = 8;
      const currentCount = INITIAL_TEMPLATES.length;
      const needed = Math.max(0, targetCount - currentCount);

      const demoTemplates = [
        ...INITIAL_TEMPLATES,
        ...INITIAL_TEMPLATES.slice(0, needed).map(t => ({
          ...t,
          id: t.id + '_copy',
          name: t.name + ' 2.0'
        }))
      ];
      setTemplates(demoTemplates);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!skillPreviewBootstrap.enabled) {
      return;
    }

    setStep(3);
    setCurrentTheme(skillPreviewBootstrap.theme || (pixelThemeDefault as unknown as ITheme));
    setRenderMode(skillPreviewBootstrap.renderMode || 'design-preview');
    setShowExtractor(false);

    if (skillPreviewBootstrap.title) {
      document.title = `${skillPreviewBootstrap.title} - Pixel Preview`;
    }

    if (skillPreviewBootstrap.markdown) {
      return;
    }

    if (!skillPreviewBootstrap.payloadUrl) {
      setSkillPreviewLoading(false);
      setSkillPreviewError('缺少 skill 预览内容。');
      return;
    }

    let cancelled = false;

    fetch(skillPreviewBootstrap.payloadUrl)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json() as Promise<{ markdown?: string; title?: string; theme?: ITheme; renderMode?: RenderMode }>;
      })
      .then((payload) => {
        if (cancelled) {
          return;
        }

        if (typeof payload.markdown !== 'string' || !payload.markdown.trim()) {
          throw new Error('Payload markdown is empty.');
        }

        setMarkdown(payload.markdown);
        if (payload.theme) {
          setCurrentTheme(payload.theme);
        }

        if (isRenderMode(payload.renderMode)) {
          setRenderMode(payload.renderMode);
        }

        if (payload.title) {
          document.title = `${payload.title} - Pixel Preview`;
        }

        window.localStorage.setItem(SKILL_PREVIEW_STORAGE_KEY, JSON.stringify({
          markdown: payload.markdown,
          title: payload.title || '',
          theme: payload.theme,
          renderMode: isRenderMode(payload.renderMode) ? payload.renderMode : renderMode,
        }));

        setSkillPreviewLoading(false);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setSkillPreviewLoading(false);
        setSkillPreviewError(error instanceof Error ? error.message : '加载 skill 预览内容失败。');
      });

    return () => {
      cancelled = true;
    };
  }, [skillPreviewBootstrap.enabled, skillPreviewBootstrap.markdown, skillPreviewBootstrap.payloadUrl, skillPreviewBootstrap.title]);

  const handleThemeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setCurrentTheme(json as ITheme);
        alert('主题加载成功！');
      } catch (err) {
        alert('无效的 JSON 文件');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setMarkdown(content);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleCopy = () => {
    const node = document.getElementById('wechat-output');
    if (!node) return;

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNode(node);

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        const success = document.execCommand('copy');
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);

          if (skillPreviewBootstrap.enabled) {
            window.open(WECHAT_NEW_ARTICLE_URL, '_blank', 'noopener,noreferrer');
          }
        }
      } catch (err) {
        alert('复制失败，请手动复制。');
      }
      selection.removeAllRanges();
    }
  };

  const handlePublish = async () => {
    if (isPublishing) {
      return;
    }

    setIsPublishing(true);

    try {
      const response = await fetch('/api/wechat/browser-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdown,
          title: deriveTitleFromMarkdown(markdown),
          author: currentTheme.meta?.author || 'wpdesign',
          appUrl: `${window.location.origin}/`,
          theme: currentTheme,
          renderMode,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || result?.message || '一键发布失败。');
      }

      alert(`草稿已保存：${result.draft?.title || result.title}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : '一键发布失败。');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neo-cream font-sans text-neo-ink selection:bg-neo-yellow selection:text-black">
      {step === 1 && (
        <LandingPage
          templates={templates}
          templatesList={templates}
          isLoading={isLoading}
          onEnterStudio={() => setStep(2)}
          onOpenExtractor={() => setShowExtractor(true)}
          onOpenDocs={() => setStep(4)}
          onSelectTheme={setCurrentTheme}
          currentThemeId={templates.find(t => JSON.stringify(t.theme) === JSON.stringify(currentTheme))?.id || 'pixel-classic'}
          currentTheme={currentTheme}
        />
      )}

      {step === 2 && (
        <Editor
          markdown={markdown}
          setMarkdown={setMarkdown}
          onBack={() => setStep(1)}
          onPreview={() => setStep(3)}
          onThemeUpload={handleThemeUpload}
          onFileUpload={handleFileUpload}
        />
      )}

      {step === 3 && (
        skillPreviewLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-neo-cream px-6">
            <div className="bg-white border-4 border-neo-ink shadow-neo-lg p-8 max-w-xl w-full text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-neo-ink/50 mb-4">Skill Preview</p>
              <h1 className="text-3xl font-black mb-3">正在加载经典像素预览</h1>
              <p className="text-lg text-neo-ink/70">页面准备完成后，你可以直接点击复制并打开公众号新增文章页。</p>
            </div>
          </div>
        ) : skillPreviewError ? (
          <div className="min-h-screen flex items-center justify-center bg-neo-cream px-6">
            <div className="bg-white border-4 border-neo-ink shadow-neo-lg p-8 max-w-xl w-full text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-neo-accent mb-4">Skill Preview Error</p>
              <h1 className="text-3xl font-black mb-3">预览内容加载失败</h1>
              <p className="text-lg text-neo-ink/70">{skillPreviewError}</p>
            </div>
          </div>
        ) : (
          <Preview
            markdown={markdown}
            theme={currentTheme}
            copied={copied}
            onBack={() => setStep(2)}
            onCopy={handleCopy}
            skillMode={skillPreviewBootstrap.enabled}
            renderMode={renderMode}
            onRenderModeChange={setRenderMode}
            onPublish={handlePublish}
            isPublishing={isPublishing}
          />
        )
      )}

      {step === 4 && (
        <Help onBack={() => setStep(1)} />
      )}

      {showExtractor && (
        <ThemeExtractorUI
          onThemeExtracted={(theme) => {
            setCurrentTheme(theme);
            setShowExtractor(false);
            setStep(2);
          }}
          onClose={() => setShowExtractor(false)}
        />
      )}
    </div>
  );
};

export default App;
