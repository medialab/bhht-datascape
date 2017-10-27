/**
 * BHHT Datascape Macro Queries
 * =============================
 *
 * Functions used to format ElasticSearch queries related to the macro view's
 * data & information.
 */
const {createWikipediaLabel} = require('../../lib/helpers');

const {
  createHistogramRanges
} = require('./histogram');

const {
  createBoolQueryForLang
} = require('./lang');

const {
  langs: LANGS
} = require('../../specs/meta.json');

/**
 * Constants.
 */
const STEP = 10;

/**
 * Bucket maps of the different macro query modes.
 */
const QUERY_BUCKETS = {
  global: agg => agg,
  categories: agg => {
    return {
      categories: {
        terms: {
          field: 'category',
          size: 20
        },
        aggs: agg
      }
    };
  },
  subcategories: agg => {
    return {
      subcategories: {
        terms: {
          field: 'subcategory',
          size: 20
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
  precision: agg => {
    return {
      precisions: {
        terms: {
          field: 'datePrecision'
        },
        aggs: agg
      }
    };
  },
  languages: agg => {
    const filters = {};

    LANGS.forEach(lang => {
      filters[lang] = createBoolQueryForLang(lang);
    });

    filters.multiWithEn = createBoolQueryForLang('multiWithEn');
    filters.multiWithoutEn = createBoolQueryForLang('multiWithoutEn');

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
  const ranges = createHistogramRanges(STEP);

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
  precision: aggs => {
    return aggs
      .precisions
      .buckets
      .map(precision => {
        return {
          name: precision.key,
          histogram: precision.histogram.buckets.map(histogramBucketMapper)
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
 * Mapping some modes to their respective field to filter.
 */
const MODE_FIELDS = {
  gender: 'gender',
  categories: 'category',
  subcategories: 'subcategory',
  precision: 'datePrecision'
};

/**
 * Function creating a query retrieving the top people.
 */
function createTopPeopleQuery(params) {
  const {
    mode,
    period,
    values
  } = params;

  const filter = {
    bool: {
      must: [
        {
          range: {
            life: {
              lt: period[1],
              gte: period[0],
              format: 'y'
            }
          }
        }
      ]
    }
  };

  if (values && values.length) {
    if (mode === 'languages') {
      filter.bool.must.push({
        bool: {
          should: values.map(createBoolQueryForLang)
        }
      });
    }
    else {
      const field = MODE_FIELDS[mode];

      filter.bool.must.push({
        terms: {
          [field]: values
        }
      });
    }
  }

  let notorietyField = 'compoundNotoriety';

  if (
    mode === 'languages' &&
    values.length === 1 &&
    values[0] !== 'multiWithoutEn' &&
    values[0] !== 'multiWithEn'
  )
    notorietyField = `notoriety.${values[0]}`;

  return {
    size: 0,
    aggs: {
      prefilter: {
        filter,
        aggs: {
          topPeople: {
            top_hits: {
              sort: [
                {
                  [notorietyField]: {
                    order: 'desc'
                  }
                }
              ],
              size: 100,
              _source: {
                includes: [
                  'label',
                  'name',
                  'gender',
                  'category',
                  'subcategory',
                  'birth',
                  'death',
                  'birthDatePrecision',
                  'deathDatePrecision',
                  'dead'
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
                  year: {
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
