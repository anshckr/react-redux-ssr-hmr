import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { renderRoutes } from 'react-router-config'

class Layout extends React.Component {
  render () {
    if (!this.props.route) {
      return null
    }

    const containerClasses = classnames({
      container: true
    })

    return (
      <div
        className={containerClasses}
      >
        {renderRoutes(this.props.route.routes)}
      </div>
    )
  }
}

Layout.propTypes = {
  route: PropTypes.object
}

export default Layout
