/**
 * @file
 * Define the server bind
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';
require('dotenv').config();

require('isomorphic-fetch');

var express = require('express'),
    app = express(),
    port = process.env.PORT || 443,
    bodyParser = require('body-parser'),
    fs = require('fs'),
    https = require('https'),
    helmet = require('helmet'),
    jwt_decode = require('jwt-decode');

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  let now = new Date();
  let date = now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear() + '/' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  if (req.headers !== undefined && req.headers.authorization !== undefined) {
    try {
      console.log(date, jwt_decode(req.headers.authorization.split(' ')[1]).login, req.connection.remoteAddress, req.method, req.originalUrl);
      next();
    } catch (e) {
      console.log(date, 'undefined', req.connection.remoteAddress, req.method, req.originalUrl);
      res.sendStatus(400);
    }
  } else {
    console.log(date, req.connection.remoteAddress, req.method, req.originalUrl);
    next();
  }
});

console.log('============== STARTING SERVER ==============');
if (process.env.DEBUG) {
  var http = require('http');
  http.createServer(app).listen(port);
} else {
  let path = '/etc/letsencrypt/live/whatsupdoc.epitech.eu/';
  https.createServer({key: fs.readFileSync(path + 'privkey.pem'), cert: fs.readFileSync(path + 'cert.pem'), ca: fs.readFileSync(path + 'chain.pem')}, app).listen(port);
}

require('./api/routes/cardRoutes')(app);
require('./api/routes/presenceRoutes')(app);

module.exports = app;
