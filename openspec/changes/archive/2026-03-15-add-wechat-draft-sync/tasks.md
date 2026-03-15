# Tasks: Add WeChat Draft Sync

## 1. Server WeChat Proxy

- [x] 1.1 在 `server/` 中新增微信公众号环境变量读取与启动时缺失检查
- [x] 1.2 实现 access token 获取与带过期缓冲的内存缓存
- [x] 1.3 实现 `POST /api/wechat/drafts` 路由，接收标题与正文 HTML
- [x] 1.4 在草稿创建请求中注入默认 `WECHAT_DEFAULT_THUMB_MEDIA_ID`
- [x] 1.5 将微信接口错误转换为前端可展示的统一错误响应

## 2. Frontend Draft Sync Flow

- [x] 2.1 在前端增加经典像素 API-safe 主题识别逻辑
- [x] 2.2 在 `Preview` 页面新增“一键同步草稿”入口与加载/成功/失败状态
- [x] 2.3 当当前主题不是经典像素 API-safe 时，禁用或隐藏同步入口并显示范围提示
- [x] 2.4 从 Markdown 中提取首个 H1 作为草稿标题，并在缺失时阻止同步
- [x] 2.5 克隆 `#wechat-output` 并移除首个标题模块后生成同步 HTML
- [x] 2.6 调用服务端草稿同步接口并展示返回结果

## 3. Draft-safe Rendering and UX

- [x] 3.1 确认经典像素 API-safe 主题作为 v1 唯一同步主题的默认说明文案
- [x] 3.2 确认同步正文与当前预览的一致性，不影响现有复制逻辑
- [x] 3.3 为同步失败状态提供继续手动复制的明确引导

## 4. Validation

- [x] 4.1 使用有效公众号凭据与默认封面素材 ID 完成一次真实草稿创建联调
- [x] 4.2 验证 Markdown 缺少 H1、服务端缺少凭据、微信接口失败等错误路径
- [x] 4.3 验证现有“预览 + 复制”流程未回归
