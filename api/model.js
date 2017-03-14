/**
 * BHHT Datascape Model
 * =====================
 *
 * Model using the ElasticSearch client to query the database.
 */
const client = require('./client');

// TODO: make a queries folder exporting functions

/**
 * Function returning the top people of the database.
 */
function topPeople(params, callback) {
  const query = {};

  if (params.name)
    query.match_phrase_prefix = {
      label: params.name
    };

  return client.search({
    index: 'people',
    size: 50,
    body: {
      query,
      sort: [{'notoriety.en': 'desc'}]
    }
  }, (err, results) => {
    if (err)
      return callback(err);

    return callback(null, results.hits.hits);
  });
}

/**
 * Exporting.
 */
module.exports = {
  topPeople
};
