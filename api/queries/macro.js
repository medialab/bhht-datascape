/**
 * BHHT Datascape Macro Queries
 * =============================
 *
 * Functions used to format ElasticSearch queries related to the macro view's
 * data & information.
 */
const {min: MIN, max: MAX} = require('../../specs/dates.json');

function createOverlapFilter(min, max) {
  return {
    range: {
      life: {
        lt: '' + max,
        gte: '' + min,
        format: 'yyyy'
      }
    }
  };
}

function alt(min, max) {
  return {from: '' + min, to: '' + max};
}

function createFiltersBucket(step) {
  const filters = [];

  for (let max = MIN, min = null; max <= MAX; max += step) {
    if (min !== null) {
      filters.push(alt(min, max));
    }

    min = max;
  }

  return filters;
}

console.log(JSON.stringify(createFiltersBucket(10)))

/**
 * Exporting.
 */
exports.createFiltersBucket = createFiltersBucket;
