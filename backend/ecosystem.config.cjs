module.exports = {
  apps: [
    {
      name: "server",
      script: "./dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      interpreter: 'ts-node',
    },
  ],
};
