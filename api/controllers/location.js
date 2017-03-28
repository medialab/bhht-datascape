/**
 * BHHT Datascape Location Controller
 * =================================
 *
 * Controller serving the data required to render the location view.
 */
const model = require('../models/location');

module.exports = [
  {
    url: '/:name',
    method: 'GET',
    action(req, res) {
      const name = req.params.name;

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
