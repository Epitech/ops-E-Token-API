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
let databaseConnected = false
let promises = [];

module.exports = function (sql, replacements, type, accept = null, reject = null) {
    if (!databaseConnected) {
        database
            .authenticate()
            .then(() => {
                // Execute all .sql files
                fs.readdir("../../sql/", (err, files) => {
                    files.forEach(file => {
                        fs.readFile("../../sql/" + file, (err, sql) => {
                            promises.push(new Promise(resolve => {
                                database.query(sql.toString()).then(() => {
                                    resolve();
                                });
                            }));
                        });
                    });
                });
            })
            .catch(err => {
                console.error("Unable to connect to the database:", err);
                process.exit(1);
            });
        while (promises.length === 0) {
            console.log('Waiting for database to ingest .sql')
        }
        databaseConnected = true;
    }

    Promise.all(promises);
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