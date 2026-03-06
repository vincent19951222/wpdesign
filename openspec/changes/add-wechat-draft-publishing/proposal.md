# Change: 发布到公众号草稿箱 (WeChat Draft Publishing)

## Why

当前产品的最终交付停留在“复制带格式内容到剪贴板”，用户仍需手动进入微信公众号后台粘贴并保存草稿。对于高频写作场景，这一步重复、易错且难以自动化。项目需要新增一个直接面向业务结果的能力：将 Markdown 内容按固定经典像素主题渲染后，直接创建公众号草稿。

## What Changes

### 核心能力
- **固定主题渲染**：新增服务端 Markdown -> 经典像素 HTML 渲染能力，保持现有 `WeChatRenderer` 结构与内联样式规则
- **正文图片处理**：自动识别 Markdown 中的远程图和 Base64 图片，上传到微信并替换为微信侧图片地址
- **封面上传**：要求调用方提供封面图，服务端上传并绑定为 `thumb_media_id`
- **草稿创建**：调用公众号草稿接口创建单篇草稿，返回草稿标识

### 新增接口
- `POST /api/wechat/draft`
  - Content-Type: `multipart/form-data`
  - 必填字段：`markdown`、`title`、`author`、`digest`、`coverImage`
  - 可选字段：`contentSourceUrl`、`showCoverPic`

### 架构调整
- 抽取共享渲染层，使前端预览和服务端静态渲染共用同一套 Markdown 元素映射规则
- 新增服务端微信 API 客户端、图片处理、Multipart 解析与草稿发布编排层

## Impact

- **Affected specs**: `wechat-draft-publishing` (新增)
- **Affected code**:
  - `components/WeChatRenderer.tsx`
  - `lib/renderers/`
  - `server/index.js`
  - `server/lib/`
- **Breaking**: 无
- **Dependencies**:
  - 使用现有 `react` / `react-dom` / `react-markdown`
  - 不新增第三方 Multipart 解析依赖，使用内置实现
