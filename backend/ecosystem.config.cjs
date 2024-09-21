module.exports = {
  apps: [
    {
      name: "server",
      script: "./src/server.ts",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      interpreter: 'node',
      interpreter_args: '-r ts-node/register',
    },
  ],
};