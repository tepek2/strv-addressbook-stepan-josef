"use strict";

var config = require("./production.json");

config.db.host = process.env.DB_HOST || config.db.host;
config.db.user = process.env.DB_USER || config.db.user;
config.db.password = process.env.DB_PASSWORD || config.db.password;
config.mailer.user = process.env.MAILER_USER || config.mailer.USER;
config.mailer.password = process.env.MAILER_PASSWORD || config.mailer.password;
config.tokenSecret = process.env.TOKEN_SECRET || config.tokenSecret;
config.resetSecret = process.env.RESET_SECRET || config.resetSecret;

module.exports = config;
