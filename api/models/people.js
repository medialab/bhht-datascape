/**
 * BHHT People Model
 * ==================
 *
 * Model in charge of retrieving precise information concerning a single
 * person of the database.
 */
const client = require('../client');

/**
 * Function retrieving information for the given people.
 */
exports.get = function(id, callback) {
  return client.get({index: 'people', type: 'people', id}, (err, result) => {
    if (err) {
      if (err.status === 404)
        return callback(null, null);
      return callback(err);
    }

    return callback(null, result._source);
  });
};
