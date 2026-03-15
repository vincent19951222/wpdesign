# Change: Add WeChat Draft Sync

## Why

当前系统只支持“预览 + 手动复制到公众号后台”的工作流。对于高频发布场景，这个流程仍然偏手工，且 API-safe 主题已经证明正文样式在真实公众号后台具备可控保真度，因此需要增加一个可直接创建微信公众号草稿的同步能力。

## What Changes

- 新增微信公众号草稿同步能力，v1 通过真实草稿 API 创建草稿
- 默认使用经典像素作为同步主题基线，并在同步链路中限制为该主题
- 前端新增“一键同步草稿”入口、同步状态反馈与错误提示
- 服务端复用现有 Express `server/`，新增微信 access token 获取、缓存与草稿创建代理接口
- 将 Markdown 渲染结果转换为适合草稿 API 的 HTML payload，并保留现有手动复制链路
- 为 API-safe/经典像素同步建立明确的主题约束与失败提示

## Capabilities

### New Capabilities
- `wechat-draft-sync`: 通过真实微信公众号草稿 API 创建草稿，覆盖标题与正文 HTML 的同步流程

### Modified Capabilities
- None

## Impact

- Affected code:
  - `server/` WeChat API proxy、access token 缓存与凭据处理
  - 前端发布/同步入口、状态反馈与主题约束
  - Markdown 渲染到草稿 API HTML payload 的转换链路
- Affected APIs:
  - 新增面向前端的草稿同步后端接口
  - 服务端调用微信公众号 `token` 与 `draft/add` 相关接口
- Dependencies:
  - WeChat Official Account app credentials
  - 服务端环境变量与安全凭据管理
- Breaking:
  - none
