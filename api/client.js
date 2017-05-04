/**
 * BHHT Datascape ElasticSearch Client
 * ====================================
 *
 * Loading the application's configuration to build the index client.
 */
const Client = require('elasticsearch').Client,
      config = require('config').get('elasticsearch');

module.exports = new Client({
  host: `${config.host}:${config.port}`
});
