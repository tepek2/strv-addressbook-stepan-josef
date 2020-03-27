"use strict";

const { Sequelize } = require("sequelize");

const config = require.main.require("./config");

const db = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    {
        host: config.db.host,
        port: config.db.port,
        dialect: config.db.dialect,
        pool: {
            max: config.db.connectionLimit
        }
    }
);

module.exports = db;
