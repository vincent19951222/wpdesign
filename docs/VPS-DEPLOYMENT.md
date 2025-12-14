# 腾讯云 VPS 部署指南 - Smart Theme Extractor

本文档详细介绍如何将 wpdesign 项目（包含 Theme Extractor 功能）部署到腾讯云 VPS。

## 目录

1. [服务器准备](#1-服务器准备)
2. [安装 Node.js 环境](#2-安装-nodejs-环境)
3. [创建后端代理服务器](#3-创建后端代理服务器)
4. [部署代码到 VPS](#4-部署代码到-vps)
5. [配置 PM2 进程管理](#5-配置-pm2-进程管理)
6. [配置 Nginx 反向代理](#6-配置-nginx-反向代理)
7. [配置 HTTPS（可选）](#7-配置-https可选)
8. [常见问题排查](#8-常见问题排查)

---

## 1. 服务器准备

### 1.1 购买云服务器

腾讯云轻量应用服务器推荐配置：
- CPU: 2 核
- 内存: 4 GB
- 系统: Ubuntu 22.04 LTS

### 1.2 登录服务器

```bash
ssh root@你的服务器IP
```

### 1.3 创建部署用户（可选但推荐）

```bash
# 创建用户
adduser deploy

# 添加 sudo 权限
usermod -aG sudo deploy

# 切换到新用户
su - deploy
```

---

## 2. 安装 Node.js 环境

### 2.1 使用 nvm 安装 Node.js

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重新加载 shell
source ~/.bashrc

# 安装 Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# 验证安装
node -v  # 应该显示 v20.x.x
npm -v
```

### 2.2 安装 PM2

```bash
npm install -g pm2
```

---

## 3. 创建后端代理服务器

在本地项目中创建后端代理服务器代码。

### 3.1 创建 server 目录

```bash
mkdir -p server
```

### 3.2 创建 `server/index.js`

```javascript
/**
 * Backend Proxy Server for Kimi K2 API
 * 
 * This server runs alongside the static frontend and proxies
 * API requests to Moonshot, adding the API key securely.
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Load API key from environment variable
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY;

if (!MOONSHOT_API_KEY) {
  console.error('❌ ERROR: MOONSHOT_API_KEY environment variable is not set');
  console.error('   Please set it in your environment or .env file');
  process.exit(1);
}

// Proxy middleware for Kimi K2 API
app.use('/api/moonshot', createProxyMiddleware({
  target: 'https://api.moonshot.cn',
  changeOrigin: true,
  pathRewrite: {
    '^/api/moonshot': '', // Remove /api/moonshot prefix
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add Authorization header
    proxyReq.setHeader('Authorization', `Bearer ${MOONSHOT_API_KEY}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  },
}));

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, '../dist')));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Serving static files from ./dist`);
  console.log(`🔗 API proxy: /api/moonshot -> https://api.moonshot.cn`);
});
```

### 3.3 创建 `server/package.json`

```json
{
  "name": "wpdesign-server",
  "version": "1.0.0",
  "description": "Backend proxy server for wpdesign",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "http-proxy-middleware": "^2.0.6"
  }
}
```

### 3.4 本地测试后端

```bash
cd server
npm install
MOONSHOT_API_KEY=sk-xxx npm start
```

---

## 4. 部署代码到 VPS

### 4.1 构建前端

在本地运行：

```bash
npm run build
```

这会生成 `dist/` 目录。

### 4.2 同步代码到服务器

**方法 A: 使用 rsync（推荐）**

```bash
rsync -avz --exclude 'node_modules' \
  ./ deploy@你的服务器IP:/home/deploy/wpdesign/
```

**方法 B: 使用 Git**

在服务器上：

```bash
cd /home/deploy
git clone https://github.com/你的用户名/wpdesign.git
cd wpdesign
npm install
npm run build
cd server
npm install
```

### 4.3 在服务器上配置环境变量

```bash
# 创建环境变量文件
echo "MOONSHOT_API_KEY=sk-你的真实key" > /home/deploy/wpdesign/.env

# 保护文件权限
chmod 600 /home/deploy/wpdesign/.env
```

---

## 5. 配置 PM2 进程管理

### 5.1 创建 PM2 配置文件

在项目根目录创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'wpdesign',
    script: 'server/index.js',
    cwd: '/home/deploy/wpdesign',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
    env_file: '.env',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: '/home/deploy/logs/wpdesign-error.log',
    out_file: '/home/deploy/logs/wpdesign-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
};
```

### 5.2 创建日志目录

```bash
mkdir -p /home/deploy/logs
```

### 5.3 启动应用

```bash
cd /home/deploy/wpdesign

# 加载环境变量并启动
export $(cat .env | xargs) && pm2 start ecosystem.config.js

# 保存进程列表（开机自启动）
pm2 save
pm2 startup
```

### 5.4 常用 PM2 命令

```bash
pm2 status          # 查看状态
pm2 logs wpdesign   # 查看日志
pm2 restart wpdesign # 重启
pm2 stop wpdesign   # 停止
pm2 delete wpdesign # 删除
```

---

## 6. 配置 Nginx 反向代理

### 6.1 安装 Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 6.2 创建 Nginx 配置

```bash
sudo nano /etc/nginx/sites-available/wpdesign
```

内容如下：

```nginx
server {
    listen 80;
    server_name 你的域名或IP;

    # 日志
    access_log /var/log/nginx/wpdesign-access.log;
    error_log /var/log/nginx/wpdesign-error.log;

    # 反向代理到 Node.js 服务器
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置（AI API 可能需要较长时间）
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 120s;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://127.0.0.1:3001;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 6.3 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/wpdesign /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 7. 配置 HTTPS（可选）

### 7.1 安装 Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 获取证书

```bash
sudo certbot --nginx -d 你的域名
```

按提示完成配置，Certbot 会自动修改 Nginx 配置。

### 7.3 自动续期

```bash
# 测试续期
sudo certbot renew --dry-run
```

Certbot 会自动添加定时任务进行续期。

---

## 8. 常见问题排查

### 8.1 页面无法访问

```bash
# 检查 PM2 进程状态
pm2 status

# 检查应用日志
pm2 logs wpdesign --lines 50

# 检查 Nginx 状态
sudo systemctl status nginx

# 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/wpdesign-error.log
```

### 8.2 API 调用失败

```bash
# 检查环境变量是否正确加载
pm2 env wpdesign

# 测试 API 连接
curl -X POST https://api.moonshot.cn/v1/models \
  -H "Authorization: Bearer $MOONSHOT_API_KEY" \
  -H "Content-Type: application/json"
```

### 8.3 更新部署

```bash
# 拉取最新代码
cd /home/deploy/wpdesign
git pull

# 重新构建前端
npm install
npm run build

# 更新后端依赖
cd server
npm install

# 重启服务
pm2 restart wpdesign
```

---

## 部署架构图

```
                    ┌─────────────┐
                    │   Client    │
                    │  (Browser)  │
                    └──────┬──────┘
                           │
                           ▼ :80 / :443
                    ┌─────────────┐
                    │    Nginx    │
                    │  (Reverse   │
                    │   Proxy)    │
                    └──────┬──────┘
                           │
                           ▼ :3001
                    ┌─────────────┐
                    │   Express   │
                    │   Server    │
                    ├─────────────┤
                    │ Static Files│ ← dist/
                    │ (index.html)│
                    ├─────────────┤
                    │ API Proxy   │ → api.moonshot.cn
                    │ (/api/...)  │   + API Key Header
                    └─────────────┘
```

---

## 快速部署脚本

为了简化后续部署，创建 `deploy.sh`：

```bash
#!/bin/bash
set -e

echo "📦 Building frontend..."
npm run build

echo "📤 Syncing to server..."
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ deploy@你的服务器IP:/home/deploy/wpdesign/

echo "🔄 Restarting server..."
ssh deploy@你的服务器IP "cd /home/deploy/wpdesign/server && npm install && pm2 restart wpdesign"

echo "✅ Deployment complete!"
```

使用方法：

```bash
chmod +x deploy.sh
./deploy.sh
```
