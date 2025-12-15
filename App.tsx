import React, { useState, useEffect } from 'react';
import { Terminal, FileText, Smartphone, ArrowRight, Copy, Check, ChevronLeft, Sun, Upload, Palette, Wand2 } from 'lucide-react';
import WeChatRenderer from './components/WeChatRenderer';
import ThemeExtractorUI from './components/ThemeExtractorUI';
import { PixelButton, TemplateCard } from './components/UI';
import { Template } from './types';
import { ITheme } from './types/ITheme';
import pixelThemeDefault from './themes/pixel-theme.json';
import classicThemeDefault from './themes/classic-theme.json';
import defaultThemeDefault from './themes/default-theme.json';
import handDrawnThemeDefault from './themes/hand-drawn-theme.json';

// Default Markdown Template
const DEFAULT_MD = `# 像素实验室 DEMO

## 1. 基础排版元素

这是普通段落 (p)，通过简单的 Markdown 转换，我们生成符合主题风格的微信排版。
这里展示了 **加粗文字 (strong)** 和 *斜体文字 (em)* 以及 \`行内代码 (code)\` 的混合排版效果。

你可以访问 [像素实验室 (Link)](https://github.com) 了解更多详情。

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

const TEMPLATES: (Template & { theme: ITheme })[] = [
  {
    id: 'pixel-classic',
    name: 'Pixel Classic',
    description: 'A retro cyberpunk style inspired by 8-bit games. Features bright yellow accents and console-style headers.',
    thumbnailColor: '#FFD700',
    theme: pixelThemeDefault as unknown as ITheme
  },
  {
    id: 'classic-theme',
    name: 'Classic Corporate',
    description: 'A clean, professional style suitable for official documents and newsletters.',
    thumbnailColor: '#0056b3',
    theme: classicThemeDefault as unknown as ITheme
  },
  {
    id: 'default-theme',
    name: 'Default Minimal',
    description: 'A clean, minimal default theme for WeChat articles.',
    thumbnailColor: '#ffffff',
    theme: defaultThemeDefault as unknown as ITheme
  },
  {
    id: 'hand-drawn-theme',
    name: 'Hand Drawn',
    description: 'A playful hand-drawn style with comic fonts and dashed borders.',
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

  // Auto-load theme from public folder if exists (VPS/Deployment support)
  useEffect(() => {
    fetch('/theme.json')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('No custom theme found');
      })
      .then(data => {
        console.log('Custom theme loaded from /theme.json');
        setCurrentTheme(data as ITheme);
      })
      .catch(() => {
        // console.log('Using default theme');
      });
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
        alert('Theme loaded successfully!');
      } catch (err) {
        alert('Invalid JSON file');
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
    // Reset input so same file can be uploaded again if needed
    event.target.value = '';
  };

  // Copy Logic
  const handleCopy = () => {
    const node = document.getElementById('wechat-output');
    if (!node) return;

    const selection = window.getSelection();
    const range = document.createRange();

    // Select the node specifically
    range.selectNode(node);

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);

      try {
        const success = document.execCommand('copy');
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('execCommand returned false');
        }
      } catch (err) {
        console.error('Copy failed', err);
        alert('Copy failed. Please manually select the content (Ctrl+A) inside the preview and copy.');
      }

      selection.removeAllRanges();
    }
  };

  const renderStep1 = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="font-pixel text-2xl md:text-4xl text-white mb-4 text-center">
        <span className="text-pixel-yellow">SELECT</span> THEME
      </h1>
      <p className="font-mono text-gray-400 text-center mb-12">Choose a visual cartridge for your content.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATES.map(t => (
          <TemplateCard
            key={t.id}
            title={t.name}
            description={t.description}
            color={t.thumbnailColor}
            active={false}
            onClick={() => {
              setCurrentTheme(t.theme);
              setStep(2);
            }}
          />
        ))}
      </div>

      {/* Theme Extractor Entry */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm mb-4">— or —</p>
        <PixelButton icon={Wand2} onClick={() => setShowExtractor(true)}>
          EXTRACT FROM HTML
        </PixelButton>
        <p className="text-gray-600 text-xs mt-2">
          Upload any HTML file to auto-extract its styles as a theme
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white transition-colors">
            <ChevronLeft />
          </button>
          <h2 className="font-pixel text-xl text-white">EDITOR_V1.0</h2>
        </div>

        <div className="flex gap-3">
          {/* Theme Upload */}
          <input
            type="file"
            id="theme-upload"
            accept=".json"
            className="hidden"
            onChange={handleThemeUpload}
          />
          <PixelButton onClick={() => document.getElementById('theme-upload')?.click()} icon={Palette}>
            THEME
          </PixelButton>

          <input
            type="file"
            id="md-upload"
            accept=".md"
            className="hidden"
            onChange={handleFileUpload}
          />
          <PixelButton onClick={() => document.getElementById('md-upload')?.click()} icon={Upload}>
            UPLOAD MD
          </PixelButton>
          <PixelButton primary onClick={() => setStep(3)} icon={ArrowRight}>
            GENERATE
          </PixelButton>
        </div>
      </div>

      <div className="flex-1 bg-pixel-darker border-2 border-gray-700 p-4 relative shadow-[4px_4px_0px_0px_#333]">
        <div className="absolute top-0 left-0 bg-pixel-yellow text-pixel-dark font-pixel text-[10px] px-2 py-1">
          MARKDOWN INPUT
        </div>
        <textarea
          className="w-full h-full bg-transparent text-gray-300 font-mono resize-none focus:outline-none pt-6 p-2"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          spellCheck={false}
          placeholder="# Start typing or upload a markdown file..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setStep(2)} className="text-gray-400 hover:text-white transition-colors">
            <ChevronLeft />
          </button>
          <h2 className="font-pixel text-xl text-white">PREVIEW</h2>
        </div>

        <div className="hidden md:block">
          <PixelButton primary={!copied} onClick={handleCopy} icon={copied ? Check : Copy}>
            {copied ? 'COPIED!' : 'COPY HTML'}
          </PixelButton>
        </div>
      </div>

      {/* Mobile Simulator Container */}
      <div className="relative w-full max-w-[400px] h-[75vh] md:h-[80vh] border-[10px] border-gray-800 rounded-[30px] bg-white overflow-hidden shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>

        {/* Floating Copy Button for Mobile UX */}
        <div className="absolute bottom-6 right-6 z-50 md:hidden">
          <button
            onClick={handleCopy}
            className={`
                        w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all
                        ${copied ? 'bg-pixel-green text-black' : 'bg-pixel-yellow text-black'}
                    `}
          >
            {copied ? <Check /> : <Copy />}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="w-full h-full overflow-y-auto bg-[#f7f9fa] custom-scrollbar">
          <WeChatRenderer content={markdown} theme={currentTheme} />
        </div>
      </div>

      <p className="mt-4 font-mono text-gray-500 text-xs text-center max-w-lg">
        * Preview mode. Click "Copy HTML" to copy rich text.
        <br />If formatting is lost in WeChat, try selecting the text in the preview manually (Ctrl+A) and copying.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-pixel-dark flex flex-col">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-pixel-darker z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-pixel-yellow flex items-center justify-center border-2 border-white">
            <Terminal size={18} className="text-black" />
          </div>
          <span className="font-pixel text-white text-sm hidden sm:block">NOODLE LAB</span>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm ${step >= i ? 'bg-pixel-green' : 'bg-gray-700'}`}
            />
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </main>

      {/* Theme Extractor Modal */}
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