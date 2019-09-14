/**
 * @file
 * Provide the handler for querying the database
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

const fs = require('fs');
const database = require('./connection');
let databaseConnected = new Promise(resolve => {
    let promises = [];

    database
        .authenticate()
        .then(() => {
            // Execute all .sql files
            fs.readdir("../../sql/", (err, files) => {
                files.forEach(file => {
                    fs.readFile("../../sql/" + file, (err, sql) => {
                        console.log('Ingesting ' + file)
                        promises.push(new Promise(resolve => {
                            database.query(sql.toString()).then(() => {
                                resolve();
                            });
                        }));
                    });
                });
            });
            Promise.all(promises);
            resolve();
        })
        .catch(err => {
            console.error("Unable to connect to the database:", err);
            process.exit(1);
        });
});

module.exports = function (sql, replacements, type, accept = null, reject = null) {
    databaseConnected
        .then(() => {
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
        })
};