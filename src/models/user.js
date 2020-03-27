"use strict";

const Sequeilize = require("sequelize");
const { Model } = require("sequelize");

const db = require.main.require("./src/database");

class User extends Model {}
User.init({
    email: {
        type: Sequeilize.STRING,
        unique: true
    },
    password: {
        type: Sequeilize.STRING,
        allowNull: false,
    }
}, { 
    sequelize: db,
    modelName: "user",
    timestamps: false
});

module.exports = {User};
