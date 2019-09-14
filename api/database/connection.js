/**
 * @file
 * Define the database connection
 *
 * This code is the property of Epitech
 * Contact: mickael.leclerc@epitech.eu
 */

'use strict';

const Sequelize = require("sequelize");

module.exports = new Sequelize("mysql://" + (process.env.DATABASE_USER || "phpmyadmin") + ":" + (process.env.DATABASE_PASSWORD || "root") + "@" + (process.env.DATABASE_ADDR || "localhost") + ":" + (process.env.DATABASE_PORT || "3800") + "/" + (process.env.DATABASE_NAME || "etoken"));
