import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const HELP_CONTENT = `# 排版实验室帮助文档

> 🎨 一款将 Markdown 内容转换为精美微信公众号排版的在线工具

---

## 📖 产品介绍

**排版实验室** 是一个基于 Web 的 Markdown 排版工具，专为微信公众号创作者设计。它能将标准 Markdown 内容渲染为带有精美样式的 HTML，并兼容微信编辑器的复制与草稿同步链路。

### 核心功能

| 功能 | 说明 |
| :-- | :-- |
| **Markdown 实时预览** | 所见即所得的编辑体验 |
| **多主题切换** | 提供多种预设主题风格 |
| **AI 主题提取** | 智能克隆任意网页设计风格 |
| **一键复制** | 直接粘贴到微信公众号 |
| **草稿同步** | 适合 API-safe 主题的草稿箱发布链路 |

---

## 🚀 快速开始

### 使用流程

\`\`\`
步骤 1：选择主题    →    步骤 2：编辑内容    →    步骤 3：预览/复制/同步
\`\`\`

#### 1️⃣ 选择主题

在首页主题库中浏览预设主题，点击卡片即可进入编辑器。

预设主题包括：

- **经典像素** - 复古赛博朋克风格
- **像素原野** - 更轻盈清新的像素路线
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

点击 **预览** 按钮查看最终效果，确认满意后可选择：

- **复制 HTML**：直接粘贴到微信公众号编辑器
- **同步草稿**：适用于 API-safe 主题

---

## ✨ 主题系统

### 预设主题

系统提供多款预设主题，覆盖不同内容气质：

| 主题名称 | 适用场景 |
| :-- | :-- |
| 经典像素 | 科技、游戏、创意内容 |
| 像素原野 | 日常更新、轻量像素表达 |
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

**AI 主题提取器** 可以分析任意网页的样式，并自动生成可复用的主题 JSON 文件。

### 使用方法

1. **准备 HTML 文件**  
   将喜欢的网页另存为 HTML 文件。

2. **上传文件**  
   进入后台工具后使用 **AI 主题提取** 功能上传文件。

3. **等待处理**  
   系统将自动执行以下步骤：
   - 清理和规范化 HTML
   - 调用 AI 分析样式
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

**A:** 请确保使用 **复制 HTML** 按钮进行复制，不要直接选中文字复制。系统会自动处理内联样式以确保微信兼容性。

### Q: 如何创建自定义主题？

**A:** 你可以通过以下方式获得自定义主题：
1. 使用 **AI 主题提取器** 从现有网页生成
2. 下载现有主题 JSON 并手动修改
3. 参考主题 JSON 结构从头创建

### Q: 支持哪些 Markdown 格式？

**A:** 支持 GitHub Flavored Markdown (GFM) 的大部分语法，包括表格、代码块、任务列表等。

### Q: 图片如何处理？

**A:** 当前版本支持在编辑器中直接粘贴图片，系统会自动转换为 Base64 Markdown 片段插入当前光标位置。

---

## 💡 最佳实践

1. **先选主题，再写内容** - 不同主题的视觉效果差异较大，建议先确定风格
2. **善用引用块** - 引用块适合突出重要信息或补充说明
3. **控制标题层级** - 建议使用不超过 3 级标题，保持文章结构清晰
4. **表格要简洁** - 微信对复杂表格支持有限，保持表格简单
5. **预览后再复制** - 养成预览习惯，确保效果符合预期

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
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-[#0f172a] text-slate-200 transition hover:border-slate-400 hover:bg-[#172033] z-10"
            title="Copy code"
        >
            {copied ? (
                <Check size={16} className="stroke-[3px] text-emerald-400" />
            ) : (
                <Copy size={16} className="stroke-[3px]" />
            )}
        </button>
    );
};

interface HelpProps {
    onBack: () => void;
}

export const Help: React.FC<HelpProps> = ({ onBack }) => {
    return (
        <div className="lab-shell font-home-sans">
            <div className="flex min-h-screen flex-col">
                <nav className="lab-header sticky top-0 z-50">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 md:px-8">
                        <div className="flex items-center gap-3">
                            <div className="homepage-coin font-en-display text-[10px] leading-none">P</div>
                            <div>
                                <div lang="en" className="font-en-display text-sm text-white md:text-base">Pixel Lab</div>
                                <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">帮助文档</div>
                            </div>
                        </div>
                        <Button size="sm" className="homepage-ghost-btn px-4 py-3 text-sm font-medium" onClick={onBack}>
                            <ChevronLeft size={16} className="mr-2" /> 返回首页
                        </Button>
                    </div>
                </nav>

                <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 md:px-8 md:py-12">
                    <div className="lab-panel w-full p-6 md:p-10">
                        <div className="mb-8 flex flex-col gap-4 border-b border-[#243042] pb-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <div className="homepage-section-kicker text-[10px] md:text-xs">Documentation</div>
                                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                                    排版实验室使用说明
                                </h1>
                                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                                    这份文档聚焦产品本身：如何选主题、怎么写 Markdown、什么时候使用 API-safe，以及怎样把内容送进公众号链路。
                                </p>
                            </div>
                            <div className="lab-chip px-4 py-2 text-sm font-medium">DOCS v2</div>
                        </div>

                        <div className="lab-prose font-home-sans">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="mb-8 mt-12 border-b border-[#243042] pb-4 text-4xl font-semibold tracking-tight first:mt-0 md:text-5xl" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="mt-12 mb-6 text-2xl font-semibold tracking-tight text-white md:text-3xl" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="mt-8 mb-4 flex items-center gap-3 text-xl font-semibold text-white md:text-2xl before:block before:h-3 before:w-3 before:rounded-full before:bg-cyan-400 before:content-['']" {...props} />,
                                    h4: ({ node, ...props }) => <h4 className="mt-6 mb-3 border-l-2 border-cyan-400 pl-3 text-lg font-semibold text-white md:text-xl" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-6 text-base leading-8 text-slate-300 md:text-lg" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                                    em: ({ node, ...props }) => <em className="not-italic font-medium text-cyan-300" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="mb-6 space-y-2 list-none" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="mb-6 space-y-2 list-decimal list-inside text-base leading-8 text-slate-300" {...props} />,
                                    li: ({ node, ...props }) => (
                                        <li className="flex items-start gap-3 text-base leading-8 text-slate-300 md:text-lg">
                                            <span className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />
                                            <span>{props.children}</span>
                                        </li>
                                    ),
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote className="relative my-8 rounded-2xl border border-[#334155] bg-[#0d1422] p-6">
                                            <span className="absolute -top-3 right-4 rounded-full border border-[#334155] bg-[#0f172a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">NOTE</span>
                                            {props.children}
                                        </blockquote>
                                    ),
                                    code: ({ node, inline, className, children, ...props }: any) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const codeContent = String(children).replace(/\n$/, '');

                                        if (!inline && match) {
                                            return (
                                                <div className="relative my-6 overflow-visible rounded-2xl border border-[#334155] bg-[#020617] p-5 text-slate-200">
                                                    <div className="absolute -top-3 right-4 flex gap-2">
                                                        <div className="rounded-full border border-[#334155] bg-[#0f172a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                                                            {match[1]}
                                                        </div>
                                                    </div>
                                                    <CopyButton text={codeContent} />
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                </div>
                                            );
                                        }

                                        return (
                                            <code className="rounded-md border border-[#334155] bg-[#0f172a] px-2 py-1 text-sm text-cyan-300" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    table: ({ node, ...props }) => (
                                        <div className="mb-8 overflow-x-auto rounded-2xl border border-[#334155]">
                                            <table className="w-full text-left" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="border-b border-[#334155] bg-[#0f172a] text-slate-100" {...props} />,
                                    th: ({ node, ...props }) => <th className="border-r border-[#334155] p-4 text-sm font-semibold uppercase tracking-[0.22em] last:border-r-0" {...props} />,
                                    td: ({ node, ...props }) => <td className="border-r border-t border-[#243042] bg-[#101624] p-4 text-base text-slate-300 last:border-r-0" {...props} />,
                                    a: ({ node, ...props }) => (
                                        <a
                                            className="font-medium text-cyan-300 underline decoration-cyan-500/60 underline-offset-4 transition hover:text-white"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),
                                    hr: ({ node, ...props }) => <hr className="my-8 border-t border-dashed border-[#334155]" {...props} />,
                                }}
                            >
                                {HELP_CONTENT}
                            </ReactMarkdown>

                            <div className="mt-12 border-t border-[#243042] pt-6 text-center">
                                <p className="text-base text-slate-400 md:text-lg">
                                    <strong className="font-semibold text-white">排版实验室</strong> · Markdown → 主题 → 预览 → 复制 / 草稿同步
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-[#243042] px-4 py-8 text-center text-sm text-slate-500 md:px-8">
                    <div className="mx-auto max-w-6xl">
                        排版实验室帮助中心 · 面向微信公众号排版与发布流程
                    </div>
                </footer>
            </div>
        </div>
    );
};
