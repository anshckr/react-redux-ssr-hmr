import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import BrowserRouter from 'react-router-dom/BrowserRouter'

import routes from './scripts/routes'

const App = ({ store }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Provider>
  )
}

App.propTypes = {
  store: PropTypes.object
}

export default App
