import React, { useState, useEffect } from 'react';
import { Terminal, FileText, ArrowRight, Copy, Check, ChevronLeft, Upload, Palette, Wand2, Sparkles, Layout } from 'lucide-react';
import ThemeGallery from './components/ThemeGallery';
import WeChatRenderer from './components/WeChatRenderer';
import ThemeExtractorUI from './components/ThemeExtractorUI';
import { NeoButton, NeoCard, NeoBadge, NeoSwitch } from './components/NeoUI';
import { InfiniteMarquee, DraggableSticker, NeoGridBackground, StickersPack } from './components/NeoEffects';
import { Template } from './types';
import { ITheme } from './types/ITheme';
import pixelThemeDefault from './themes/pixel-theme.json';
import classicThemeDefault from './themes/classic-theme.json';
import defaultThemeDefault from './themes/default-theme.json';
import handDrawnThemeDefault from './themes/hand-drawn-theme.json';

// Default Markdown Template (Keep existing)
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
    theme: pixelThemeDefault as unknown as ITheme
  },
  {
    id: 'classic-theme',
    name: '商务经典',
    description: '简洁专业的风格，适合正式文档和通讯。',
    thumbnailColor: '#0056b3',
    theme: classicThemeDefault as unknown as ITheme
  },
  {
    id: 'default-theme',
    name: '极简默认',
    description: '干净简约的默认主题，适合微信文章。',
    thumbnailColor: '#ffffff',
    theme: defaultThemeDefault as unknown as ITheme
  },
  {
    id: 'hand-drawn-theme',
    name: '手绘风格',
    description: '俏皮的手绘风格，带有漫画字体和虚线边框。',
    thumbnailColor: '#ffb347',
    theme: handDrawnThemeDefault as unknown as ITheme
  }
];

const App: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ITheme>(pixelThemeDefault as unknown as ITheme);
  const [showExtractor, setShowExtractor] = useState(false);

  // Data Source Simulation
  const [templates, setTemplates] = useState<(Template & { theme: ITheme })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate Network Request
    const timer = setTimeout(() => {
      setTemplates(INITIAL_TEMPLATES);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Theme Upload Logic
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

  // File Upload Logic
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

  // Copy Logic
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

  const renderStep1 = () => (
    <NeoGridBackground>
      <div className="flex flex-col min-h-screen relative">

        {/* Navbar */}
        <nav className="flex justify-between items-center p-6 border-b-4 border-neo-ink bg-white z-50 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-ink text-white flex items-center justify-center font-black text-xl">
              PL
            </div>
            <span className="font-sans font-bold text-xl uppercase tracking-wider hidden sm:block">Pixel Lab</span>
          </div>
          <div className="flex gap-4">
            <NeoButton size="sm" variant="secondary" onClick={() => setShowExtractor(true)}>
              <Wand2 size={16} /> EXTRACT
            </NeoButton>
            <NeoButton size="sm" onClick={() => window.open('https://github.com', '_blank')}>
              GITHUB
            </NeoButton>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative py-20 px-4 text-center overflow-hidden">
          <StickersPack />

          <h1 className="text-7xl md:text-9xl font-black uppercase text-neo-ink mb-6 relative z-10"
            style={{ WebkitTextStroke: '2px black', color: 'transparent' }}
          >
            Digital<br />
            <span className="text-neo-ink" style={{ WebkitTextStroke: '0' }}>Punk</span>
          </h1>

          <p className="font-mono text-lg md:text-xl font-bold bg-white inline-block px-4 py-2 border-2 border-neo-ink shadow-[4px_4px_0px_0px_#000] rotate-2">
            RAW AESTHETICS FOR WECHAT
          </p>
        </header>

        {/* Marquee */}
        <InfiniteMarquee text="NEO-BRUTALISM • HIGH CONTRAST • RAW • BOLD •" />

        {/* Main Content - Gallery */}
        <main className="flex-1 flex flex-col items-center justify-center py-12 relative z-10">
          {isLoading ? (
            <div className="text-2xl font-black animate-pulse">LOADING RESOURCES...</div>
          ) : (
            <div className="w-full max-w-6xl">
              <ThemeGallery
                templates={templates}
                onSelect={(t) => setCurrentTheme(t.theme)}
                currentId={templates.find(t => JSON.stringify(t.theme) === JSON.stringify(currentTheme))?.id || 'pixel-classic'}
              />

              <div className="flex justify-center mt-12">
                <NeoButton size="lg" onClick={() => setStep(2)}>
                  ENTER STUDIO <ArrowRight strokeWidth={3} />
                </NeoButton>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t-4 border-neo-ink p-6 bg-neo-yellow text-center font-mono text-sm font-bold">
          © 2025 PIXEL LAB. NO COPYRIGHTS RESERVED.
        </footer>

      </div>
    </NeoGridBackground>
  );

  const renderStep2 = () => (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-neo-cream p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep(1)} className="hover:-translate-x-1 transition-transform">
            <div className="bg-neo-ink text-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <ChevronLeft strokeWidth={3} />
            </div>
          </button>
          <NeoBadge>EDITOR V2.0</NeoBadge>
        </div>

        <div className="flex gap-3">
          <input type="file" id="theme-upload" accept=".json" className="hidden" onChange={handleThemeUpload} />
          <NeoButton size="sm" variant="secondary" onClick={() => document.getElementById('theme-upload')?.click()}>
            <Palette size={16} /> THEME
          </NeoButton>

          <input type="file" id="md-upload" accept=".md" className="hidden" onChange={handleFileUpload} />
          <NeoButton size="sm" variant="secondary" onClick={() => document.getElementById('md-upload')?.click()}>
            <Upload size={16} /> UPLOAD
          </NeoButton>

          <NeoButton onClick={() => setStep(3)}>
            PREVIEW <ArrowRight size={16} />
          </NeoButton>
        </div>
      </div>

      <NeoCard className="flex-1 p-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 bg-neo-ink text-white font-mono text-xs px-2 py-1 border-b-4 border-r-4 border-black z-10">
          MARKDOWN INPUT
        </div>
        <textarea
          className="w-full h-full bg-white text-neo-ink font-mono resize-none focus:outline-none p-8 pt-10 text-lg"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          spellCheck={false}
          placeholder="# START TYPING..."
        />
      </NeoCard>
    </div>
  );

  const renderStep3 = () => (
    <div className="h-full flex flex-col items-center justify-center bg-neo-cream p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep(2)} className="hover:-translate-x-1 transition-transform">
            <div className="bg-neo-ink text-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
              <ChevronLeft strokeWidth={3} />
            </div>
          </button>
          <NeoBadge color="bg-neo-green">PREVIEW MODE</NeoBadge>
        </div>

        <div className="hidden md:block">
          <NeoButton onClick={handleCopy}>
            {copied ? <><Check strokeWidth={3} /> COPIED!</> : <><Copy strokeWidth={3} /> COPY HTML</>}
          </NeoButton>
        </div>
      </div>

      {/* Mobile Simulator */}
      <div className="relative w-full max-w-[400px] h-[75vh] border-8 border-neo-ink bg-white shadow-[16px_16px_0px_0px_#000] overflow-hidden">
        {/* Fake Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neo-ink rounded-b-md z-20"></div>

        <div className="w-full h-full overflow-y-auto bg-white custom-scrollbar">
          <WeChatRenderer content={markdown} theme={currentTheme} />
        </div>
      </div>

      {/* Mobile Floating Button */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <button
          onClick={handleCopy}
          className="w-16 h-16 bg-neo-yellow border-4 border-neo-ink shadow-[4px_4px_0px_0px_#000] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all"
        >
          {copied ? <Check strokeWidth={3} /> : <Copy strokeWidth={3} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neo-cream font-sans text-neo-ink selection:bg-neo-yellow selection:text-black">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

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
