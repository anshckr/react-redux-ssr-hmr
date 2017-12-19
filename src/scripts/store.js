import { applyMiddleware, createStore } from 'redux'

import reducer from './reducers'
import config from './config'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { isBrowserEnv } from './devTools'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

const logger = createLogger({
  diff: true,
  collapsed: true
})

let preloadedState

// Grab the state from a global injected into server-generated HTML
if (isBrowserEnv()) {
  preloadedState = window.carpool.PRELOADED_STATE
}

const createMyStore = (debug = false) => {
  const middlewares = [thunk]

  if (config.debug || debug) {
    middlewares.push(logger)
  }

  const store = createStore(
    reducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(...middlewares),
      applyMiddleware(routerMiddleware(browserHistory))
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}

export default createMyStore
