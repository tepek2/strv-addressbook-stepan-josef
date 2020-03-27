"use strict";

const nodemailer = require("nodemailer");

const config = require.main.require("./config");

const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.mailer.user,
        password: config.mailer.password
    }
});

module.exports = mailer;
