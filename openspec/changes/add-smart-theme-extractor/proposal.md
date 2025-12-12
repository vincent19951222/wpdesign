# Change: 智能主题提取引擎 (Smart Theme Extractor)

## Why

当前系统仅支持手动配置主题 JSON 文件或上传预定义主题。用户需要一种自动化方式，从任意 HTML 页面提取样式特征，生成符合系统标准的 JSON 主题配置文件，用于 Markdown 到公众号富文本的渲染。

## What Changes

### 核心功能
- **输入清洗模块**: 接收用户上传的 HTML，移除脚本、Base64 图片、过长文本
- **AI 翻译层**: 调用 Kimi K2 API，将用户 HTML 样式映射到标准骨架 HTML
- **脚本解析层**: 确定性脚本解析 AI 输出，提取内联样式转换为 React 样式对象
- **兜底与输出**: 与默认主题合并，生成完整 `style.json`

### 新增文件
- `lib/themeExtractor.ts` - 主题提取核心逻辑
- `lib/htmlSanitizer.ts` - HTML 输入清洗
- `lib/styleParser.ts` - 样式解析器
- `components/ThemeExtractorUI.tsx` - 主题提取界面组件
- `themes/default-theme.json` - 标准默认主题

### 修改文件
- `App.tsx` - 集成主题提取入口
- `types/ITheme.ts` - 可能需要扩展接口

## Impact

- **Affected specs**: `theme-extraction` (新增)
- **Affected code**: 
  - 新增 `lib/` 目录用于核心逻辑
  - 新增 `components/ThemeExtractorUI.tsx`
  - 修改 `App.tsx` 添加提取入口
- **Breaking**: 无
- **Dependencies**: 
  - 需要 Kimi K2 API 密钥 (`MOONSHOT_API_KEY`)
  - 可能需要添加 `cheerio` 或 `style-to-object` 依赖
