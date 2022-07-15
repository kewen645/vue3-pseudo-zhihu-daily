const { defineConfig } = require('@vue/cli-service')
const ENV = process.env.NODE_ENV;
module.exports = defineConfig({
  lintOnSave: ENV !== 'production',
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:7000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
