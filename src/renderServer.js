import React from 'react';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';

import routes from './scripts/routes';
import createStore from './scripts/store';
import config from './scripts/config';

let debug = process.env.NODE_ENV !== 'production';
// MOCK
debug = false;

const mu = require('mu2');
const path = require('path');
const fs = require('fs');

const options = {
    path: {
        base: debug ? path.join(process.cwd(), 'src') : 'dist'
    }
};

const manifestFilePath = path.join(options.path.base, 'assets-manifest.json');
const assetsManifest = JSON.parse(fs.readFileSync(manifestFilePath, 'utf-8'));

export default function handleRender(req, res) {
    let reactComponentHtml;
    const store = createStore();

    // Note that req.url here should be the full URL path from
    // the original request, including the query string.
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (error) {
            res.status(500);
        } else if (renderProps) {
            // You can also check renderProps.components or renderProps.routes for
            // your 'not found' component or route respectively, and send a 404 as
            // below, if you're using a catch-all route.
            try {
                reactComponentHtml = renderToString(
                    <Provider store={store}>
                        <RouterContext {...renderProps} />
                    </Provider>
                );
            } catch (evt) {
                res.status(500);
                console.log(evt);
                return;
            }

            if (process.env.NODE_ENV !== 'production') {
                mu.clearCache();
            }

            // Grab the initial state from our Redux store
            const preloadedState = JSON.stringify(store.getState());

            const stream = mu.compileAndRender(path.join(options.path.base, 'index.html'), {
                ...options,
                ...config,
                wantScript: true,
                reactComponentHtml,
                preloadedState,
                assets: assetsManifest
            });

            if (renderProps.routes[1].respStatus) {
                res.status(renderProps.routes[1].respStatus);
            }

            stream.pipe(res);
        } else {
            res.status(404);
        }
    });
}
