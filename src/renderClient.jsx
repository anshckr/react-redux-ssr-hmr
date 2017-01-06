import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import cookie from 'cookie';
import 'babel-polyfill';

import createStore from './scripts/store';
import routes from './scripts/routes';
import config from './scripts/config';
import styles from './stylesheets/main.scss';

const app = document.getElementById('app');
const cookies = cookie.parse(document.cookie);

ReactDOM.render(
    <Provider store={createStore(cookies.debug === 'true')}>
        <Router routes={routes} history={browserHistory} />
    </Provider>, app);
