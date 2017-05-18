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
  'languages',
  'precision'
]);
exports.MACRO_MODES = MACRO_MODES;

const lexicographicSort = (a, b) => a.name.localeCompare(b.name);

const LANGUAGES_ORDER = {
  multiWithEn: 1,
  multiWithoutEn: 2,
  de: 3,
  es: 4,
  fr: 5,
  it: 6,
  pt: 7,
  sv: 8
};

const languagesSort = (a, b) => LANGUAGES_ORDER[a.name] - LANGUAGES_ORDER[b.name];

const MACRO_MODES_SORTING_SCHEMES = {
  languages: languagesSort
};

/**
 * Function retrieving the stock histogram for the given mode.
 */
exports.histogram = function(mode, callback) {
  const query = createStockHistogramQuery(mode);

  client.search({index: 'people', body: query}, (err, result) => {
    if (err)
      return callback(err);

    const histogram = mapStockHistogramQueryResult(mode, result);

    // Sorting the lines
    if (mode !== 'global') {
      const sorter = MACRO_MODES_SORTING_SCHEMES[mode] || lexicographicSort;
      histogram.sort(sorter);
    }

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
