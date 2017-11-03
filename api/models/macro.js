/**
 * BHHT Macro Model
 * =================
 *
 * Model in charge of querying the ElasticSearch database for the necessary
 * data for the macro view.
 */
const uniqBy = require('lodash/uniqBy'),
      client = require('../client');

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
  en: 3,
  de: 4,
  es: 5,
  fr: 6,
  it: 7,
  pt: 8,
  sv: 9
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

    // Keeping only unique lowercase locations
    const uniqueLocations = uniqBy(locations, location => location.name.toLowerCase());

    return callback(null, uniqueLocations);
  });
};
