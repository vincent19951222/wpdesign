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

## 3. 准备后端代理服务器

为了解决静态部署中 API Key 暴露和文件保存失效的问题，项目中已经预置了 `server` 目录，包含了一个基于 Express 的轻量级后端服务。

该服务 (`server/index.js`) 实现了以下功能：
1.  **静态托管**：托管 `dist/` 目录下的前端构建产物。
2.  **API 代理**：转发 `/api/moonshot` 请求并安全注入 API Key。
3.  **主题保存**：处理 `/api/save-theme` 请求，将主题保存到服务器文件系统。

### 3.1 目录结构

```
server/
├── index.js        # 后端入口文件
├── package.json    # 后端依赖
└── themes/         # (可选) 如果项目根目录不可写，将使用此目录保存主题
```

### 3.2 关键代码说明 (已存在)

您无需手动创建文件，以下代码已在 `server/index.js` 中：

```javascript
// server/index.js 摘要
const app = express();

// 1. API 代理配置
app.use('/api/moonshot', createProxyMiddleware({
  target: 'https://api.moonshot.cn',
  // ... 自动注入 Authorization header
}));

// 2. 主题保存 API
app.post('/api/save-theme', (req, res) => {
  // ... 将 JSON 保存到 themes 目录
});

// 3. 静态文件托管
app.use(express.static(path.resolve(__dirname, '../dist')));
```

### 3.3 本地测试后端 (可选)

在部署前，您可以在本地验证这个后端服务：

```bash
# 1. 构建前端
npm run build

# 2. 安装后端依赖
cd server
npm install

# 3. 启动后端服务
# 确保项目根目录有 .env 文件且包含 VITE_MOONSHOT_API_KEY
npm start
```

访问 `http://localhost:3001` 即可查看运行效果。

---

## 4. 部署代码到 VPS

### 4.1 构建前端

在本地运行：

```bash
npm run build
```

这会生成 `dist/` 目录。

### 4.2 准备文件结构

在 VPS 上，建议保持以下目录结构（假设部署在 `/home/deploy/wpdesign`）：

```
/home/deploy/wpdesign/
├── dist/                # 前端构建产物 (由 npm run build 生成)
├── server/              # 后端服务代码
│   ├── index.js
│   └── package.json
├── .env                 # 环境变量文件 (包含 VITE_MOONSHOT_API_KEY)
└── ecosystem.config.js  # PM2 配置文件
```

### 4.3 同步代码到服务器

**方法 A: 使用 rsync（推荐）**

```bash
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./dist ./server ./ecosystem.config.js ./.env \
  deploy@你的服务器IP:/home/deploy/wpdesign/
```

> 注意：如果您的本地 .env 包含敏感信息，请确保它是安全的，或者在服务器上单独创建 .env 文件。

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

PM2 是一个守护进程管理器，可以帮助您管理和保持应用程序在线。

### 5.1 安装后端依赖

在启动之前，需要在服务器上安装后端依赖：

```bash
cd /home/deploy/wpdesign/server
npm install
```

### 5.2 启动服务

回到项目根目录，使用 `ecosystem.config.js` 启动：

```bash
cd /home/deploy/wpdesign
pm2 start ecosystem.config.js
```

### 5.3 常用 PM2 命令

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs wpdesign-app

# 重启服务
pm2 restart wpdesign-app

# 停止服务
pm2 stop wpdesign-app
```

### 5.4 设置开机自启

```bash
pm2 startup
# 运行上一条命令输出的指令，例如：
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy

pm2 save
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
