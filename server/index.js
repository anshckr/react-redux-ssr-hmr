const express = require('express')
const path = require('path')
const webpack = require('webpack')
const logger = require('morgan')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const handleRender = require('./renderServer.bundle')
const webpackConfig = require('../webpack.config')

const PORT = process.env.PORT || 8080
const HOST_NAME = process.env.HOST_NAME || 'localhost'
const DEBUG = process.env.NODE_ENV !== 'production'

const app = express()

if (DEBUG === true) {
  app.use(logger('dev'))

  const compiler = webpack(webpackConfig[0])

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    hot: true,
    publicPath: webpackConfig[0].output.publicPath,
    stats: {colors: true}
  }))

  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    reload: true
  }))

  // static - all our js, css, images, etc go into the assets path
  // serve our static stuff like index.css
  app.use('/', express.static(path.join(path.resolve(__dirname), '../src/'), { index: false }))
} else {
  app.use('/', express.static(path.join(path.resolve(__dirname), '../dist/'), { index: false }))
}

app.use(handleRender)

app.listen(PORT, HOST_NAME, () => {
  console.log(`Server running at http://${HOST_NAME}:${PORT}.`)
  console.log(`Server running in ${DEBUG ? 'debug' : 'production'} mode.`)
})
