import React from 'react'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import BrowserRouter from 'react-router-dom/BrowserRouter'

import routes from './scripts/routes'
import createStore from './scripts/store'

var store = createStore()

const AppRouter = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Provider>
  )
}

export default AppRouter
