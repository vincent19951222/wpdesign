import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft, Copy, Check } from 'lucide-react';
import { NeoGridBackground } from './NeoEffects';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const HELP_CONTENT = `# Wp Design 帮助文档

> 🎨 一款将 Markdown 内容转换为精美微信公众号排版的在线工具

---

## 📖 产品介绍

**Wp Design** 是一个基于 Web 的 Markdown 排版工具，专为微信公众号创作者设计。它能将标准 Markdown 内容渲染为带有精美样式的 HTML，并完美兼容微信编辑器。

### 核心功能

| 功能 | 说明 |
| :-- | :-- |
| **Markdown 实时预览** | 所见即所得的编辑体验 |
| **多主题切换** | 提供多种预设主题风格 |
| **AI 主题提取** | 智能克隆任意网页设计风格 |
| **一键复制** | 直接粘贴到微信公众号 |

---

## 🚀 快速开始

### 使用流程

\`\`\`
步骤 1：选择主题    →    步骤 2：编辑内容    →    步骤 3：复制粘贴
\`\`\`

#### 1️⃣ 选择主题

在首页 **主题画廊** 中浏览预设主题，点击喜欢的主题卡片即可进入编辑器。

预设主题包括：

- **经典像素** - 复古赛博朋克风格
- **商务经典** - 简洁专业的商务风格
- **极简默认** - 干净简约的默认主题
- **手绘风格** - 俏皮的漫画手绘风

#### 2️⃣ 编辑 Markdown

在编辑器中输入或粘贴你的 Markdown 内容。支持以下格式：

\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题

**加粗文字** 和 *斜体文字*

> 引用块内容

- 列表项目
1. 有序列表

\`行内代码\` 和代码块

[链接文字](url)

| 表头 | 表头 |
| --- | --- |
| 内容 | 内容 |
\`\`\`

#### 3️⃣ 预览与复制

点击 **预览** 按钮查看最终效果，确认满意后点击 **复制** 按钮，直接粘贴到微信公众号编辑器即可。

---

## ✨ 主题系统

### 预设主题

系统提供了 4 款精心设计的预设主题，涵盖多种应用场景：

| 主题名称 | 适用场景 |
| :-- | :-- |
| 经典像素 | 科技、游戏、创意内容 |
| 商务经典 | 企业通讯、行业报告 |
| 极简默认 | 日常文章、个人博客 |
| 手绘风格 | 趣味内容、插画专题 |

### 导入自定义主题

除了使用预设主题，你还可以导入 JSON 格式的自定义主题文件：

1. 在编辑器工具栏点击 **导入主题**
2. 选择符合规范的 \`.json\` 主题文件
3. 系统将自动应用新主题

---

## 🤖 AI 主题提取

### 功能说明

**AI 主题提取器** 是一项强大的功能，它可以分析任意网页的样式，并自动生成可复用的主题 JSON 文件。

### 使用方法

1. **准备 HTML 文件**  
   将喜欢的网页另存为 HTML 文件 (完整网页格式)。

2. **上传文件**  
   点击首页的 **AI 主题提取** 按钮，上传准备好的 HTML 文件。

3. **等待处理**  
   系统将自动执行以下步骤：
   - 清理和规范化 HTML
   - 调用 AI (Kimi K2) 分析样式
   - 解析并生成主题 JSON

4. **预览与应用**  
   提取完成后可预览效果，满意后点击 **应用主题** 或 **下载 JSON**。

### 注意事项

- 建议上传包含丰富样式内联的 HTML 文件
- 提取效果取决于源文件的样式完整性
- 复杂动画效果可能无法完全提取

---

## 📝 Markdown 语法速查

### 标题

\`\`\`markdown
# 一级标题 (H1)
## 二级标题 (H2)
### 三级标题 (H3)
#### 四级标题 (H4)
##### 五级标题 (H5)
\`\`\`

### 文本样式

\`\`\`markdown
**加粗文字**
*斜体文字*
\`行内代码\`
[链接文字](https://example.com)
\`\`\`

### 列表

\`\`\`markdown
- 无序列表项
- 无序列表项

1. 有序列表项
2. 有序列表项
\`\`\`

### 引用

\`\`\`markdown
> 这是引用块
> 可以多行
\`\`\`

### 代码块

\`\`\`\`markdown
\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`
\`\`\`\`

### 表格

\`\`\`markdown
| 表头 1 | 表头 2 |
| :-- | :-- |
| 左对齐 | 内容 |
\`\`\`

### 分割线

\`\`\`markdown
---
\`\`\`

---

## ❓ 常见问题

### Q: 复制到微信后样式丢失？

**A:** 请确保使用 **复制** 按钮进行复制，不要直接选中文字复制。系统会自动处理内联样式以确保微信兼容性。

### Q: 如何创建自定义主题？

**A:** 你可以通过以下方式获得自定义主题：
1. 使用 **AI 主题提取器** 从现有网页生成
2. 下载现有主题 JSON 并手动修改
3. 参考主题 JSON 结构从头创建

### Q: 支持哪些 Markdown 格式？

**A:** 支持 GitHub Flavored Markdown (GFM) 的大部分语法，包括表格、代码块、任务列表等。

### Q: 图片如何处理？

**A:** 目前版本需要手动将图片上传到微信后台后，在 Markdown 中引用图片链接。

---

## 💡 最佳实践

1. **先选主题，再写内容** - 不同主题的视觉效果差异较大，建议先确定风格
2. **善用引用块** - 引用块适合突出重要信息或补充说明
3. **控制标题层级** - 建议使用不超过 3 级标题，保持文章结构清晰
4. **表格要简洁** - 微信对复杂表格支持有限，保持表格简单
5. **预览后再复制** - 养成预览习惯，确保效果符合预期

---

## 🎯 AI 生成主题 Prompt 模板

如果你想使用 AI (如 ChatGPT、Claude 等) 生成自定义的 HTML 样式文件，可以使用以下 Prompt 模板：

\`\`\`markdown
请帮我生成一个微信公众号文章排版样式的 HTML 文件。

## 风格要求

[用户输入风格]

## 必须包含的元素

请确保 HTML 中包含以下所有元素，每个元素都需要有独特的视觉样式：

### 标题系统
- **H1 主标题**：文章的核心标题，需要醒目突出
- **H1 副标题**：主标题下的补充说明文字
- **H2 二级标题**：章节大标题
- **H3 三级标题**：需要包含一个小徽章/标签 + 标题文字的组合
- **H4 四级标题**：小节标题
- **H5 五级标题**：更细分的标题

### 文字样式
- **段落 (p)**：正文段落样式
- **加粗 (strong)**：强调文字，建议使用高亮背景效果
- **斜体 (em)**：次要强调
- **行内代码 (code)**：用于显示代码或技术术语
- **超链接 (a)**：链接样式，需要有独特的下划线或颜色

### 特殊区块
- **引用块 (blockquote)**：包含一个徽章（如"NOTE"、"提示"）和内容区域
- **无序列表 (ul)**：每个列表项需要一个装饰性的圆点标记
- **有序列表 (ol)**：每个列表项需要一个数字标记，有独特样式
- **代码块 (pre)**：包含头部（三个圆点 + 语言标签）和代码内容区域
- **表格 (table)**：包含表头 (thead/th) 和单元格 (td) 样式
- **分割线 (hr)**：装饰性分割线
- **页脚 (footer)**：包含一个图标和签名文字

## 技术规范

1. **样式位置**：所有样式必须写在 \`<style>\` 标签内或作为内联样式，不使用外部 CSS 文件
2. **颜色格式**：使用十六进制 (#FFFFFF) 或 rgba 格式
3. **字体**：可以使用 Google Fonts，但主要依赖安全字体族
4. **结构清晰**：每个元素使用语义化的 HTML 标签
5. **响应式**：最大宽度建议 680px，适合移动端阅读

## 输出要求

1. 输出完整的 HTML 文件，包含 \`<!DOCTYPE html>\` 到 \`</html>\`
2. 包含示例内容，展示每种元素的效果
3. 样式要有设计感，符合指定的风格
4. 添加适当的装饰性元素增强视觉效果

请直接输出 HTML 代码，不需要解释。
\`\`\`

## 🎨 风格描述示例

用户可以用以下方式描述想要的风格：

### 示例 1：手绘卡通风
\`\`\`markdown
手绘卡通风格，温暖的粉橙黄配色，圆润的边角，
带有阴影和倾斜效果，像是用蜡笔和彩色铅笔画出来的感觉
\`\`\`

### 示例 2：科技极简风
\`\`\`markdown
科技极简风格，雾白或浅银灰背景，冷蓝色强调，
细线分割、克制的几何装饰、大量留白，整体像产品实验室或未来编辑部
\`\`\`

### 示例 3：中国风水墨
\`\`\`markdown
中国水墨风格，米白色纸张质感背景，黑色文字，
朱红色点缀，毛笔书法字体感觉，淡墨渲染效果的装饰
\`\`\`

### 示例 4：杂志时尚风
\`\`\`markdown
高端时尚杂志风格，黑白金配色，大标题加粗无衬线字体，
留白充足，金色装饰线，几何图形点缀
\`\`\`

### 示例 5：复古报纸风
\`\`\`markdown
复古报纸风格，泛黄纸张背景，衬线字体，
黑色粗边框，双栏布局感觉，打字机字体点缀
\`\`\`

### 示例 6：童话故事风
\`\`\`markdown
童话故事风格，柔和的粉蓝紫渐变，圆角卡片，
星星和云朵装饰，可爱的emoji图标点缀
\`\`\`

### 使用方法

1. 复制上述 Prompt 模板
2. 将 \`[用户输入风格]\` 替换为你想要的风格描述，例如：
   - "极简主义，使用黑白灰配色"
   - "赛博朋克风格，霓虹色彩"
   - "日式和风，柔和的粉色系"
3. 将 AI 生成的 HTML 文件保存
4. 在 Wp Design 中使用 **AI 主题提取** 功能导入该文件

---

## 🔗 更多资源

- [Markdown 语法指南](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

---

`;

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-4 right-4 bg-white border-2 border-neo-ink p-1.5 shadow-neo-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all z-10"
            title="Copy code"
        >
            {copied ? (
                <Check size={16} className="text-neo-green stroke-[3px]" />
            ) : (
                <Copy size={16} className="text-neo-ink stroke-[3px]" />
            )}
        </button>
    );
};


interface HelpProps {
    onBack: () => void;
}

export const Help: React.FC<HelpProps> = ({ onBack }) => {
    return (
        <NeoGridBackground>
            <div className="flex flex-col min-h-screen relative">
                {/* Navbar - Sticky */}
                <nav className="flex justify-between items-center p-6 border-b-4 border-neo-ink bg-neo-yellow z-50 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neo-ink text-neo-yellow flex items-center justify-center font-black text-xl border-2 border-white">
                            PL
                        </div>
                        <span className="font-sans font-black text-xl uppercase tracking-wider hidden sm:block">Wp Design</span>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            size="sm"
                            className="bg-white hover:bg-neo-raspberry hover:text-white border-neo-ink text-neo-ink font-bold"
                            onClick={onBack}
                        >
                            <ChevronLeft size={16} className="mr-2" /> DATA RETURN
                        </Button>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 relative z-10">
                    <div className="bg-white border-4 border-neo-ink shadow-neo-xl p-8 md:p-12 mb-12">
                        {/* Header Decoration */}
                        <div className="mb-8 border-b-4 border-neo-ink pb-6 flex justify-between items-end">
                            <h1 className="text-4xl md:text-5xl font-black uppercase text-neo-ink">
                                Help Center
                            </h1>
                            <div className="hidden md:block bg-neo-green px-4 py-1 border-2 border-neo-ink font-mono font-bold text-sm transform rotate-2">
                                DOCS_V1.0
                            </div>
                        </div>

                        {/* Markdown Content */}
                        <div className="font-sans text-neo-ink">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // Headers
                                    h1: ({ node, ...props }) => <h1 className="text-4xl md:text-5xl font-black uppercase mb-8 border-b-4 border-neo-ink pb-4 mt-12 first:mt-0" {...props} />,
                                    h2: ({ node, ...props }) => (
                                        <div className="relative mb-6 mt-12 inline-block">
                                            <div className="absolute top-0 left-0 w-full h-full bg-neo-black transform translate-x-1 translate-y-1"></div>
                                            <h2 className="relative text-2xl md:text-3xl font-black uppercase bg-neo-yellow border-2 border-neo-ink px-4 py-2 transform -rotate-1" {...props} />
                                        </div>
                                    ),
                                    h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl font-black uppercase mb-4 mt-8 flex items-center gap-2 before:content-[''] before:block before:w-4 before:h-4 before:bg-neo-raspberry before:border-2 before:border-neo-ink" {...props} />,
                                    h4: ({ node, ...props }) => <h4 className="text-lg md:text-xl font-bold uppercase mb-3 mt-6 border-l-4 border-neo-ink pl-3" {...props} />,

                                    // Text
                                    p: ({ node, ...props }) => <p className="text-lg font-bold leading-relaxed mb-6" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-black bg-neo-yellow px-1 border-b-2 border-neo-ink" {...props} />,
                                    em: ({ node, ...props }) => <em className="font-bold text-neo-raspberry not-italic decoration-wavy underline decoration-2" {...props} />,

                                    // Lists
                                    ul: ({ node, ...props }) => <ul className="mb-6 space-y-2 list-none" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="mb-6 space-y-2 list-decimal list-inside font-bold" {...props} />,
                                    li: ({ node, ...props }) => (
                                        <li className="flex items-start gap-2 font-bold text-lg">
                                            <span className="mt-2 w-2 h-2 bg-neo-ink shrink-0 rotate-45" />
                                            <span>{props.children}</span>
                                        </li>
                                    ),

                                    // Blockquote
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote className="my-8 p-6 bg-neo-cream border-l-8 border-neo-ink shadow-neo-sm font-bold italic relative">
                                            <span className="absolute -top-3 -right-3 bg-neo-raspberry text-white px-2 py-0.5 border-2 border-neo-ink text-xs font-black transform rotate-3">NOTE</span>
                                            {props.children}
                                        </blockquote>
                                    ),

                                    // Code
                                    code: ({ node, inline, className, children, ...props }: any) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const codeContent = String(children).replace(/\n$/, '');

                                        if (!inline && match) {
                                            return (
                                                <div className="my-6 border-4 border-neo-ink shadow-neo-sm bg-neo-ink text-neo-yellow p-4 rounded-none relative overflow-visible group">
                                                    <div className="absolute -top-3 right-4 flex gap-2">
                                                        <div className="bg-neo-raspberry text-white border-2 border-neo-ink px-2 py-0.5 text-xs font-black uppercase">
                                                            {match[1]}
                                                        </div>
                                                    </div>

                                                    {/* Copy Button */}
                                                    <CopyButton text={codeContent} />

                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                </div>
                                            );
                                        }

                                        return (
                                            <code className="bg-neo-bg border-2 border-neo-ink px-1.5 py-0.5 font-mono font-bold text-sm text-neo-raspberry" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },

                                    // Table
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto mb-8 border-4 border-neo-ink shadow-neo-sm">
                                            <table className="w-full text-left" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="bg-neo-ink text-neo-yellow font-black uppercase border-b-4 border-neo-ink" {...props} />,
                                    th: ({ node, ...props }) => <th className="p-4 border-r-2 border-neo-yellow last:border-r-0" {...props} />,
                                    td: ({ node, ...props }) => <td className="p-4 font-bold border-b-2 border-neo-ink last:border-b-0 border-r-2 last:border-r-0 bg-white" {...props} />,

                                    // Links
                                    a: ({ node, ...props }) => (
                                        <a
                                            className="font-black text-neo-ink border-b-4 border-neo-raspberry hover:bg-neo-raspberry hover:text-white transition-colors decoration-0"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),

                                    // HR
                                    hr: ({ node, ...props }) => <hr className="border-t-4 border-neo-ink my-8 border-dashed" {...props} />,
                                }}
                            >
                                {HELP_CONTENT}
                            </ReactMarkdown>

                            {/* Manual Footer */}
                            <div className="text-center mt-12 pb-4">
                                <p className="text-lg text-neo-ink">
                                    <strong className="font-black">Wp Design</strong> - 让公众号排版更简单
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t-4 border-neo-ink p-12 bg-neo-ink text-neo-yellow text-center font-mono text-sm font-bold relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-neo-raspberry"></div>
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-2xl font-black uppercase tracking-tighter">LIMIANTIAO LAB INC.</div>
                        <div className="flex gap-4 opacity-70">
                            <span>© 2025 ALL RIGHTS RESERVED</span>
                            <span>•</span>
                            <span>DESIGNED FROM LIMIANTIAO</span>
                        </div>
                    </div>
                </footer>
            </div>
        </NeoGridBackground>
    );
};
