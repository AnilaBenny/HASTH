module.exports = {
  apps: [
    {
      name: "server",                   
      script: "dist/app.js",              
      instances: 1,                       
      exec_mode: "cluster",               
      autorestart: true,                  
      watch: false,                       
      max_memory_restart: '1G',           

    },
  ],
};
