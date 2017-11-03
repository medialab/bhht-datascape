/**
 * BHHT Misc Model
 * ================
 *
 * Model in charge of miscellaneous queries.
 */
const client = require('../client');

const {
  createDistinctInstanceValuesQuery,
  mapDistinctInstanceValuesQueryResult
} = require('../queries/misc');

/**
 * Function retrieving distinct instance values for locations.
 */
exports.distinctInstanceValues = function(callback) {
  const body = createDistinctInstanceValuesQuery();

  return client.search({index: 'location', body}, (err, result) => {
    if (err)
      return callback(err);

    const data = mapDistinctInstanceValuesQueryResult(result);

    return callback(null, data);
  });
};
