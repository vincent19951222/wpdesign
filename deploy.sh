#!/bin/bash

# 部署配置
SERVER_IP="159.75.139.106"
SERVER_USER="root"
REMOTE_PATH="/www/wwwroot/wpdesign/"

echo "🚀 开始部署流程..."

# 1. 构建前端
echo "📦 正在构建前端项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，停止部署"
    exit 1
fi

# 2. 同步文件
echo "📤 正在同步文件到服务器 ($SERVER_IP)..."
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./dist ./server ./ecosystem.config.js ./.env \
  $SERVER_USER@$SERVER_IP:$REMOTE_PATH

if [ $? -ne 0 ]; then
    echo "❌ 同步失败"
    exit 1
fi

echo "✅ 部署文件同步完成！"
echo "👉 提示：如果是首次部署或更新了后端依赖，请登录服务器执行："
echo "   ssh $SERVER_USER@$SERVER_IP 'cd $REMOTE_PATH/server && npm install && cd .. && pm2 start ecosystem.config.js'"
echo "👉 如果只是更新前端，通常无需重启服务（除非后端逻辑也有变更）"
