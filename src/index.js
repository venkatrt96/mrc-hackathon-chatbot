/* eslint "no-undef": 0 */
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'containers/App';
import configureStore from 'stores';
import DashboardContainer from 'containers/DashboardContainer';

require('./styles/app.scss');

const initialStoreState = {};
const store = configureStore(initialStoreState);

ReactDOM.render(
  <Provider store={store}>
    <App>
      <DashboardContainer />
    </App>
  </Provider>,
  document.getElementById('app'),
);
