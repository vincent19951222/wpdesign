## ADDED Requirements

### Requirement: HTML Input Sanitization
系统 SHALL 对用户上传的 HTML 文件进行预处理清洗。

#### Scenario: 移除脚本标签
- **WHEN** 用户上传的 HTML 包含 `<script>` 标签
- **THEN** 系统移除所有脚本标签及其内容

#### Scenario: 移除 Base64 图片
- **WHEN** HTML 中包含 Base64 编码的图片数据
- **THEN** 系统将其替换为占位符或移除

#### Scenario: 截断过长文本
- **WHEN** HTML 正文文本超过设定阈值（如 5000 字符）
- **THEN** 系统保留结构但截断文本内容以减少 Token 消耗

#### Scenario: 检测外部 CSS 链接
- **WHEN** HTML 使用外部 CSS 链接（`<link rel="stylesheet">`）
- **THEN** 系统提示用户将样式内联到 `<style>` 标签中

---

### Requirement: AI Style Translation
系统 SHALL 调用 AI API 将用户 HTML 样式映射到标准骨架 HTML。

#### Scenario: 成功提取样式
- **WHEN** 用户上传清洗后的 HTML
- **THEN** AI 返回带有完整内联样式的标准骨架 HTML

#### Scenario: 伪元素样式处理
- **WHEN** 用户 HTML 使用 `::before` 或 `::after` 实现装饰效果
- **THEN** AI 将这些样式映射到骨架中的 marker 实体元素（如 `id="pattern-ul-marker"`）

#### Scenario: API 调用失败
- **WHEN** AI API 返回错误或超时
- **THEN** 系统显示友好错误提示并建议用户重试或手动上传主题

---

### Requirement: Style Script Parsing
系统 SHALL 使用确定性脚本解析 AI 输出的 HTML 并提取样式。

#### Scenario: ID 白名单提取
- **WHEN** 解析 AI 输出的 HTML
- **THEN** 系统仅提取标准骨架中定义的 ID 元素的样式

#### Scenario: CSS 到 React 样式转换
- **WHEN** 提取到 CSS 样式字符串（如 `background-color: red`）
- **THEN** 系统转换为 React 样式对象（如 `{ backgroundColor: 'red' }`）

#### Scenario: 忽略未知元素
- **WHEN** AI 输出包含非白名单的元素或 ID
- **THEN** 系统忽略这些元素，不予提取

---

### Requirement: Theme Fallback and Output
系统 SHALL 将提取的样式与默认主题合并并输出完整 JSON。

#### Scenario: 深度合并
- **WHEN** 提取的样式缺少某些字段（如 `h2` 样式为空）
- **THEN** 系统使用默认主题的对应值进行补充

#### Scenario: 输出 JSON 文件
- **WHEN** 主题提取完成
- **THEN** 系统生成 `style.json` 并提供下载

#### Scenario: 预览生成的主题
- **WHEN** 主题 JSON 生成后
- **THEN** 用户可以在 `WeChatRenderer` 中预览效果

---

### Requirement: Theme Extractor UI
系统 SHALL 提供用户友好的主题提取界面。

#### Scenario: 上传 HTML 文件
- **WHEN** 用户点击上传按钮
- **THEN** 系统接受 `.html` 或 `.htm` 文件

#### Scenario: 显示提取进度
- **WHEN** 主题提取进行中
- **THEN** 界面显示进度指示器和当前步骤

#### Scenario: 下载主题文件
- **WHEN** 提取完成
- **THEN** 用户可以点击下载按钮获取 `style.json`
