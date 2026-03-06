## Context

现有系统已经具备成熟的前端预览与复制链路，但公众号草稿 API 需要的是 HTML 内容，而不是浏览器剪贴板里的富文本。新增能力的关键点不是“自动复制”，而是“服务端生成与前端一致的 HTML，再调用微信接口创建草稿”。

## Goals

- 复用现有经典像素主题渲染规则
- 新增一个后端 API，直接创建公众号草稿
- 自动处理正文图片上传和替换
- 保持现有前端复制工作流不受影响

## Non-Goals

- 不做多主题发布
- 不做前端正式发布 UI
- 不做自动登录公众号后台
- 不做多图文草稿

## Technical Decisions

### 1. 共享渲染层

将现有 `WeChatRenderer` 的 Markdown 元素映射逻辑下沉到 `lib/renderers/` 中：

- `createWeChatMarkdownComponents.js`：返回 `react-markdown` 组件映射
- `WeChatDocument.js`：组合 header / body / footer 文档结构
- `renderPixelMarkdownToHtml.js`：使用 `react-dom/server` 渲染静态 HTML，并提取正文图片来源

前端 `components/WeChatRenderer.tsx` 改为轻包装器，继续复用共享文档组件。

### 2. 服务端发布链路

在 `server/lib/` 中新增四层：

- `multipart.js`：解析 `multipart/form-data`
- `imageUtils.js`：下载远程图、解析 data URL、替换 HTML 中图片地址
- `wechatClient.js`：处理 `access_token`、封面上传、正文图片上传、草稿创建
- `draftPublisher.js`：编排整条发布流程

### 3. 错误边界

公共接口统一返回：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

已定义的关键错误码：

- `INVALID_INPUT`
- `MISSING_COVER_IMAGE`
- `WECHAT_AUTH_FAILED`
- `WECHAT_TOKEN_FETCH_FAILED`
- `WECHAT_COVER_UPLOAD_FAILED`
- `WECHAT_CONTENT_IMAGE_UPLOAD_FAILED`
- `WECHAT_DRAFT_CREATE_FAILED`
- `IMAGE_FETCH_FAILED`
- `RENDER_FAILED`
- `UNSUPPORTED_IMAGE_SOURCE`

## Data Flow

1. 服务端接收 `multipart/form-data`
2. 校验必填字段并标准化输入
3. 将 Markdown 渲染为经典像素 HTML
4. 扫描渲染结果中的正文图片
5. 逐张上传正文图片到微信并替换 HTML 中的 `src`
6. 上传封面图，获取 `thumb_media_id`
7. 调用草稿创建接口
8. 返回 `media_id` 与渲染统计信息

## Operational Notes

- 需要配置 `WECHAT_OFFICIAL_APP_ID` 与 `WECHAT_OFFICIAL_APP_SECRET`
- Token 采用进程内缓存，不做持久化
- 正文图片任一上传失败，则整个请求失败，不创建草稿
