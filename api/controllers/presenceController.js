/**
 * @file
 * Define the controller
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

const Sequelize = require('sequelize');
const jwt_decode = require('jwt-decode');
const query = require('../database/handler');

/**
 * Concatenate params to a single string
 * @param params
 * @returns {*}
 */
function event_to_id(params) {
    return params.scolaryear + params.codemodule + params.codeinstance + params.codeacti + params.codeevent;
}

/**
 * Check if user has read privilege of the module on the Intranet
 * @param req
 * @param res
 * @param next
 */
exports.checkPrivileges = function(req, res, next) {
    if (req.headers !== undefined && req.headers.authorization !== undefined) {
        fetch('https://intra.epitech.eu/module/' + req.params.scolaryear + '/' + req.params.codemodule + '/' + req.params.codeinstance + '?format=json', {headers: {'Cookie': 'user=' + req.headers.authorization.split(' ')[1]}})
            .then((response) => response.json())
            .then((response) => {
                if (response.rights !== undefined && response.rights !== null && (response.rights.indexOf('prof_inst') > -1 || response.rights.indexOf('assistant') > -1)) {
                    query('INSERT INTO activities_log (activity_name, activity_action, activity_action_student_login, activity_action_student_present, activity_action_login, query_date) VALUES (?, ?, ?, ?, ?, NOW())',
                        [event_to_id(req.params), req.method, req.body.login || null, req.body.present || null, jwt_decode(req.headers.authorization.split(' ')[1]).login],
                        Sequelize.QueryTypes.INSERT,
                        function () {
                            next();
                        }, function (err) {
                            res.sendStatus(500);
                        });
                } else {
                    res.sendStatus(403);
                }
            });
    } else {
        res.sendStatus(401);
    }
};

/**
 * Get presence of the activity
 * @param req
 * @param res
 */
exports.getPresence = function(req, res) {
    query('SELECT student_login AS login, student_present AS present FROM activities WHERE activity_name=?',
        [event_to_id(req.params)],
        Sequelize.QueryTypes.SELECT,
        function (results) {
            if (results.length === 0) {
                res.json({'students': null});
            } else {
                res.json({'students': results});
            }
        }, function () {
            res.sendStatus(500);
        });
};

/**
 * Add a student presence on an activity
 * @param req
 * @param res
 */
exports.addPresence = function(req, res) {
    query('INSERT INTO activities (activity_name, student_login, student_present, query_date) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE student_present=VALUES(student_present), query_date=VALUES(query_date)',
        [event_to_id(req.params), req.body.login, req.body.present],
        Sequelize.QueryTypes.INSERT,
        function () {
            res.json({'message': 'Added student'});
        }, function () {
            res.sendStatus(500);
        });
};

/**
 * Remove an activity
 * @param req
 * @param res
 */
exports.delPresence = function(req, res) {
    query('DELETE FROM activities WHERE activity_name=?',
        [event_to_id(req.params)],
        Sequelize.QueryTypes.DELETE,
        function () {
            res.json({'message': 'Removed activity'});
        }, function () {
            res.sendStatus(500);
        });
};
