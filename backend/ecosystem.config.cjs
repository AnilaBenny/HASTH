module.exports = {
  apps: [
    {
      name: 'server',
      script: 'src/server.ts',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      interpreter: 'ts-node',
    },
  ],
};
