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
  createFrequentationQuery,
  createRelatedPeopleQuery
} = require('../queries/location');

/**
 * Function retrieving information for the given location.
 */
exports.get = function(id, callback) {

  const query = {
    size: 1,
    query: {
      term: {
        aliases: id
      }
    }
  };

  async.waterfall([
    next => {
      return client.search({index: 'location', type: 'location', body: query}, (err, result) => {
        if (err) {
          if (err.status === 404)
            return next(null, null);
          return next(err);
        }

        return next(null, result.hits.hits[0]._source);
      });
    },
    (location, next) => {
      return exports.frequentation(location.aliases, (err, result) => {
        if (err)
          return next(err);

        const frequentation = result
          .aggregations
          .histogram
          .buckets
          .map(bucket => {
            return {
              from: '' + bucket.from,
              count: bucket.doc_count
            };
          });

        location.frequentation = frequentation;

        return next(null, location);
      });
    },
    (location, next) => {
      const body = createRelatedPeopleQuery(location.aliases);

      return client.search({index: 'people', body}, (err, result) => {
        const relatedPeople = result
          .hits
          .hits
          .map(hit => hit._source);

        location.relatedPeople = relatedPeople;

        return next(null, location);
      });
    }
  ], callback);
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
 * Function retrieving frequentation stats for the given location aliases.
 */
exports.frequentation = function(aliases, callback) {
  const query = createFrequentationQuery(aliases);

  return client.search({index: 'path', body: query}, (err, result) => {
    if (err)
      return callback(err);

    return callback(null, result);
  });
};
