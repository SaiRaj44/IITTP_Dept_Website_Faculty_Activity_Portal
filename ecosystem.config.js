module.exports = {
  apps: [
    {
      name: "deptflow",
      script: "npm",
      args: "run dev",
      watch: true,
      ignore_watch: ["node_modules", "logs"],
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
