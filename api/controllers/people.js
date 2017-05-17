/**
 * BHHT Datascape People Controller
 * =================================
 *
 * Controller serving the data required to render the people view.
 */
const model = require('../models/people');

module.exports = [
  {
    url: '/suggestions',
    method: 'GET',
    validate: {
      query: {
        query: 'string'
      }
    },
    action(req, res) {
      const query = req.query.query;

      return model.suggestions(query, (err, people) => {
        if (err)
          return res.serverError(err);

        return res.ok(people);
      });
    }
  },
  {
    url: '/:name',
    method: 'GET',
    action(req, res) {
      const name = encodeURIComponent(req.params.name);

      return model.get(name, (err, person) => {
        if (err)
          return res.serverError(err);

        if (!person)
          return res.notFound();

        return res.ok(person);
      });
    }
  }
];
