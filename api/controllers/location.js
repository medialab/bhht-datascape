/**
 * BHHT Datascape Location Controller
 * =================================
 *
 * Controller serving the data required to render the location view.
 */
const model = require('../models/location');

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

      return model.suggestions(query, (err, locations) => {
        if (err)
          return res.serverError(err);

        return res.ok(locations);
      });
    }
  },
  {
    url: '/:name',
    method: 'GET',
    action(req, res) {
      const name = encodeURI(req.params.name);

      return model.get(name, (err, location) => {
        if (err)
          return res.serverError(err);

        if (!location)
          return res.notFound();

        return res.ok(location);
      });
    }
  }
];
