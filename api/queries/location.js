/**
 * BHHT Datascape Location Queries
 * ================================
 *
 * Functions used to format ElasticSearch queries related to the location view.
 */
const {
  createHistogramRanges
} = require('./histogram');

/**
 * Constants.
 */
const STEP = 10;

/**
 * Function returning a frequentation query for the given location.
 */
function createFrequentationQuery(location) {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [
          {
            term: {
              location
            }
          },
          {
            exists: {
              field: 'max'
            }
          }
        ]
      }
    },
    aggs: {
      histogram: {
        range: {
          ranges: createHistogramRanges(STEP),
          script: {
            lang: 'painless',
            inline: 'Math.ceil(doc[\'max\'].date.year / 10) * 10'
          }
        }
      }
    }
  };

  return query;
}

/**
 * Exporting.
 */
exports.createFrequentationQuery = createFrequentationQuery;
