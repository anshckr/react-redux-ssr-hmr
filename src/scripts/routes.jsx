// import app layout
import Layout from './Layout/containers';
// import app pages
import Home from './Home';

const rootRoute = {
    path: '/',
    component: Layout,
    indexRoute: {
        component: Home,
        name: 'home'
    }]
};

export default rootRoute;
