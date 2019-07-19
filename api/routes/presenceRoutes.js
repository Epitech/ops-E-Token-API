/**
 * @file
 * Define the route
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

module.exports = function(app) {
  const controller = require('../controllers/presenceController');

  app.route('/presence/:scolaryear/:codemodule/:codeinstance/:codeacti/:codeevent')
      .all(controller.checkPrivileges)
      .get(controller.getPresence)
      .put(controller.addPresence)
      .delete(controller.delPresence);
};
