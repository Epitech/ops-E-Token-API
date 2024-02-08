/**
 * @file
 * Define the route
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

export default function(app) {
  const controller = require('../controllers/cardController');

  app.route('/card')
      .all(controller.checkPrivileges)
      .get(controller.getAllCard);

  app.route('/card/:uid')
      .get(controller.getCard)
      .all(controller.checkPrivileges)
      .put(controller.addCard)
      .delete(controller.delCard);
};
