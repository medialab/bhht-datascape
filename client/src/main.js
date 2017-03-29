/**
 * BHHT Datascape Application Endpoint
 * ====================================
 *
 * Entry point for the client application.
 */
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import createHistory from 'history/createHashHistory';
import thunk from 'redux-thunk';
import Application from './components/Application';
import reducer from './modules';
import {initRouter} from './modules/router';
import historyMiddleware from './middlewares/history';

// Requiring style
import '../style/app.scss';

// History
const HISTORY = createHistory();

// Mount node
const MOUNT_NODE = document.getElementById('app');

// Creating redux store
const STORE = createStore(
  reducer,
  applyMiddleware(thunk, historyMiddleware(HISTORY))
);
window.STORE = STORE;

STORE.dispatch(initRouter());

// Function rendering the application
function renderApplication(Component) {
  const block = (
    <Provider store={STORE}>
      <Component history={HISTORY} />
    </Provider>
  );

  render(block, MOUNT_NODE);
}

// First render
renderApplication(Application);

// Handling HMR
if (module.hot) {

  // Reloading components
  module.hot.accept('./components/Application', () => {
    const NextApplication = require('./components/Application').default;
    renderApplication(NextApplication);
  });

  // Reloading reducers
  module.hot.accept('./modules', () => {
    const nextReducer = require('./modules').default;
    STORE.replaceReducer(nextReducer);
  });
}
