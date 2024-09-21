module.exports = {
  apps: [
    {
      name: "server",                     // Name of the application
      script: "dist/app.js",              // Path to the compiled JavaScript file
      instances: 1,                       // Number of instances (set to 1 for single instance or 0 for max CPUs)
      exec_mode: "cluster",               // Cluster mode for scaling across multiple cores
      autorestart: true,                  // Automatically restart the app on crash or failure
      watch: false,                       // No need to watch files in production
      max_memory_restart: '1G',           // Restart the app if it exceeds 1GB memory usage

    },
  ],
};
