module.exports = {
  apps: [{
    name: "wpdesign-app",
    script: "./server/index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: "production",
      PORT: 3001
    },
    // 错误日志路径
    error_file: "./logs/err.log",
    // 输出日志路径
    out_file: "./logs/out.log",
    // 合并日志
    merge_logs: true,
    // 日志时间格式
    log_date_format: "YYYY-MM-DD HH:mm:ss"
  }]
};
