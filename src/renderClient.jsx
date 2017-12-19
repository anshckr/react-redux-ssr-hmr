import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import AppRouter from './main'
import './stylesheets/main.scss'

const renderApp = Component => {
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )
}

renderApp(AppRouter)

// Webpack Hot Module Replacement API
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./main', () => {
    const NextAppRouter = require('./main')
    renderApp(NextAppRouter)
  })
}
