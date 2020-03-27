"use strict";

const Crypto = require("crypto");
const jwt = require("jsonwebtoken");

const config = require.main.require("./config");
const mailer = require.main.require("./src/utils/mailer");

function encode(salt, password) {
    return (salt + Crypto.createHash("sha256").update(password + salt).digest("hex"));
}

function encodePassword(password) {
    let salt = Crypto.randomBytes(4).toString("hex");
    return encode(salt, password);
}

function checkPassword(password, hash) {
    let salt = hash.substr(0, 4 * 2);
    let hash2 = encode(salt, password);
    return (hash === hash2);
}

function generateToken(email) {
    return jwt.sign({
        data: email
    }, config.tokenSecret, { expiresIn: "1h" });
}

async function sendEmail(email, title, text) {
    await mailer.sendMail({
        from: config.mailer.user,
        to: email,
        subject: title,
        text
    });

    return;
}

function generateResetLink(email) {

    let token = jwt.sign({
        data: email
    }, config.resetSecret, { expiresIn: "1h" });
    let url =`${config.server.host}:${config.server.port}/user/resetPassword/${token}`;
    return url;
}

function getEmailFromToken(token) {
    let email = jwt.verify(token, config.resetSecret).data;
    return email;
}

module.exports = { encodePassword, checkPassword, generateToken, sendEmail, generateResetLink, getEmailFromToken };
