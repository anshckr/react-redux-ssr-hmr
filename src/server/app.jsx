import express from 'express';
import path from 'path';
import logger from 'morgan';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import request from 'request';
import raven from 'raven';

import handleRender from '../renderServer';
import webpackConfig from '../../webpack.config';

import config from '../scripts/config';

const PORT = process.env.PORT || 8080;
const HOST_NAME = process.env.HOST_NAME || 'localhost';
const DEBUG = process.env.NODE_ENV !== 'production';

let ravenClient;
if (config.serverSentryDSN) {
    ravenClient = new raven.Client(config.serverSentryDSN);
    ravenClient.patchGlobal();
}

const app = express();

if (DEBUG === true) {
    app.use(logger('dev'));

    const compiler = webpack(webpackConfig[1]);

    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig[1].output.publicPath
    }));

    app.use(webpackHotMiddleware(compiler));
}

const logToSentry = (err) => {
    if (ravenClient) ravenClient.captureException(err);
};

// static - all our js, css, images, etc go into the assets path
// serve our static stuff like index.css
app.use('/', express.static(path.join(path.resolve(__dirname), '..'), { index: false }));

app.use(handleRender);

app.listen(PORT, HOST_NAME, () => {
    console.log(`Server running at http://${HOST_NAME}:${PORT}.`);
    console.log(`Server running in ${DEBUG ? 'debug' : 'production'} mode.`);
});
