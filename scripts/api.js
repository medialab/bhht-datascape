/**
 * BHHT Datascape API Start Script
 * ================================
 *
 * Script starting the API.
 */
const http = require('http');
let app = require('../api/app');

const server = http.createServer(app);

server.listen(4000);

console.log('Listening on port 4000...');

// Handling HMR
if (module.hot) {
  module.hot.accept('../api/app', () => {
    server.removeListener('request', app);
    app = require('../api/app');
    server.on('request', app);
    console.log('Server reloaded!');
  });
}
