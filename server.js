/**
 * @file
 * Define the server bind
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

import 'dotenv/config'
import express from 'express';
import { urlencoded, json } from 'body-parser';
import helmet from 'helmet';
import { jwtDecode } from 'jwt-decode';

var app = express();
var port = 8080;

app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(function(req, res, next) {
  let now = new Date();
  let date = now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear() + '/' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  if (req.headers !== undefined && req.headers.authorization !== undefined) {
    try {
      console.log(date, jwtDecode(req.headers.authorization.split(' ')[1]).login, req.socket.remoteAddress, req.method, req.originalUrl);
      next();
    } catch (e) {
      console.log(date, 'undefined', req.socket.remoteAddress, req.method, req.originalUrl);
      res.sendStatus(400);
    }
  } else {
    console.log(date, req.socket.remoteAddress, req.method, req.originalUrl);
    next();
  }
});

console.log('============== STARTING SERVER ==============');
import { createServer } from 'http';
createServer(app).listen(port);

require('./api/routes/cardRoutes').default(app);
require('./api/routes/presenceRoutes').default(app);

export default app;
