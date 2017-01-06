require('events').EventEmitter.prototype._maxListeners = 30;

var fs = require('fs'),
    path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    CompressionPlugin = require("compression-webpack-plugin"),
    autoprefixer = require('autoprefixer'),
    AssetsPlugin = require('assets-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash');

// detect debug mode
var debug = process.env.NODE_ENV !== 'production';

var jsChunkOutputPath = 'scripts/[name]' + (debug ? '' : '.[chunkhash]') + '.js';
var cssChunkOutputPath = 'stylesheets/[name]' + (debug ? '' : '.[contenthash]') + '.css';

    // Common settings to be reused in multiple chunks.
var commonSettings = {
    name: null, // null just signifies that it needs to be overridden
    cache: true,
    debug: debug,
    devtool: debug ? 'eval-source-map' : 'source-map',
    context: path.resolve(__dirname, 'src'),
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    include: [
        path.resolve(__dirname, 'src')
    ],
    entry: null,
    output: null,
    module: null,
    plugins: null
};

var commonLoaders = [
    {
        test: /.jsx?$/,
        exclude: [/(node_modules)/, /.git/],
        loader: 'babel-loader',
        query: {
            presets: ['react', 'es2015', 'stage-0'],
            plugins: [
                'add-module-exports',
                'react-html-attrs',
                'transform-decorators-legacy',
                'transform-class-properties',
                'transform-react-jsx-img-import'
            ]
        }
    },
    {
        include: /\.json$/,
        loaders: ['json-loader']
    },
    {
        test: /\.(jpg|png|gif)$/,
        loaders: [
            'file?hash=sha512&digest=hex&name=[path][name]-[hash].[ext]',
            'image-webpack?bypassOnDebug&{optimizationLevel: 7, interlaced: false, pngquant:{quality: "75-90", speed: 4}, mozjpeg: {quality: 80}}'
        ]
    }
];

function noop() {}

var commonPlugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    }),
    debug ? noop : new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
];


function getCompressionPlugin() {
    return new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "zopfli",
        test: /\.js$|\.html$|\.css$|\.ttf$|\.otf$/,
        threshold: 2048,
        minRatio: 0.6,
        blocksplitting: true,
        numiterations: 10
    });
}

var clientBundle = Object.assign({}, commonSettings, {
    name: 'client-side bundle',
    entry: {
        main: [
            './renderClient.jsx'
        ],
        vendor: [
            'react',
            'redux',
            'react-redux',
            'react-dom',
            'classnames',
            'react-router-redux',
            'react-router',
            'react-helmet',
            './stylesheets/fonts.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: jsChunkOutputPath,
        publicPath: '/'
    },
    module: {
        loaders: commonLoaders.concat([
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract([
                    'css-loader',
                    'postcss-loader',
                    'resolve-url',
                    'sass'
                ])
            },
            {
                test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]),
    },
    sassLoader: {
        includePaths: [
            path.resolve(__dirname, 'node_modules/')
        ]
    },
    postcss: [autoprefixer()],
    plugins: commonPlugins.concat([
        new webpack.optimize.CommonsChunkPlugin('vendor', jsChunkOutputPath),
        new WebpackMd5Hash(),
        new CopyWebpackPlugin([
            { from: './images/*.ico', to: './' },
            { context: './', from: '**.html', to: './' },
            { from: './robots.txt', to: './' }
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
            path: 'dist/',
            filename: 'assets-manifest.json'
        }),
        new ExtractTextPlugin(cssChunkOutputPath)
    ])
});

var serverBundle = Object.assign({}, commonSettings, {
    name: 'server-side bundle',
    target: 'node',
    entry: [
        'babel-polyfill',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './server/app.jsx'
    ],
    output: {
        path: path.join(__dirname, 'dist', 'server'),
        filename: 'app.js',
        publicPath: '/',
        libraryTarget: 'commonjs2'
    },
    // keep node_module paths out of the bundle
    externals: fs.readdirSync('node_modules').concat([
        'react-dom/server',
        'react/addons',
    ]).reduce(function(ext, mod) {
        ext[mod] = 'commonjs ' + mod;
        return ext;
    }, {}),
    node: {
        __filename: false,
        __dirname: false
    },
    module: {
        loaders: commonLoaders
    },
    plugins: commonPlugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        debug ? noop : (new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }))
    ]),
});

var staticErrorPageBundle = Object.assign({}, serverBundle, {
    name: 'static Error Page Bundle',
    entry: [
        './createStaticPage.jsx',
    ],
    output: {
        path: path.join(__dirname, 'dist', 'server'),
        filename: 'createStaticPage.js',
        publicPath: '/',
        libraryTarget: 'commonjs2'
    },
    plugins: commonPlugins.concat([
        new webpack.NoErrorsPlugin(),
        debug ? noop : (new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }))
    ])
});

var sitemapBundle = Object.assign({}, serverBundle, {
    name: 'sitemap Bundle',
    entry: [
        './sitemap.jsx',
    ],
    output: {
        path: path.join(__dirname, 'dist', 'server'),
        filename: 'sitemap.js',
        publicPath: '/',
        libraryTarget: 'commonjs2'
    },
    plugins: commonPlugins.concat([
        new webpack.NoErrorsPlugin()
    ])
});

module.exports = [clientBundle, serverBundle, staticErrorPageBundle, sitemapBundle];
