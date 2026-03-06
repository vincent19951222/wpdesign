# Tasks: WeChat Draft Publishing

## 1. Spec And Interface Lock
- [x] 1.1 新增 `add-wechat-draft-publishing` proposal
- [x] 1.2 新增 design 说明
- [x] 1.3 新增 `wechat-draft-publishing` spec

## 2. Shared Rendering Refactor
- [x] 2.1 抽取共享 Markdown 组件映射到 `lib/renderers/createWeChatMarkdownComponents.js`
- [x] 2.2 抽取共享文档结构到 `lib/renderers/WeChatDocument.js`
- [x] 2.3 新增服务端静态渲染入口 `lib/renderers/renderPixelMarkdownToHtml.js`
- [x] 2.4 调整 `components/WeChatRenderer.tsx` 复用共享渲染层

## 3. Backend Publishing Flow
- [x] 3.1 新增 Multipart 解析器
- [x] 3.2 新增微信客户端（token、封面、正文图、草稿）
- [x] 3.3 新增图片抓取与 HTML 替换工具
- [x] 3.4 新增草稿发布编排层
- [x] 3.5 在 `server/index.js` 挂载 `POST /api/wechat/draft`

## 4. Validation
- [x] 4.1 本地构建验证前端共享渲染层未回归
- [x] 4.2 本地语法检查服务端新增模块
- [ ] 4.3 使用真实公众号凭证联调草稿创建
- [ ] 4.4 校验正文图片与封面图在草稿中的表现

## Notes

- 第一阶段固定使用经典像素主题
- 第一阶段只创建单图文草稿
- 前端正式发布 UI 不在本次变更范围内
