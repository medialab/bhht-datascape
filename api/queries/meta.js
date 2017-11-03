/**
 * BHHT Datascape Meta Queries
 * ============================
 *
 * Miscellaneous ES queries such as the distinct instance values etc.
 */

/**
 * Function creating an ES query for the distinct instance values attached to
 * locations.
 */
exports.createDistinctInstanceValuesQuery = function() {
  return {
    size: 0,
    aggs: {
      instance: {
        terms: {
          field: 'instance',
          size: 10 * 1000,
          order: [
            {
              _count: 'desc'
            },
            {
              _term: 'asc'
            }
          ]
        }
      }
    }
  };
};

/**
 * Function mapping the result of the above query.
 */
exports.mapDistinctInstanceValuesQueryResult = function(result) {
  return result
    .aggregations
    .instance
    .buckets
    .map(bucket => {
      return {
        label: bucket.key,
        weight: bucket.doc_count
      };
    });
};
