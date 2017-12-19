require('events').EventEmitter.prototype._maxListeners = 40

var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var CompressionPlugin = require('compression-webpack-plugin')
var autoprefixer = require('autoprefixer')
var AssetsPlugin = require('assets-webpack-plugin')
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'

// Detect environment
var env = process.env.NODE_ENV || 'dev'
console.log(`Environment: ${env}\n`)

var debug = ['production', 'stage'].indexOf(env) === -1
console.log(debug)

var publicPath = process.env.PUBLIC_PATH || ''

var fileLoaderPublicPath = env !== 'dev' ? `publicPath=${publicPath}/&output` : ''
var assetsPath = path.join(__dirname, 'dist')

var jsChunkOutputPath = 'scripts/[name]' + (debug ? '' : '.[chunkhash]') + '.js'
var cssChunkOutputPath = 'stylesheets/[name]' + (debug ? '' : '.[contenthash]') + '.css'

// Common settings to be reused in multiple chunks.
var commonSettings = {
  name: null, // null just signifies that it needs to be overridden
  cache: true,
  devtool: debug ? 'eval-source-map' : 'source-map',
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  },
  entry: null,
  output: null,
  module: null,
  plugins: null
}

var commonLoaders = [
  {
    test: /\.(js|jsx)$/,
    include: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'server')
    ],
    exclude: [/(node_modules)/, /.git/],
    loader: 'babel-loader',
    query: {
      presets: ['react', 'es2015', 'stage-0'],
      plugins: [
        'react-html-attrs',
        'add-module-exports',
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-react-jsx-img-import',
        'react-hot-loader/babel'
      ]
    }
  }, {
    test: /\.json$/,
    include: [
      path.resolve(__dirname, 'src')
    ],
    loader: 'json-loader'
  }, {
    test: /\.(jpg|png|gif)$/,
    include: [
      path.resolve(__dirname, 'src')
    ],
    loader: ExtractTextPlugin.extract({
      use: [{
        loader: `file-loader?hash=sha512&digest=hex&name=[path][name]-[hash].[ext]&${fileLoaderPublicPath}`
      }, {
        loader: 'image-webpack-loader?bypassOnDebug&{optimizationLevel: 7, interlaced: false, pngquant:{quality: "75-90", speed: 4}, mozjpeg: {quality: 80}}'
      }]
    })
  }
]

function noop () {}

var commonPlugins = [
  new webpack.DefinePlugin({
    'environment': {
      NODE_ENV: JSON.stringify(env),
      publicPath: JSON.stringify(publicPath),
      debug
    }
  }),
  new webpack.optimize.OccurrenceOrderPlugin()
]

function getCompressionPlugin () {
  return new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'zopfli',
    test: /\.js$|\.html$|\.css$|\.ttf$|\.otf$/,
    threshold: 2048,
    minRatio: 0.6,
    blocksplitting: true,
    numiterations: 10
  })
}

var clientBundle = Object.assign({}, commonSettings, {
  name: 'client-side bundle',
  entry: {
    main: [
      'react-hot-loader/patch',
      hotMiddlewareScript,
      './renderClient.jsx'
    ],
    vendor: [
      'react',
      'redux',
      'react-redux',
      'react-dom',
      'classnames',
      'react-router'
    ]
  },
  context: path.resolve(__dirname, 'src'),
  output: {
    path: assetsPath,
    filename: jsChunkOutputPath,
    publicPath: '/dist/'
  },
  module: {
    rules: commonLoaders.concat([
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          }, {
            loader: 'resolve-url-loader'
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve(__dirname, 'node_modules/')
              ]
            }
          }],
          // use style-loader in development
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ])
  },
  plugins: commonPlugins.concat([
    debug ? new webpack.HotModuleReplacementPlugin() : noop,
    new webpack.optimize.CommonsChunkPlugin({
      path: assetsPath,
      name: 'vendor',
      filename: jsChunkOutputPath,
      minChunks: Infinity
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer()
        ]
      }
    }),
    new CopyWebpackPlugin([
      { from: './images/*.ico', to: './' },
      { context: './', from: '**.html', to: './' }
    ]),
    debug ? noop : getCompressionPlugin(),
    debug ? noop : (new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      },
      output: {
        comments: false
      }
    })),
    new AssetsPlugin({
      path: assetsPath,
      filename: 'assets-manifest.json'
    }),
    new ExtractTextPlugin(cssChunkOutputPath)
  ])
})

var serverBundle = Object.assign({}, commonSettings, {
  name: 'server-side bundle',
  target: 'node',
  entry: [
    'babel-polyfill',
    './server/renderServer.jsx'
  ],
  output: {
    path: assetsPath,
    filename: '../server/renderServer.bundle.js',
    publicPath: '/',
    libraryTarget: 'commonjs2'
  },
  // keep node_module paths out of the bundle
  externals: fs.readdirSync('node_modules').concat([
    'react-dom/server',
    'react/addons'
  ]).reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {}),
  node: {
    __filename: false,
    __dirname: false
  },
  module: {
    rules: commonLoaders
  },
  plugins: commonPlugins.concat([
    debug ? noop : (new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }))
  ])
})

module.exports = [clientBundle, serverBundle]
