const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  devServer: {
    port: 8081,
    // overlay: {
    //     warnings: false,
    //     errors: false
    // },
    proxy: {
      '/api': {
        target: 'http://rlzypq.samowl.cn',
        changeOrigin: true, // 支持跨域设置
        pathRewrite: {
          // '^/api': '/',
        },
      },
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: 'agr-platform-admin',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        publicImg: path.resolve(__dirname, 'public/img'),
      },
    },
    output: {
      filename: `[name].[hash:7].js`,
      chunkFilename: `[name].[hash:7].js`,
    },
  },
};
