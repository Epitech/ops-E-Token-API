/**
 * @file
 * Provide the handler for querying the database
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

const database = require('./connection');

module.exports = function (sql, replacements, type, accept = null, reject = null) {
    database.query(sql, {replacements, type})
        .then(function (result) {
            if (accept !== null) {
                accept(result);
            }
        })
        .catch(function (error) {
            console.error(error);
            if (reject !== null) {
                reject();
            }
        });
};