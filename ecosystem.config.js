module.exports = {
  apps : [{
    name: 'API',
    script: 'npm -- run safestart',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: ["node_modules", "logs", "upload", "db"],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
