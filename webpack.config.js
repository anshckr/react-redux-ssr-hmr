'use strict'

// Required Packages ======================================================================
const PATH = require('path')
const WEBPACK = require('webpack')
const COLORS = require('colors')
const EXTRACT_TEXT_WEBPACK_PLUGIN = require('extract-text-webpack-plugin')

// ReadOnly Properties =====================================================================
const ENV = process.env.NODE_ENV
const PRODUCT_BUILD = process.env.BUILD_APP
// Declare Global Variable PRODUCTION, Can Be Used In Components ========
const PRODUCTION = ENV === 'production'
const CURRENT_DIR = __dirname

// Environment =============================================================================
const ON_ENV = `You are on ${PRODUCTION ? 'production' : 'development'} environment`
console.log((PRODUCTION ? COLORS.bgRed(ON_ENV.white) : COLORS.bgGreen(ON_ENV.black)))

// Decide Product Build ====================================================================

console.log(`Bundling scripts for ${PRODUCT_BUILD.toUpperCase()} product`.yellow.bold)

// Decide Entry Point For Products Depending On Environment ================================
let envEntryDecide = {
  'carpool': ['babel-es6-polyfill/browser-polyfill.js', './renderClient.js']
}

if (!PRODUCTION) envEntryDecide[PRODUCT_BUILD].unshift('webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080')

// Decide Plugins Depending On Environment ==================================================
let envPluginsDecide = false
  ? [
    new WEBPACK.optimize.UglifyJsPlugin({
      comments: false,
      mangle: false,
      compress: {
        warnings: true
      }
    })
  ]
  : [
    new WEBPACK.HotModuleReplacementPlugin()
  ]

envPluginsDecide.push(
  new WEBPACK.DefinePlugin({
    DEVELOPMENT: !PRODUCTION,
    PRODUCTION
  }),

  new EXTRACT_TEXT_WEBPACK_PLUGIN({
    filename: 'app.css',
    allChunks: true
  })
)

// Common Configuration For All The Products ================================================
let config = {
  devtool: false ? 'source-map' : 'eval-source-map',
  entry: envEntryDecide[PRODUCT_BUILD],
  plugins: envPluginsDecide,
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: [
          'babel-loader',
          'eslint-loader'
        ],
        exclude: PATH.join(CURRENT_DIR, 'node_modules/')
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[path][name]-[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&{optimizationLevel: 7, interlaced: false, pngquant:{quality: "75-90", speed: 4}, mozjpeg: {quality: 80}}'
        ]
      },
      {
        test: /\.(swf)$/,
        loader: 'file-loader'
      }
    ]
  }
}

let sassLoader = PRODUCTION
  ? {
    test: /\.scss$/,
    use: EXTRACT_TEXT_WEBPACK_PLUGIN.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    })
  }
  : {
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader',
      'sass-loader'
    ]
  }

config.module.rules.push(sassLoader)

// Decide Product Specific Configuration =====================================================
let finalConfig

switch (PRODUCT_BUILD) {
  case 'carpool':
    let carpoolConfig = Object.assign({}, config, {
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
      },
    })

    finalConfig = carpoolConfig
    break
}

module.exports = finalConfig
