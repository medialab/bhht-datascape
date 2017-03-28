/**
 * BHHT Datascape Macro Queries
 * =============================
 *
 * Functions used to format ElasticSearch queries related to the macro view's
 * data & information.
 */
const {createWikipediaLabel} = require('../../lib/helpers');

const {
  dates: {
    min: MIN_DATE,
    max: MAX_DATE
  },
  langs: LANGS
} = require('../../specs/meta.json');

/**
 * Constants.
 */
const STEP = 10;

/**
 * Function creating a single overlap filter for some queries.
 */
// function createOverlapFilter(min, max) {
//   return {
//     range: {
//       life: {
//         lt: '' + max,
//         gte: '' + min,
//         format: 'y'
//       }
//     }
//   };
// }

/**
 * Function creating a single range for some queries.
 */
function createRange(min, max) {
  return {
    from: '' + min,
    to: '' + max
  };
}

/**
 * Function creating date histogram ranges.
 */
function createHistogramRanges(method, step) {
  const ranges = [];

  const MIN = Math.floor(MIN_DATE / step) * step,
        MAX = Math.ceil(MAX_DATE / step) * step;

  for (let max = MIN, min = null; max <= MAX; max += step) {
    if (min !== null)
      ranges.push(method(min, max));

    min = max;
  }

  return ranges;
}

/**
 * Bucket maps of the different macro query modes.
 */
const QUERY_BUCKETS = {
  global: agg => agg,
  categories: agg => {
    return {
      categories: {
        terms: {
          field: 'category'
        },
        aggs: agg
      }
    };
  },
  subcategories: agg => {
    return {
      subcategories: {
        terms: {
          field: 'subCategory'
        },
        aggs: agg
      }
    };
  },
  gender: agg => {
    return {
      genders: {
        terms: {
          field: 'gender'
        },
        aggs: agg
      }
    };
  },
  languages: agg => {
    const forLang = lang => ({
      bool: {
        must: [
          {
            range: {
              availableLanguagesCount: {
                lt: 2
              }
            }
          },
          {
            term: {
              availableLanguages: lang
            }
          }
        ]
      }
    });

    const filters = {};

    LANGS.forEach(lang => {
      if (lang === 'en')
        return;

      filters[lang] = forLang(lang)
    });

    filters.multiWithEn = {
      bool: {
        must: [
          {
            range: {
              availableLanguagesCount: {
                gt: 1
              }
            }
          },
          {
            term: {
              availableLanguages: 'en'
            }
          }
        ]
      }
    };

    filters.multiWithoutEn = {
      bool: {
        must: [
          {
            range: {
              availableLanguagesCount: {
                gt: 1
              }
            }
          },
          {
            bool: {
              must_not: {
                term: {
                  availableLanguages: 'en'
                }
              }
            }
          }
        ]
      }
    };

    return {
      languages: {
        filters: {
          filters
        },
        aggs: agg
      }
    };
  }
};

/**
 * Function creating a query returning histogram data for the desired mode.
 */
function createStockHistogramQuery(mode) {
  const ranges = createHistogramRanges(createRange, STEP);

  const rangeAggregation = {
    histogram: {
      date_range: {
        field: 'decades',
        format: 'y',
        ranges
      }
    }
  };

  return {
    size: 0,
    aggs: QUERY_BUCKETS[mode](rangeAggregation)
  };
}

/**
 * Mode-related query result mappers.
 */
const histogramBucketMapper = bucket => {
  return {
    from: bucket.from_as_string,
    to: bucket.to_as_string,
    count: bucket.doc_count
  };
};

const MAPPERS = {
  global: aggs => {
    const histogram = aggs
      .histogram
      .buckets
      .map(histogramBucketMapper);

    return [{name: 'global', histogram}];
  },
  categories: aggs => {
    return aggs
      .categories
      .buckets
      .map(category => {
        return {
          name: category.key,
          histogram: category.histogram.buckets.map(histogramBucketMapper)
        };
      });
  },
  subcategories: aggs => {
    return aggs
      .subcategories
      .buckets
      .map(subcategory => {
        return {
          name: subcategory.key,
          histogram: subcategory.histogram.buckets.map(histogramBucketMapper)
        };
      });
  },
  gender: aggs => {
    return aggs
      .genders
      .buckets
      .map(gender => {
        return {
          name: gender.key,
          histogram: gender.histogram.buckets.map(histogramBucketMapper)
        };
      });
  },
  languages: aggs => {
    const langs = aggs
      .languages
      .buckets;

    const lines = [];

    for (const lang in langs)
      lines.push({
        name: lang,
        histogram: langs[lang].histogram.buckets.map(histogramBucketMapper)
      });

    return lines;
  }
};

/**
 * Function mapping a query result to a more legible format.
 */
function mapStockHistogramQueryResult(mode, result) {
  const mapper = MAPPERS[mode] || (x => x);

  return mapper(result.aggregations);
}

/**
 * Function creating a query retrieving the top people.
 */
function createTopPeopleQuery(params) {
  const {
    period
  } = params;

  return {
    size: 0,
    aggs: {
      prefilter: {
        filter: {
          range: {
            life: {
              lt: period[1],
              gte: period[0],
              format: 'y'
            }
          }
        },
        aggs: {
          topPeople: {
            top_hits: {
              sort: [
                {
                  'notoriety.en': {
                    order: 'desc'
                  }
                }
              ],
              size: 100,
              _source: {
                includes: [
                  'label',
                  'name'
                ]
              }
            }
          }
        }
      }
    }
  };
}

/**
 * Function mapping the result of a top people query.
 */
function mapTopPeopleQueryResult(result) {
  return result
    .aggregations
    .prefilter
    .topPeople
    .hits
    .hits
    .map(hit => hit._source);
}

/**
 * Function creating a query retrieving the top locations.
 */
function createTopLocationsQuery(params) {
  const {
    period
  } = params;

  return {
    size: 0,
    aggs: {
      prefilter: {
        filter: {
          bool: {
            must: [
              {
                range: {
                  minDate: {
                    format: 'y',
                    gte: period[0],
                    lt: period[1]
                  }
                }
              }
            ]
          }
        },
        aggs: {
          topLocations: {
            terms: {
              field: 'location',
              size: 100
            }
          }
        }
      }
    }
  };
}

/**
 * Function mapping the result of a top locations query.
 */
function mapTopLocationsQueryResult(result) {
  return result
    .aggregations
    .prefilter
    .topLocations
    .buckets
    .map(bucket => {
      return {
        name: bucket.key,
        label: createWikipediaLabel(bucket.key)
      };
    });
}

/**
 * Exporting.
 */
exports.createStockHistogramQuery = createStockHistogramQuery;
exports.mapStockHistogramQueryResult = mapStockHistogramQueryResult;

exports.createTopPeopleQuery = createTopPeopleQuery;
exports.mapTopPeopleQueryResult = mapTopPeopleQueryResult;

exports.createTopLocationsQuery = createTopLocationsQuery;
exports.mapTopLocationsQueryResult = mapTopLocationsQueryResult;
