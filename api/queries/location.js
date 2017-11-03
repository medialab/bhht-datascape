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
 * Function returning a frequentation query for the given location aliases.
 */
function createFrequentationQuery(aliases) {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [
          {
            terms: {
              location: aliases
            }
          },
          {
            exists: {
              field: 'year'
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
            inline: 'Math.ceil(doc[\'year\'].date.year / 10) * 10'
          }
        }
      }
    }
  };

  return query;
}

/**
 * Function returning people related to the given location aliases.
 */
function createRelatedPeopleQuery(aliases) {
  const query = {
    size: 0,
    query: {
      terms: {
        location: aliases
      }
    },
    aggs: {
      relatedPeople: {
        terms: {
          field: 'people',
          size: 10 * 1000
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
exports.createRelatedPeopleQuery = createRelatedPeopleQuery;
