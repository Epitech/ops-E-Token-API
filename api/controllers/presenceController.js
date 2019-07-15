/**
* @file
* Define the controller
*
* This code is the property of Epitech
* Contact: mickael.leclerc@epitech.eu
*/

'use strict';

const fetch = require('node-fetch');
var pool = require('../database');
var jwt_decode = require('jwt-decode');

function event_to_id(params) {
  return params.scolaryear + params.codemodule + params.codeinstance + params.codeacti + params.codeevent;
}

exports.checkPrivileges = function(req, res, next) {
  if (req.headers !== undefined && req.headers.authorization !== undefined) {
    fetch('https://intra.epitech.eu/module/' + req.params.scolaryear + '/' + req.params.codemodule + '/' + req.params.codeinstance + '?format=json', {headers: {'Cookie': 'user=' + req.headers.authorization.split(' ')[1]}})
      .then((response) => response.json())
      .then((response) => {
        if (response.rights !== undefined && response.rights !== null && (response.rights.indexOf('prof_inst') > -1 || response.rights.indexOf('assistant') > -1)) {
          pool.execute(req, res, function(req, res, connection) {
            connection.query('INSERT INTO etoken.activities_log (activity_name, activity_action, activity_action_student_login, activity_action_student_present, activity_action_login, query_date) VALUES (?, ?, ?, ?, ?, NOW())', [event_to_id(req.params), req.method, req.body.login, req.body.present, jwt_decode(req.headers.authorization.split(' ')[1]).login], function(error) {
              if (error) console.log(error);
            });
          });
          next();
        } else {
          res.sendStatus(403);
        }
      });
  } else {
    res.sendStatus(401);
  }
};

exports.getPresence = function(req, res) {
  pool.execute(req, res, function(req, res, connection) {
    connection.query('SELECT student_login AS login, student_present AS present FROM etoken.activities WHERE activity_name=?', [event_to_id(req.params)], function(error, results) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        if (results.length === 0) {
          res.json({'students': null});
        } else {
          res.json({'students': results});
        }
      }
    });
  });
};

exports.addPresence = function(req, res) {
  pool.execute(req, res, function(req, res, connection) {
    connection.query('INSERT INTO etoken.activities (activity_name, student_login, student_present, query_date) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE student_present=VALUES(student_present), query_date=VALUES(query_date)', [event_to_id(req.params), req.body.login, req.body.present], function(error) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        res.json({'message': 'Added students'});
      }
    });
  });
};

exports.delPresence = function(req, res) {
  pool.execute(req, res, function(req, res, connection) {
    connection.query('DELETE FROM etoken.activities WHERE activity_name=?', [event_to_id(req.params)], function(error) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        res.json({'message': 'Removed students'});
      }
    });
  });
};
