这是一份非常完整、可以直接交付给开发团队的技术需求文档（PRD）。我们将整个“样式提取引擎”重构为 **AI + 规则脚本** 的双层架构。

以下是整理好的需求说明书：

-----

# 📝 需求文档：智能 HTML 样式提取引擎 (Smart Theme Extractor)

## 一、 项目目标

构建一个自动化工具，允许用户上传任意格式的 HTML 页面（无需遵循特定模板），系统通过 AI 识别并提取其中的样式特征，最终生成符合系统标准的 JSON 主题配置文件（`style.json`），用于 Markdown 到公众号富文本的渲染。

## 二、 核心架构流程 (The Pipeline)

整个处理过程分为 4 个流水线步骤：

1.  **输入清洗 (Input Sanitization):**

      * 接收用户上传的 HTML 文件。
      * 脚本预处理：移除脚本标签 (`<script>`)、Base64 图片数据、过长的正文文本（保留结构，减少 Token 消耗）。
      * 如果用户使用了外部 CSS 链接，提示不支持，要求包含在 `<style>` 标签内。

2.  **AI 翻译层 (The AI Translator):**

      * **核心逻辑：** 调用大模型 API (kimi2-thinking)。接入方式参考：https://platform.moonshot.cn/docs/guide/kimi-k2-quickstart#kimi-k2-%E6%A6%82%E8%A7%88
      * **输入：** 用户清洗后的 HTML (Source) + **标准骨架 HTML (Target)**。
      * **任务：** AI 分析 Source 的视觉风格，将其映射并通过 **内联样式 (Inline Style)** 的方式，填入 Target 的对应节点中。
      * **输出：** 带有完整内联样式的标准 HTML 字符串。

3.  **脚本解析层 (The Script Parser):**

      * **核心逻辑：** 确定性脚本（Node.js）。
      * **任务：** 加载 AI 输出的 HTML，根据 **ID 白名单** 遍历节点，提取 `style` 属性。
      * **转换：** 将 CSS 字符串（`kebab-case`）转换为 React 样式对象（`camelCase`）。

4.  **兜底与输出 (Fallback & Output):**

      * **合并：** 将提取的 JSON 与系统的 `Default_Theme.json` 进行合并（Deep Merge）。如果没有需要创建一个 default 的theme，采用标准的 blog 文章 theme
      * **输出：** 最终生成 `custom_style.json` 并入库。

-----

## 三、 技术规格 (Tech Specs)

### 1\. 开发栈建议

  * **AI Model:** kimi2-thinking (对代码理解和 CSS 逻辑最强)。
  * **HTML Parser:** `cheerio` (Node.js 后端) 或 `DOMParser` (纯前端)。
  * **CSS Utils:** `style-to-object` (将 "color:red" 转为对象), `camelcase` (命名转换)。

### 2\. 关键“坑”与解决方案：伪元素 (Pseudo-elements)

  * **问题：** 用户 Demo 中常用的 `li::before` (列表点) 或 `blockquote::after` (装饰图标) 无法被直接提取为内联样式，因为伪元素不在 DOM 树中。
  * **解决方案：**
      * 在 **标准骨架 HTML** 中，我们要显式地放置实体标签（如 `<span id="pattern-ul-marker"></span>`）。
      * 在 **AI Prompt** 中，明确指令：“如果源文件中使用了伪元素（如 `::before`）来实现装饰，请将这些样式应用到目标 HTML 中对应的 `marker` 实体标签上。”

### 3\. 安全机制

  * **白名单机制 (Whitelist):**
      * 解析脚本只查找标准骨架中定义的 ID（如 `pattern-h1`）。
      * AI 返回的 HTML 中如果包含用户原来多余的 `div` 或 `ad-banner`，脚本层直接忽略，不予提取。
  * **兜底机制 (Fallback):**
      * 如果 AI 未能提取到 `h2` 的样式（可能用户没写），脚本解析出的 `h2` 样式为空。
      * 在最终生成 JSON 前，执行 `Object.assign({}, defaultTheme, extractedTheme)`，确保前端渲染不会报错。

-----

## 四、 AI 翻译层配置 (Prompt Design)

这是连接用户创意和标准骨架的桥梁。用户只需上传 HTML 文件，无需提供任何额外指令。

**System Prompt (完整版):**

````markdown
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

```html
{{STANDARD_SKELETON_HTML_CONTENT}}
```
````

**User Prompt (简化版):**

用户只需上传 HTML 文件，无需输入任何文字。如果用户输入文字，可以是：
- 空白
- 直接粘贴 HTML 代码
- 任何简短说明（AI 会自动将其视为 Source HTML）

---

## 五、 标准骨架 HTML (The Standard Skeleton)

这是你的"答题卡"。无论用户上传什么，AI 都必须把答案填到这张卡上。它严格对应 `WeChatRenderer.tsx` 中的组件结构。

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
````

## 六、 产品经理的最后确认

这个架构现在非常清晰：

1.  **用户** 只需要上传他们认为好看的 HTML（不用管代码规范）。
2.  **AI** 充当翻译，负责理解用户的意图，并把样式“硬塞”进我们准备好的 `标准骨架 HTML` 中（特别是处理伪元素转实体标签）。
3.  **脚本** 负责做一个无情的提取机器，只认 `标准骨架` 里的 ID，生成 JSON。
4.  **React** 负责拿到 JSON 渲染页面。

这套方案兼顾了**灵活性**（AI 处理）和**稳定性**（标准骨架 + 脚本兜底），是实现你需求的最优解。