/**
 * BHHT Datascape Macro Controller
 * ================================
 *
 * Controller serving the data required to render the macro view.
 */
const model = require('../models/macro');

module.exports = [
  {
    url: '/histogram',
    validate: {
      query: {
        mode: 'macro:mode'
      }
    },
    action(req, res) {
      const mode = req.query.mode;

      return model.histogram(mode, (err, histogram) => {
        if (err)
          return res.serverError(err);

        return res.ok(histogram);
      });
    }
  },
  {
    url: '/top-people',
    validate: {
      query: {
        period: 'string'
      }
    },
    action(req, res) {
      const period = req.query.period.split(',');

      return model.topPeople({period}, (err, people) => {
        if (err)
          return res.serverError(err);

        return res.ok(people);
      });
    }
  },
  {
    url: '/top-locations',
    validate: {
      query: {
        period: 'string'
      }
    },
    action(req, res) {
      const period = req.query.period.split(',');

      return model.topLocations({period}, (err, locations) => {
        if (err)
          return res.serverError(err);

        return res.ok(locations);
      });
    }
  }
];
