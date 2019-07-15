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

function havePrivileges(req, res) {
  return new Promise((resolve, reject) => {
    if (req.headers !== undefined && req.headers.authorization !== undefined) {
      fetch('https://intra.epitech.eu/user/?format=json', {headers: {'Cookie': 'user=' + req.headers.authorization.split(' ')[1]}})
        .then((response) => response.json())
        .then((response) => {
          if (response.groups !== undefined && response.groups.some(function(el) {return ['enrolment_nfc', 'pedago'].indexOf(el.name) !== -1})) {
            pool.execute(req, res, function(req, res, connection) {
              connection.query('INSERT INTO etoken.user_corresp_log (action, uid, student, login, query_date) VALUES (?, UNHEX(?), ?, ?, NOW())', [req.method, req.params.uid, req.body.login, jwt_decode(req.headers.authorization.split(' ')[1]).login], function(error) {
                if (error) {
                  console.log(error);
                  res.sendStatus(500);
                  reject();
                } else {
                  resolve();
                }
              });
            });
          } else {
            res.sendStatus(403);
            reject();
          }
        });
    } else {
      res.sendStatus(401);
      reject();
    }
  });
};

exports.getAllCard = function(req, res) {
  havePrivileges(req, res)
    .then(() => {
      pool.execute(req, res, function(req, res, connection) {
        connection.query('SELECT login FROM etoken.user_corresp', function(error, results) {
          if (error) {
            console.log(error);
            res.sendStatus(500);
          } else {
            res.json(results.map(el => el.login));
          }
        });
      });
    });
}

exports.getCard = function(req, res) {
  pool.execute(req, res, function(req, res, connection) {
    connection.query('SELECT login FROM etoken.user_corresp WHERE uid=UNHEX(RPAD(?, 14, "0"))', [req.params.uid], function(error, results) {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else {
        if (results.length === 0) {
          res.json({'error': 'Wrong Request'});
        } else {
          res.json({'login': results[0].login});
        }
      }
    });
  });
};

exports.addCard = function(req, res) {
  havePrivileges(req, res)
    .then(() => {
      pool.execute(req, res, function(req, res, connection) {
        connection.query('INSERT INTO etoken.user_corresp (uid, login, last_modified) VALUES (UNHEX(?), ?, NOW()) ON DUPLICATE KEY UPDATE uid=VALUES(uid), login=VALUES(login), last_modified=VALUES(last_modified)', [req.params.uid, req.body.login], function(error) {
          if (error) {
            console.log(error);
            res.sendStatus(500);
          } else {
            res.json({'message': 'Added card'});
          }
        });
      });
    });
};

exports.delCard = function(req, res) {
  havePrivileges(req, res)
    .then(() => {
      pool.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          pool.execute(req, res, function(req, res, connection) {
            connection.query('DELETE FROM etoken.user_corresp WHERE uid=UNHEX(?)', [req.params.uid], function(error) {
              if (error) {
                console.log(error);
                res.sendStatus(500);
              } else {
                res.json({'message': 'Deleted card'});
              }
            });
          });
        }
      });
    });
};
