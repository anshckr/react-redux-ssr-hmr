import { applyMiddleware, createStore, compose } from 'redux';

import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import persistState from 'redux-localstorage';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import logger from 'redux-logger';

import reducer from './reducers';
import config from './config';
import { isBrowserEnv } from './devTools';

function callAndRemoveFalsyArgs(cb, args, context) {
    return cb.apply(context, args.filter(arg => !!arg));
}

/**
 * Middleware for pushing actions in GTM's data layer.
 *
 * @param {string[]} blacklist - actions you don't want to push to the data layer
 */
const analytics = (blacklist = []) => () => next => action => {
    if (isBrowserEnv()) {
        /* eslint-disable */
        window.gtmDataLayer = typeof gtmDataLayer !== 'undefined' ? gtmDataLayer : [];
        /* eslint-enable */

        if (blacklist.indexOf(action.type) === -1) {
            window.gtmDataLayer.push({
                event: action.type,
                data: { ...action }
            });
        }
    }

    return next(action);
};

const analyticsBlacklist = [
    'HANDLE_BODY_CLICK',
    'UPDATE_SCROLL_TOP'
];

let preloadedState;

// Grab the state from a global injected into server-generated HTML
if (isBrowserEnv()) {
    preloadedState = window.grofers.PRELOADED_STATE;

    // Load states from localStorage if they exist.
    const persistentStates = {
        cart: preloadedState.data.cart,
        user: preloadedState.data.user,
        searchHistory: preloadedState.ui.search.searchHistory,
        auth: preloadedState.data.auth,
        location: preloadedState.data.location
    };

    Object.keys(persistentStates).forEach(key => {
        const storedState = localStorage.getItem(key);

        if (storedState) {
            try {
                Object.assign(persistentStates[key], JSON.parse(storedState));
            } catch (e) {
                // todo: log this on sentry
            }
        }
    });
}

function pathSlicer(paths) {
    const getSubtree = (subtree, key) => {
        if (key.indexOf('.') > -1) {
            const remaining = key.split('.').slice(1).join('.');
            return getSubtree(subtree[key.split('.')[0]], remaining);
        }
        return subtree[key];
    };

    return (state) => getSubtree(state, paths);
}

function tabSync(store) {
    isBrowserEnv() && window.addEventListener('storage', (e) => {
        if ([].indexOf(e.key) !== -1 && (e.oldValue !== e.newValue)) {
            const action = {};
            action.type = `SYNC_${e.key.toUpperCase()}`;
            action[e.key] = JSON.parse(e.newValue);

            store.dispatch(action);
        }
    }, false);
}

const createMyStore = (debug = false) => {
    const middlewares = [promise(), thunk, analytics(analyticsBlacklist)];

    if (config.debug || debug) {
        middlewares.push(logger());
    }

    const store = createStore(
        reducer,
        preloadedState,
        callAndRemoveFalsyArgs(compose, [
            applyMiddleware(...middlewares),
            applyMiddleware(routerMiddleware(browserHistory)),
            isBrowserEnv() ? (
                persistState('data.user', {
                    key: 'user',
                    slicer: pathSlicer,
                })
            ) : null,
            isBrowserEnv() ? (
                persistState('data.cart', {
                    key: 'cart',
                    slicer: pathSlicer,
                })
            ) : null,
            isBrowserEnv() ? (
                persistState('data.auth', {
                    key: 'auth',
                    slicer: pathSlicer,
                })
            ) : null,
            isBrowserEnv() ? (
                persistState('data.location', {
                    key: 'location',
                    slicer: pathSlicer,
                })
            ) : null
        ], this)
    );
    tabSync(store);
    return store;
};

export default createMyStore;
