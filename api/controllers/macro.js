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
        mode: 'macro:mode',
        period: 'string',
        values: '?string'
      }
    },
    action(req, res) {
      const period = req.query.period.split(',');

      const values = req.query.values ?
        req.query.values.split(',') :
        [];

      const mode = req.query.mode;

      return model.topPeople({mode, period, values}, (err, people) => {
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
        mode: 'macro:mode',
        period: 'string',
        values: '?string'
      }
    },
    action(req, res) {
      const period = req.query.period.split(',');

      const values = req.query.values ?
        req.query.values.split(',') :
        [];

      const mode = req.query.mode;

      return model.topLocations({mode, period, values}, (err, locations) => {
        if (err)
          return res.serverError(err);

        return res.ok(locations);
      });
    }
  }
];
