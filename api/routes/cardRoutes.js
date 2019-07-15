/**
 * @file
 * Define the route
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

module.exports = function(app) {
  var controller = require('../controllers/cardController');

  app.route('/card')
    .get(controller.getAllCard);

  app.route('/card/:uid')
    .get(controller.getCard)
    .put(controller.addCard)
    .delete(controller.delCard);
};
