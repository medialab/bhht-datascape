/**
 * BHHT Macro Model
 * =================
 *
 * Model in charge of querying the ElasticSearch database for the necessary
 * data for the macro view.
 */
const client = require('../client');

const {
  createStockHistogramQuery,
  mapStockHistogramQueryResult,

  createTopPeopleQuery,
  mapTopPeopleQueryResult,

  createTopLocationsQuery,
  mapTopLocationsQueryResult
} = require('../queries/macro');

/**
 * Macro modes.
 */
const MACRO_MODES = new Set([
  'global',
  'categories',
  'subcategories',
  'gender',
  'languages'
]);
exports.MACRO_MODES = MACRO_MODES;

/**
 * Function retrieving the stock histogram for the given mode.
 */
exports.histogram = function(mode, callback) {
  const query = createStockHistogramQuery(mode);

  client.search({index: 'people', body: query}, (err, result) => {
    if (err)
      return callback(err);

    const histogram = mapStockHistogramQueryResult(mode, result);

    return callback(null, histogram);
  });
};

/**
 * Function retrieving the top people.
 */
exports.topPeople = function(params, callback) {
  const query = createTopPeopleQuery(params);

  client.search({index: 'people', body: query}, (err, result) => {
    if (err)
      return callback(err);

    const people = mapTopPeopleQueryResult(result);

    return callback(null, people);
  });
};

/**
 * Function retrieving the top locations.
 */
exports.topLocations = function(params, callback) {
  const query = createTopLocationsQuery(params);

  client.search({index: 'path', body: query}, (err, result) => {
    if (err)
      return callback(err);

    const locations = mapTopLocationsQueryResult(result);

    return callback(null, locations);
  });
};
