# 🚀 小白 VPS 部署完全指南

别担心，我们一步一步来。您已经成功运行了 `deploy.sh`，这意味着**文件已经上传到服务器了**。

接下来的操作都在服务器上进行。请打开您的终端（Terminal），按照以下步骤操作。

---

## 第一步：登录服务器

在您的本地终端输入：

```bash
ssh root@159.75.139.106
```

（如果提示输入密码，请输入您的 VPS 密码）

---

## 第二步：安装环境 (如果还没装)

我们需要安装 Node.js 和 PM2 来运行程序，安装 Nginx 来处理域名。

**直接复制下面这一整段代码**，粘贴到服务器终端运行：

```bash
# 1. 更新系统软件源
sudo apt update

# 2. 安装 Node.js (版本 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. 安装 PM2 (进程管理器)
sudo npm install -g pm2

# 4. 安装 Nginx (网站服务器)
sudo apt install -y nginx

# 5. 安装 Certbot (用于申请 HTTPS 证书)
sudo apt install -y certbot python3-certbot-nginx
```

---

## 第三步：安装项目依赖并启动

文件已经在 `/www/wwwroot/boluopets.com/wpdesign/` 了，我们需要去“激活”它。

**依次运行以下命令：**

```bash
# 1. 进入后端目录
cd /www/wwwroot/boluopets.com/wpdesign/server

# 2. 安装依赖 (这步很重要！)
npm install

# 3. 回到上级目录
cd ..

# 4. 启动服务
pm2 start ecosystem.config.js

# 5. 保存状态 (确保重启服务器后自动运行)
pm2 save
pm2 startup
```

> **此时，您的后端服务已经跑起来了！** 运行 `pm2 status` 可以看到绿色的 `online` 状态。

---

## 第四步：配置域名 (让 wpdesign.boluopets.com 能访问)

我们需要告诉 Nginx：如果有用户访问 `wpdesign.boluopets.com`，就把请求转交给我们的服务。

**1. 创建配置文件**
复制下面这行命令运行：
```bash
nano /etc/nginx/sites-available/wpdesign.boluopets.com.conf
```

**2. 粘贴内容**
编辑器打开后，将以下内容**全部复制并粘贴**进去：

```nginx
server {
    listen 80;
    server_name wpdesign.boluopets.com;

    access_log /var/log/nginx/wpdesign.access.log;
    error_log /var/log/nginx/wpdesign.error.log;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 10M;
}
```

**3. 保存并退出**
- 按 `Ctrl + O` (字母O)，然后按 `Enter` (回车) 保存。
- 按 `Ctrl + X` 退出编辑器。

**4. 启用配置**
复制运行：
```bash
ln -s /etc/nginx/sites-available/wpdesign.boluopets.com.conf /etc/nginx/sites-enabled/
```

**5. 重启 Nginx**
复制运行：
```bash
nginx -t
systemctl reload nginx
```

> **🎉 此时，您可以在浏览器访问 `http://wpdesign.boluopets.com` 了！**

---

## 第五步：开启 HTTPS (加把小锁 🔒)

最后一步，让您的网站更安全。

复制运行：
```bash
certbot --nginx -d wpdesign.boluopets.com
```

- 它会问您邮箱，输入您的邮箱即可。
- 问您是否同意协议 (Y/N)，输入 `Y`。
- 问您是否分享邮箱，输入 `N`。
- **重要：** 如果它成功了，您的网站就自动变成 `https://` 了。

---

## 总结

您已经完成了！以后如果您更新了代码：
1. 在本地电脑运行 `./deploy.sh`。
2. **通常不需要再登录服务器做什么了。**
3. (除非您改了后端逻辑，才需要去服务器运行 `pm2 restart wpdesign-app`)
