import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import createStore from './scripts/store'
import App from './App'
import './stylesheets/main.scss'

const store = createStore()

const renderApp = Component => {
  render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById('app')
  )
}

renderApp(App)

// Webpack Hot Module Replacement API
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App')
    renderApp(NextApp)
  })
}
