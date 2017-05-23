/**
 * BHHT Location Model
 * ====================
 *
 * Model in charge of retrieving precise information concerning a single
 * location of the database.
 */
const async = require('async'),
      client = require('../client');

const {
  createFrequentationQuery
} = require('../queries/location');

/**
 * Function retrieving information for the given location.
 */
exports.get = function(id, callback) {

  async.parallel({
    info: next => {
      return client.get({index: 'location', type: 'location', id}, (err, result) => {
        if (err) {
          if (err.status === 404)
            return next(null, null);
          return next(err);
        }

        return next(null, result._source);
      });
    },
    frequentation: async.apply(exports.frequentation, id)
  }, (err, data) => {
    if (err)
      return callback(err);

    const location = data.info;

    // Mapping frequentation data
    location.frequentation = data
      .frequentation
      .aggregations
      .histogram
      .buckets
      .map(bucket => {
        return {
          from: '' + bucket.from,
          count: bucket.doc_count
        };
      });

    return callback(null, location);
  });
};

/**
 * Function retrieving suggestions for locations.
 */
exports.suggestions = function(query, callback) {
  const body = {
    suggest: {
      locations: {
        prefix: query,
        completion: {
          field: 'suggest',
          fuzzy: true,
          size: 50
        }
      }
    }
  };

  return client.search({index: 'location', body}, (err, result) => {
    if (err)
      return callback(err);

    const locations = result.suggest.locations[0].options.map(hit => {
      return {
        label: hit._source.label,
        name: hit._source.name
      };
    });

    return callback(null, locations);
  });
};

/**
 * Function retrieving frequentation stats for the given location.
 */
exports.frequentation = function(location, callback) {
  const query = createFrequentationQuery(location);

  return client.search({index: 'path', body: query}, (err, result) => {
    if (err)
      return callback(err);

    return callback(null, result);
  });
};
