/**
 * BHHT Datascape People Controller
 * =================================
 *
 * Controller serving the data required to render the people view.
 */
const model = require('../models/people');

module.exports = [
  {
    url: '/:id',
    method: 'GET',
    action(req, res) {
      const id = req.params.id;

      return model.get(id, (err, person) => {
        if (err)
          return res.serverError(err);

        if (!person)
          return res.notFound();

        return res.ok(person);
      });
    }
  }
];
