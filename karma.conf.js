/* eslint-disable */
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
/* eslint-enable */

const karmaWebpackConfig = Object.assign(
    {},
    webpackConfig[0],
    {
        plugins: webpackConfig[0].plugins.filter(plugin => (
                !(plugin instanceof webpack.optimize.CommonsChunkPlugin)
            )
        )
    }
);

module.exports = function (config) {
    config.set({
        // Add any browsers here
        browsers: ['Chrome'],
        frameworks: ['jasmine'],

        // The entry point for our test suite
        basePath: '.',
        autoWatch: true,
        files: [
            './node_modules/es6-promise/dist/es6-promise.js',
            './node_modules/whatwg-fetch/fetch.js',
            'src/scripts/tests/*.jsx',
            'src/scripts/**/tests/*.jsx',
        ],

        preprocessors: {
            // Run this through webpack, and enable inline sourcemaps
            'src/scripts/**/tests/*.jsx': ['webpack', 'sourcemap'],
        },

        webpack: karmaWebpackConfig,
        client: {
            // log console output in our test console
            captureConsole: true
        },

        reporters: ['dots'],
        singleRun: false, // do not exit after tests have completed

        webpackMiddleware: {
            noInfo: true
        },

        // Webpack takes a little while to compile -- this manifests as a really
        // long load time while webpack blocks on serving the request.
        browserNoActivityTimeout: 60000, // 60 seconds
    });
};
