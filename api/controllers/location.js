/**
 * BHHT Datascape Location Controller
 * =================================
 *
 * Controller serving the data required to render the location view.
 */
const model = require('../models/location');

module.exports = [
  {
    url: '/:id',
    method: 'GET',
    action(req, res) {
      const id = req.params.id;

      return model.get(id, (err, location) => {
        if (err)
          return res.serverError(err);

        if (!location)
          return res.notFound();

        return res.ok(location);
      });
    }
  }
];
