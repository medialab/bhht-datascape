/**
 * BHHT Datascape People Controller
 * =================================
 *
 * Controller serving the data required to render the people view.
 */
const model = require('../models/people');

module.exports = [
  {
    url: '/:name',
    method: 'GET',
    action(req, res) {
      const name = req.params.name;

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
