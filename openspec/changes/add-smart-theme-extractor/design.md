# Design: Smart Theme Extractor

## Context

用户希望从现有的精美 HTML 页面中提取样式，自动生成符合系统标准的主题 JSON 文件。这需要结合 AI 理解能力和确定性脚本解析，形成双层架构。

**利益相关者**: 内容创作者、前端开发者

## Goals / Non-Goals

### Goals
- 允许用户上传任意 HTML 文件
- 自动识别并提取视觉样式特征
- 生成与 `ITheme` 接口兼容的 JSON 主题
- 处理伪元素样式映射到实体标签

### Non-Goals
- 不支持外部 CSS 链接（需内联到 `<style>` 标签）
- 不解析 JavaScript 动态生成的样式
- 不提供实时编辑主题功能（仅提取）

## Decisions

### Decision 1: AI + 脚本双层架构
- **What**: AI 负责理解用户意图和样式映射，脚本负责确定性提取
- **Why**: AI 处理模糊性（如伪元素映射），脚本保证稳定性和一致性
- **Alternatives**: 
  - 纯规则解析：无法处理多样化的 HTML 结构
  - 纯 AI 输出 JSON：输出格式不稳定，难以保证字段完整

### Decision 2: 标准骨架 HTML 作为映射目标
- **What**: 定义固定结构的骨架 HTML，AI 将用户样式映射到骨架的固定 ID 上
- **Why**: 确保脚本解析的确定性，ID 白名单防止注入

### Decision 3: Kimi K2 作为 AI 模型
- **What**: 使用 Moonshot 的 Kimi K2 模型进行样式翻译
- **Why**: 对代码理解和 CSS 逻辑最强，支持中文
- **API**: https://platform.moonshot.cn/docs/guide/kimi-k2-quickstart

---

## AI Prompt Configuration

### System Prompt

```markdown
You are an expert Frontend Engineer and CSS Specialist. Your task is to perform "Style Extraction and Mapping".

## Your Task
You will receive a "Source HTML" file (user's custom design) and a "Target Skeleton HTML" (standard structure).
Your job is to extract visual styles from the Source and apply them as INLINE STYLES (style="...") to the Target Skeleton.

## Automatic Workflow
When the user uploads an HTML file without any instructions:
1. Treat the uploaded content as the "Source HTML"
2. Use the "Target Skeleton HTML" provided below
3. Extract and map styles according to the rules below
4. Output ONLY the styled Target Skeleton HTML

## Rules

### 1. Style Mapping
- Analyze the user's design for H1, H2, H3, H4, Paragraphs, Blockquotes, Lists (ul/ol), Tables, Code blocks, Links, etc.
- Find matching elements in the Target Skeleton by semantic meaning
- Extract visual properties: typography, colors, borders, shadows, spacing, backgrounds

### 2. Pseudo-elements Handling (Crucial)
- If the source uses `::before` or `::after` for decorative purposes (e.g., list bullets, blockquote icons, badges):
  - Translate these styles onto the marker span elements in the Target (e.g., `id="pattern-ul-marker"`, `id="pattern-h3-badge"`, `id="pattern-blockquote-badge"`)
  - NEVER use pseudo-elements in the output; use inline styles on real elements only

### 3. Structural Integrity
- DO NOT add, remove, or rename any ID in the Target Skeleton
- DO NOT output the Source HTML
- ONLY output the fully styled Target Skeleton HTML code
- Preserve all `id` attributes exactly as provided

### 4. Style Cleaning
- Convert all CSS classes into inline styles
- Ensure colors are in hex/rgb/rgba format
- Merge related styles (e.g., margin-top, margin-bottom → margin shorthand if appropriate)

### 5. Output Format
- Return ONLY valid HTML code
- No explanations, no markdown code fences
- The output should start with `<!DOCTYPE html>` and end with `</html>`

## Target Skeleton HTML

{{STANDARD_SKELETON_HTML_CONTENT}}
```

### User Prompt

用户只需上传 HTML 文件，无需输入任何文字。如果用户输入文字，可以是：
- 空白
- 直接粘贴 HTML 代码
- 任何简短说明（AI 会自动将其视为 Source HTML）

---

## Standard Skeleton HTML (标准骨架 HTML)

这是 "答题卡"。无论用户上传什么，AI 都必须把答案填到这张卡上。它严格对应 `WeChatRenderer.tsx` 中的组件结构。

> **注意：** 所有容器元素已从 `div` 更改为 `section`，以匹配微信公众号兼容性要求。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Standard Theme Skeleton</title>
</head>
<body>

    <section id="pattern-wrapper">
        
        <!-- H1 标题区域 -->
        <section id="pattern-h1-container">
            <h1 id="pattern-h1">Sample Title</h1>
            <p id="pattern-h1-subtitle">Subtitle Demo</p>
        </section>

        <!-- H2 二级标题 -->
        <section id="pattern-h2-container">
            <h2 id="pattern-h2">Section Level 2</h2>
        </section>

        <!-- H3 三级标题（带徽章） -->
        <section id="pattern-h3-container">
            <span id="pattern-h3-badge">H3</span>
            <h3 id="pattern-h3">Section Level 3</h3>
        </section>

        <!-- H4 四级标题 -->
        <h4 id="pattern-h4">Section Level 4</h4>

        <!-- H5 五级标题 -->
        <h5 id="pattern-h5">Section Level 5</h5>

        <!-- 段落文本 -->
        <p id="pattern-p">This is a standard paragraph text.</p>
        <p><strong id="pattern-strong">Bold Text</strong></p>
        <p><em id="pattern-em">Italic Text</em></p>
        <p><code id="pattern-code">inline code</code></p>
        <p><a id="pattern-link" href="#">Hyperlink Style</a></p>
        
        <!-- 引用块 -->
        <blockquote id="pattern-blockquote">
            <section id="pattern-blockquote-badge">NOTE</section>
            <section id="pattern-blockquote-content">
                Reference text content.
            </section>
        </blockquote>

        <!-- 无序列表 -->
        <ul id="pattern-ul">
            <li id="pattern-li-ul">
                <span id="pattern-ul-marker"></span>
                <span>List Item Text</span>
            </li>
        </ul>

        <!-- 有序列表 -->
        <ol id="pattern-ol">
            <li id="pattern-li-ol">
                <span id="pattern-ol-marker">1</span>
                <span>Ordered Item Text</span>
            </li>
        </ol>

        <!-- 代码块 -->
        <section id="pattern-pre">
            <section id="pattern-pre-header">
                <section id="pattern-pre-dot" style="background:#FF4757"></section>
                <section id="pattern-pre-dot" style="background:#FFD700"></section>
                <section id="pattern-pre-dot" style="background:#00E099"></section>
                <span id="pattern-pre-label">code.block</span>
            </section>
            <section id="pattern-pre-body">
                <code>console.log('Hello World');</code>
            </section>
        </section>

        <!-- 表格 -->

        <section id="pattern-table-container">
            <table id="pattern-table">
                <thead id="pattern-thead">
                    <tr>
                        <th id="pattern-th">Header</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td id="pattern-td">Cell Data</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- 分割线 -->
        <section id="pattern-hr-container">
            <span id="pattern-hr-text">•••••</span>
        </section>
        
        <!-- 页脚 -->
        <section id="pattern-footer">
            <section id="pattern-footer-icon">🎮</section>
            <p id="pattern-footer-text">Footer Text</p>
        </section>

    </section>

</body>

</html>
```

---

## ID Whitelist (ID 白名单)

脚本解析层仅提取以下 ID 的样式，忽略其他任何元素：

| ID | 对应 ITheme 字段 |
|----|------------------|
| `pattern-wrapper` | `wrapper` |
| `pattern-h1-container` | `h1Container` |
| `pattern-h1` | `h1` |
| `pattern-h1-subtitle` | `h1Subtitle` |
| `pattern-h2-container` | `h2Container` |
| `pattern-h2` | `h2` |
| `pattern-h3-container` | `h3Container` |
| `pattern-h3-badge` | `h3Badge` |
| `pattern-h3` | `h3` |
| `pattern-h4` | `h4` |
| `pattern-h5` | `h5` |
| `pattern-p` | `p` |
| `pattern-strong` | `strong` |
| `pattern-em` | `em` |
| `pattern-code` | `code` |
| `pattern-link` | `a` |
| `pattern-blockquote` | `blockquote` |
| `pattern-blockquote-badge` | `blockquoteBadge` |
| `pattern-blockquote-content` | `blockquoteContent` |
| `pattern-ul` | `ul` |
| `pattern-ol` | `ol` |
| `pattern-li-ul` | `liUl` |
| `pattern-li-ol` | `liOl` |
| `pattern-ul-marker` | `ulMarker` |
| `pattern-ol-marker` | `olMarker` |
| `pattern-pre` | `pre` |
| `pattern-pre-header` | `preHeader` |
| `pattern-pre-dot` | `preDot` |
| `pattern-pre-label` | `preLabel` |
| `pattern-pre-body` | `preBody` |
| `pattern-table-container` | `tableContainer` |
| `pattern-table` | `table` |
| `pattern-thead` | `thead` |
| `pattern-th` | `th` |
| `pattern-td` | `td` |
| `pattern-hr-container` | `hrContainer` |
| `pattern-hr-text` | `hrText` |
| `pattern-footer` | `footer` |
| `pattern-footer-icon` | `footerIcon` |
| `pattern-footer-text` | `footerText` |

---

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| AI 输出不稳定 | 白名单机制 + 默认主题兜底 |
| Token 消耗过高 | 输入清洗移除无关内容 |
| 伪元素无法直接提取 | 骨架 HTML 中使用实体 marker 标签 |
| API 调用失败 | 提供手动上传主题 JSON 作为备选 |

## Migration Plan

1. 作为新功能添加，不影响现有主题系统
2. 用户可选择使用提取功能或继续手动上传主题
3. 生成的主题 JSON 与现有格式完全兼容

## Open Questions

- [ ] 是否需要保存用户生成的主题到云端？
- [ ] 是否需要主题市场/社区分享功能？
- [ ] API 调用成本如何处理？（限制次数/付费）
