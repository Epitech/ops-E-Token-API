var mysql = require('mysql');
var pool;

function getPool() {
    if (!pool) {
      if (process.env.DEBUG) {
        pool = mysql.createPool({
          host     : 'localhost',
          user     : 'phpmyadmin',
          password : 'root'
        });
      } else {
        pool = mysql.createPool({
          host     : 'localhost',
          user     : process.env.DATABASE_USER,
          password : process.env.DATABASE_PASSWORD
        });
      }
    }
    return pool;
}

exports.execute = function(req, res, callback) {
  getPool().getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      callback(req, res, connection);
      connection.release();
    }
  });
}
