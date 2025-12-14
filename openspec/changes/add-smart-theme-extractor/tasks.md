# Tasks: Smart Theme Extractor

## 1. Foundation Setup
- [x] 1.1 创建 `lib/` 目录结构
- [x] 1.2 安装依赖: `cheerio`, `style-to-object`, `camelcase-keys` *(Note: Using pure TS implementation instead)*
- [x] 1.3 创建 `themes/default-theme.json` 标准默认主题

## 2. HTML Input Sanitization
- [x] 2.1 创建 `lib/htmlSanitizer.ts`
- [x] 2.2 实现脚本标签移除
- [x] 2.3 实现 Base64 图片移除
- [x] 2.4 实现文本截断（保留结构）
- [x] 2.5 实现外部 CSS 链接检测与提示

## 3. AI Translation Layer
- [ ] 3.1 创建 API Route `/api/extract-theme` *(Requires backend setup with Kimi K2)*
- [ ] 3.2 实现 Kimi K2 API 集成 *(Requires MOONSHOT_API_KEY)*
- [x] 3.3 配置 System Prompt（标准骨架 HTML）
- [x] 3.4 处理 AI 响应解析

## 4. Script Parser Layer
- [x] 4.1 创建 `lib/styleParser.ts`
- [x] 4.2 实现 ID 白名单遍历
- [x] 4.3 实现 CSS 字符串到 React 样式对象转换
- [x] 4.4 实现伪元素样式映射到 marker 元素

## 5. Fallback & Output
- [x] 5.1 实现与默认主题的 Deep Merge
- [x] 5.2 生成最终 `style.json`
- [x] 5.3 提供主题下载功能

## 6. UI Integration
- [x] 6.1 创建 `components/ThemeExtractorUI.tsx`
- [x] 6.2 实现 HTML 文件上传界面
- [x] 6.3 实现提取进度展示
- [x] 6.4 实现预览与下载功能
- [x] 6.5 集成到 `App.tsx` 主流程

## 7. Testing & Validation
- [ ] 7.1 测试不同来源的 HTML 文件提取
- [ ] 7.2 验证生成的主题与 `WeChatRenderer` 兼容
- [ ] 7.3 测试错误处理和边界情况

---

## Notes

**Completed:** Frontend implementation is complete. The Theme Extractor UI is integrated into Step 1 of the app.

**Pending:** Backend API route `/api/extract-theme` needs to be implemented with Kimi K2 API integration. This requires:
1. Setting up Next.js API routes (or similar backend)
2. Configuring `MOONSHOT_API_KEY` environment variable
3. Implementing the API endpoint that calls Kimi K2 with the System Prompt

The frontend will show an informative error if the API is not available.
