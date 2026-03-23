import React from 'react';
import {
    BookOpen,
    Check,
    ChevronLeft,
    Copy,
    FileText,
    Send,
    Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const HELP_CONTENT = `# 排版实验室帮助文档

> 🎨 一款将 Markdown 内容转换为精美微信公众号排版的在线工具

---

## 📖 产品介绍

**排版实验室** 是一个基于 Web 的 Markdown 排版工具，支持微信公众号长文排版，也支持小红书卡片模式。它能将标准 Markdown 内容渲染为适合不同发布场景的结果，并兼容微信编辑器的复制与草稿同步链路。

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

## 🧭 模式说明

### 文章模式预览

文章模式继续沿用当前微信公众号发布流程。你可以校对长文渲染结果、复制 HTML，或者在 API-safe 主题下同步公众号草稿。

### 卡片模式预览

卡片模式只渲染小红书卡片图片。封面由 H1 生成，每个 H2 section 都会生成一张独立图片页。

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
            type="button"
            onClick={handleCopy}
            className="docs-flow-copy-btn"
            title="Copy code"
        >
            {copied ? (
                <Check size={16} className="stroke-[3px]" />
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
        <div className="landing-flow-shell studio-flow-shell landing-flow-font">
            <nav className="landing-flow-nav">
                <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-4 px-4 py-5 md:px-8">
                    <div className="flex items-center gap-4">
                        <div className="landing-flow-admin-trigger text-[1.2rem]" aria-hidden="true">
                            P
                        </div>
                        <div>
                            <div className="landing-flow-brand-name text-[1.9rem] md:text-[2.2rem]">Pixel Lab</div>
                            <div className="landing-flow-brand-subtitle">Documentation Studio</div>
                        </div>
                    </div>

                    <button type="button" className="landing-flow-secondary-btn" onClick={onBack}>
                        <ChevronLeft size={18} />
                        返回首页
                    </button>
                </div>
            </nav>

            <main className="mx-auto w-full max-w-[1520px] px-4 py-6 md:px-8 md:py-8">
                <div className="studio-flow-page-head">
                    <div className="studio-flow-page-intro">
                        <div className="studio-flow-icon-btn" aria-hidden="true">
                            <BookOpen strokeWidth={3} />
                        </div>
                        <div>
                            <div className="studio-flow-kicker">Documentation hub</div>
                            <h1 className="studio-flow-title">查看文档</h1>
                            <p className="studio-flow-copy">
                                这份说明页现在也和首页、编辑台、预览页统一到同一套 bright studio 风格。
                                重点还是产品本身：怎么选主题、怎么写 Markdown、什么时候用 API-safe，以及怎样送进公众号链路。
                            </p>
                            <div className="studio-flow-chip-row">
                                <span className="studio-flow-chip">Markdown workflow</span>
                                <span className="studio-flow-chip">Theme system</span>
                                <span className="studio-flow-chip">Publish notes</span>
                            </div>
                        </div>
                    </div>

                    <div className="studio-flow-action-row">
                        <span className="studio-flow-chip">DOCS v3</span>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <article className="studio-flow-panel docs-flow-article">
                        <div className="docs-flow-prose">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="docs-flow-h1" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="docs-flow-h2" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="docs-flow-h3" {...props} />,
                                    h4: ({ node, ...props }) => <h4 className="docs-flow-h4" {...props} />,
                                    p: ({ node, ...props }) => <p className="docs-flow-p" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="docs-flow-strong" {...props} />,
                                    em: ({ node, ...props }) => <em className="docs-flow-em" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="docs-flow-list docs-flow-list--unordered" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="docs-flow-list docs-flow-list--ordered" {...props} />,
                                    li: ({ node, ...props }) => <li className="docs-flow-list-item" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="docs-flow-blockquote" {...props} />,
                                    code: ({ node, inline, className, children, ...props }: any) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const codeContent = String(children).replace(/\n$/, '');

                                        if (!inline && match) {
                                            return (
                                                <div className="docs-flow-code-block">
                                                    <div className="docs-flow-code-head">
                                                        <span className="docs-flow-code-lang">{match[1]}</span>
                                                    </div>
                                                    <CopyButton text={codeContent} />
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                </div>
                                            );
                                        }

                                        return (
                                            <code className="docs-flow-inline-code" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    table: ({ node, ...props }) => (
                                        <div className="docs-flow-table-wrap">
                                            <table className="docs-flow-table" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="docs-flow-thead" {...props} />,
                                    th: ({ node, ...props }) => <th className="docs-flow-th" {...props} />,
                                    td: ({ node, ...props }) => <td className="docs-flow-td" {...props} />,
                                    a: ({ node, ...props }) => (
                                        <a
                                            className="docs-flow-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),
                                    hr: ({ node, ...props }) => <hr className="docs-flow-divider" {...props} />,
                                }}
                            >
                                {HELP_CONTENT}
                            </ReactMarkdown>

                            <div className="docs-flow-outro">
                                <p className="docs-flow-p !mb-0 !text-center">
                                    <strong className="docs-flow-strong">排版实验室</strong> · Markdown → 主题 → 预览 → 复制 / 草稿同步
                                </p>
                            </div>
                        </div>
                    </article>

                    <aside className="grid gap-6 self-start xl:sticky xl:top-28">
                        <section className="studio-flow-panel">
                            <div className="studio-flow-kicker">Quick route</div>
                            <div className="mt-4 space-y-4">
                                <div className="studio-flow-note-card">
                                    <div className="studio-flow-note-icon">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <div className="studio-flow-note-title">1. 先选主题</div>
                                        <div className="studio-flow-note-copy">在首页挑一个合适的视觉方向，再开始写内容。</div>
                                    </div>
                                </div>
                                <div className="studio-flow-note-card">
                                    <div className="studio-flow-note-icon studio-flow-note-icon--yellow">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <div className="studio-flow-note-title">2. 再写 Markdown</div>
                                        <div className="studio-flow-note-copy">正文源文件独立，主题只负责最后的呈现风格。</div>
                                    </div>
                                </div>
                                <div className="studio-flow-note-card">
                                    <div className="studio-flow-note-icon studio-flow-note-icon--green">
                                        <Send size={18} />
                                    </div>
                                    <div>
                                        <div className="studio-flow-note-title">3. 最后预览与发布</div>
                                        <div className="studio-flow-note-copy">确认版式后复制 HTML，或使用 API-safe 草稿同步链路。</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="studio-flow-panel">
                            <div className="studio-flow-kicker">When to sync</div>
                            <div className="mt-4 studio-flow-panel-title">什么时候用草稿同步</div>
                            <div className="studio-flow-panel-note">
                                只有 API-safe 主题适合直接进公众号草稿箱。其他主题仍建议走复制 HTML 的方式，能更稳定地保留样式。
                            </div>
                            <div className="mt-4 grid gap-3">
                                <div className="studio-flow-check-item">经典像素 API：适合草稿同步</div>
                                <div className="studio-flow-check-item">其他主题：优先复制 HTML</div>
                            </div>
                        </section>
                    </aside>
                </div>
            </main>

            <footer className="border-t border-black/8 px-4 py-8 text-center text-sm text-black/45 md:px-8">
                <div className="mx-auto max-w-[1520px]">
                    排版实验室帮助中心 · 面向微信公众号排版与发布流程
                </div>
            </footer>
        </div>
    );
};
