// import app layout
import Layout from './Layout'
// import app pages
import Home from './Home'

const routes = [
  { component: Layout,
    routes: [
      { path: '/',
        exact: true,
        component: Home
      }
    ]
  }
]

export default routes
