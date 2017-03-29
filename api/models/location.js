/**
 * BHHT Location Model
 * ====================
 *
 * Model in charge of retrieving precise information concerning a single
 * location of the database.
 */
const client = require('../client');

/**
 * Function retrieving information for the given location.
 */
exports.get = function(id, callback) {
  return client.get({index: 'location', type: 'location', id}, (err, result) => {
    if (err) {
      if (err.status === 404)
        return callback(null, null);
      return callback(err);
    }

    return callback(null, result._source);
  });
};

/**
 * Function retrieving suggestions for locations.
 */
exports.suggestions = function(query, callback) {
  const body = {
    size: 20,
    query: {
      match: {
        label: query
      }
    }
  };

  return client.search({index: 'location', body}, (err, result) => {
    if (err)
      return callback(err);

    const people = result.hits.hits.map(hit => {
      return {
        label: hit._source.label,
        name: hit._source.name
      };
    });

    return callback(null, people);
  });
};
