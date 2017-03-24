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
    action(req, res) {
      return model.topPeople((err, people) => {
        if (err)
          return res.serverError(err);

        return res.ok(people);
      });
    }
  }
];
