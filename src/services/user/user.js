"use strict";

const express = require("express");
const winston = require("winston");
const { checkSchema, validationResult, check } = require("express-validator");

const {
    encodePassword,
    checkPassword,
    generateToken,
    sendEmail,
    generateResetLink,
    getEmailFromToken
} = require("./utils");
const { User } = require.main.require("./src/models/user");

const userSchema = {
    email: {
        isEmail: true,
        in: ["body"]
    },
    password: {
        isString: true,
        in: ["body"]
    }
};

var router = express.Router();

router.post("/", checkSchema(userSchema), async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email;
    let password = req.body.password;

    password = encodePassword(password);
    try {
        await User.create({
            email,
            password
        });
    } catch (err) {
        switch(err.name) {
            case "SequelizeUniqueConstraintError":
                return res.status(409).send("User aleready exist");
            default:
                winston.error(err);
                return res.status("500").send("Error during comunication with database");
        }
    }

    res.status(201).send();
});

router.post("/login", checkSchema(userSchema), async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let user = {};
    let email = req.body.email;
    let password = req.body.password;

    try {
        user = await User.findAll({
            where: {
                email
            }
        });
    } catch (err) {
        winston.error(err);
        return res.status("500").send("Error during comunication with database");
    }

    if (!user || !checkPassword(password, user.password)) {
        return res.status("401").send("Bad email or password");
    }

    let token = generateToken(email);
    
    res.json({ token });
});

router.post("/:email/forgottenPassword", [check("email").isEmail()], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let user = {};
    let email = req.params.email;
    let link = "";

    try {
        user = await User.findAll({
            where: {
                email
            }
        });
    } catch (err) {
        winston.error(err);
        return res.status("500").send("Error during comunication with database");
    }

    if (!user) {
        return res.status("401").send("Bad email");
    }

    link = generateResetLink(email);

    sendEmail(email, "Reset password", link);

    res.status(200).send();
});

router.post("/resetPassword/:token", (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let email = null;
    let password = req.body.params;
    try {
        email = getEmailFromToken(req.params.token);
    } catch (err) {
        switch(err.name) {
            case "TokenExpiredError":
                return res.status(400).send("Link expired");
            default:
                winston.error(err);
                return res.status("500").send("Internal server error.");
        }
    } 

    if (!email) {
        return res.status(400).send("Bad request");
    }

    try {
        await User.update({ password }, {where : { email }});
    } catch (err) {
        winston.error(err);
        return res.status("500").send("Error during comunication with database");
    }

    res.status(200).send();
})

module.exports = router;
