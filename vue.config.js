module.exports = {

  lintOnSave: false,
  outputDir: "dist",
  assetsDir: "assets",
  devServer: {
    port: 8085,
    proxy: {
      '/api': {
        target: 'https://wxapi.ycb56.com/api/',
        pathRewrite: {'^/api' : ''},
        secure: false
      },
    }
  }
}
