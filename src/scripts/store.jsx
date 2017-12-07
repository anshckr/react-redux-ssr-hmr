import { applyMiddleware, createStore, compose } from 'redux';

import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import logger from 'redux-logger';

import reducer from './reducers';
import config from './config';
import { isBrowserEnv } from './devTools';

function callAndRemoveFalsyArgs(cb, args, context) {
    return cb.apply(context, args.filter(arg => !!arg));
}

let preloadedState = {};

const createMyStore = (debug = false) => {
    const middlewares = [promise(), thunk];

    if (config.debug || debug) {
        middlewares.push(logger());
    }

    const store = createStore(
        reducer,
        preloadedState,
        callAndRemoveFalsyArgs(compose, [
            applyMiddleware(...middlewares),
            applyMiddleware(routerMiddleware(browserHistory))
        ], this)
    );
    return store;
};

export default createMyStore;
