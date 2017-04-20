/* eslint no-console: 0 */
/**
 * BHHT Datascape API Start Script
 * ================================
 *
 * Script starting the API.
 */
const http = require('http'),
      config = require('../config.json').api;

let app = require('../api/app');

const server = http.createServer(app);

server.listen(config.port);

console.log(`Listening on port ${config.port}...`);

// Handling HMR
if (module.hot) {
  module.hot.accept('../api/app', () => {
    server.removeListener('request', app);
    app = require('../api/app');
    server.on('request', app);
    console.log('Server reloaded!');
  });
}

// Handling dev environment
const PROD = process.env.NODE_ENV === 'production';

if (!PROD) {
  const util = require('util');
  util.inspect.defaultOptions.depth = null;
  util.inspect.defaultOptions.colors = true;
}
