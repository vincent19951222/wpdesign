import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Help } from './components/Help';
import ThemeExtractorUI from './components/ThemeExtractorUI';
import { Template } from './types';
import { ITheme } from './types/ITheme';
import pixelThemeDefault from './themes/pixel-theme.json';
import classicThemeDefault from './themes/classic-theme.json';
import defaultThemeDefault from './themes/default-theme.json';
import handDrawnThemeDefault from './themes/hand-drawn-theme.json';

import techMinimalistThemeDefault from './themes/tech-minimalist-theme.json';
import magazineFashionThemeDefault from './themes/magazine-fashion-theme.json';
import neumorphismThemeDefault from './themes/neumorphism-theme.json';
import retroNewspaperThemeDefault from './themes/retro-newspaper-theme.json';
import pixelV4ThemeDefault from './themes/pixel-v4-theme.json';
import pixelV4ApiSafeThemeDefault from './themes/pixel-v4-api-safe-theme.json';
import pixelClassicApiSafeThemeDefault from './themes/pixel-classic-api-safe-theme.json';

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
    category: 'standard',
    theme: pixelThemeDefault as unknown as ITheme
  },
  {
    id: 'pixel-v4',
    name: '像素原野',
    description: '基于 v4 的清新像素主题，适合公众号日常发布。',
    thumbnailColor: '#ebe4d7',
    thumbnailUrl: '/thumbnails/pixel-classic.jpg',
    category: 'standard',
    theme: pixelV4ThemeDefault as unknown as ITheme
  },
  {
    id: 'pixel-v4-api-safe',
    name: '像素原野 API',
    description: '为草稿 API 收敛的版本，弱化边框、阴影和外层装饰。',
    thumbnailColor: '#ffffff',
    thumbnailUrl: '/thumbnails/pixel-classic.jpg',
    category: 'api-safe',
    theme: pixelV4ApiSafeThemeDefault as unknown as ITheme
  },
  {
    id: 'pixel-classic-api-safe',
    name: '经典像素 API',
    description: '保留经典像素的文字识别度，移除厚重容器装饰，适合公众号 API-safe 发布。',
    thumbnailColor: '#fff2c4',
    thumbnailUrl: '/thumbnails/pixel-classic.jpg',
    category: 'api-safe',
    theme: pixelClassicApiSafeThemeDefault as unknown as ITheme
  },
  {
    id: 'tech-minimalist',
    name: '科技极简',
    description: '浅色科技感版式，冷静留白与精密蓝色点缀。',
    thumbnailColor: '#f5f8fc',
    thumbnailUrl: '/thumbnails/tech-minimalist.jpg',
    category: 'standard',
    theme: techMinimalistThemeDefault as unknown as ITheme
  },
  {
    id: 'magazine-fashion',
    name: '时尚杂志',
    description: '高端黑白金配色，大气的衬线字体排版。',
    thumbnailColor: '#ffffff',
    thumbnailUrl: '/thumbnails/magazine-fashion.jpg',
    category: 'standard',
    theme: magazineFashionThemeDefault as unknown as ITheme
  },
  {
    id: 'neumorphism',
    name: '新拟态',
    description: '柔和的阴影与圆角设计，极具质感的 Soft UI 风格。',
    thumbnailColor: '#e0e5ec',
    thumbnailUrl: '/thumbnails/neumorphism.jpg',
    category: 'standard',
    theme: neumorphismThemeDefault as unknown as ITheme
  },
  {
    id: 'retro-newspaper',
    name: '复古报纸',
    description: '泛黄的旧报纸风格，Typewriter 字体与衬线体。',
    thumbnailColor: '#f4f1ea',
    thumbnailUrl: '/thumbnails/retro-newspaper.jpg',
    category: 'standard',
    theme: retroNewspaperThemeDefault as unknown as ITheme
  },
  {
    id: 'classic-theme',
    name: '商务经典',
    description: '简洁专业的风格，适合正式文档和通讯。',
    thumbnailColor: '#0056b3',
    thumbnailUrl: '/thumbnails/classic-theme.jpg',
    category: 'standard',
    theme: classicThemeDefault as unknown as ITheme
  },
  {
    id: 'default-theme',
    name: '极简默认',
    description: '干净简约的默认主题，适合微信文章。',
    thumbnailColor: '#f2f2f2',
    thumbnailUrl: '/thumbnails/default-theme.jpg',
    category: 'standard',
    theme: defaultThemeDefault as unknown as ITheme
  },
  {
    id: 'hand-drawn-theme',
    name: '手绘风格',
    description: '俏皮的手绘风格，带有漫画字体和虚线边框。',
    thumbnailColor: '#ffb347',
    thumbnailUrl: '/thumbnails/hand-drawn.jpg',
    category: 'standard',
    theme: handDrawnThemeDefault as unknown as ITheme
  }
];

const App: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ITheme>(pixelThemeDefault as unknown as ITheme);
  const [showExtractor, setShowExtractor] = useState(false);
  const [templates, setTemplates] = useState<(Template & { theme: ITheme })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Ensure we have exactly 10 presets for the grid
      const targetCount = 10;
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
        }
      } catch (err) {
        alert('复制失败，请手动复制。');
      }
      selection.removeAllRanges();
    }
  };

  return (
    <div className="min-h-screen bg-neo-cream font-sans text-neo-ink selection:bg-neo-yellow selection:text-black">
      {step === 1 && (
        <LandingPage
          templates={templates}
          isLoading={isLoading}
          onEnterStudio={() => setStep(2)}
          onOpenExtractor={() => setShowExtractor(true)}
          onOpenDocs={() => setStep(4)}
          onSelectTheme={setCurrentTheme}
          currentThemeId={templates.find(t => JSON.stringify(t.theme) === JSON.stringify(currentTheme))?.id || 'pixel-classic'}
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
        <Preview
          markdown={markdown}
          theme={currentTheme}
          copied={copied}
          onBack={() => setStep(2)}
          onCopy={handleCopy}
        />
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
