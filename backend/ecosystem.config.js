module.exports = {
    apps: [
      {
        name: "server",
        script: "ts-node",
        args: "src/server.ts",
        watch: true,
        interpreter: "node",
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };
  