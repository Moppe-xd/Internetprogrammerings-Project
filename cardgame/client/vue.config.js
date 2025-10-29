const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});
module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8989",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:8989",
        ws: true, // <-- This enables websocket proxying!
        changeOrigin: true,
      },
    },
  },
};
