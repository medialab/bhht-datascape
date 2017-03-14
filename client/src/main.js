/**
 * BHHT Datascape Application Endpoint
 * ====================================
 *
 * Entry point for the client application.
 */
import React from 'react';
import {render} from 'react-dom';
import Application from './components/Application.jsx';

// Requiring style
// import '../style/app.scss';

// Mount node
const MOUNT_NODE = document.getElementById('app');

// Function rendering the application
function renderApplication(Component) {
  const block = (
    // <Provider store={STORE}>
      <Component />
    // </Provider>
  );

  render(block, MOUNT_NODE);
}

// First render
renderApplication(Application);

// Handling HMR
if (module.hot) {

  // Reloading components
  module.hot.accept('./components/Application.jsx', () => {
    const NextApplication = require('./components/Application.jsx').default;
    renderApplication(NextApplication);
  });

  // Reloading reducers
  // module.hot.accept('./modules', () => {
  //   const nextReducer = require('./modules').default;
  //   STORE.replaceReducer(nextReducer);
  // });
}
