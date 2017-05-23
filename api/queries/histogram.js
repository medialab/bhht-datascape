/**
 * BHHT Datascape Histogram Queries
 * =================================
 *
 * Helper functions handling the datascape peculiar decade histograms queries
 * that we need to craft to circumvent ES modern logic regarding dates.
 */
const {
  dates: {
    min: MIN_DATE,
    max: MAX_DATE
  }
} = require('../../specs/meta.json');

/**
 * Function creating date histogram ranges.
 */
function createHistogramRanges(step) {
  const ranges = [];

  const MIN = Math.floor(MIN_DATE / step) * step,
        MAX = Math.ceil(MAX_DATE / step) * step;

  for (let max = MIN, min = null; max <= MAX; max += step) {
    if (min !== null)
      ranges.push({
        from: '' + min,
        to: '' + max
      });

    min = max;
  }

  return ranges;
}

/**
 * Exporting.
 */
exports.createHistogramRanges = createHistogramRanges;
