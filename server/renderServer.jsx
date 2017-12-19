import React from 'react'
import { renderToString } from 'react-dom/server'
import StaticRouter from 'react-router-dom/StaticRouter'
import { renderRoutes } from 'react-router-config'

import createStore from '../src/scripts/store'
import config from '../src/scripts/config'
import routes from '../src/scripts/routes'

let debug = process.env.NODE_ENV !== 'production'

debug = false

const mu = require('mu2')
const path = require('path')
const fs = require('fs')

const options = {
  path: {
    base: debug ? path.join(process.cwd(), 'src') : 'dist'
  }
}

const manifestFilePath = path.join(options.path.base, 'assets-manifest.json')
const assetsManifest = JSON.parse(fs.readFileSync(manifestFilePath, 'utf-8'))

const PROD = process.env.NODE_ENV === 'production'

export default function handleRender (req, res) {
  // This context object contains the results of the render
  const context = {}
  let reactComponentHtml
  const store = createStore()
  try {
    reactComponentHtml = renderToString(
      <StaticRouter location={req.url} context={context}>
        {renderRoutes(routes)}
      </StaticRouter>
    )
  } catch (evt) {
    res.status(500)
    console.log(evt)
    return
  }

  if (!PROD) {
    mu.clearCache()
  }

  // Grab the initial state from our Redux store
  const preloadedState = JSON.stringify(store.getState())

  const stream = mu.compileAndRender(path.join(options.path.base, 'index.html'), {
    ...options,
    ...config,
    wantScript: true,
    reactComponentHtml,
    preloadedState,
    PROD: PROD,
    assets: assetsManifest
  })

  stream.pipe(res)
}
