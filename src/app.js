"use strict";

const express = require("express");
const winston = require("winston");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const log = require("./logger");
const routes = require("./services/routes");

const app = express();

log.init();

app.use(bodyParser.json());
app.use(morgan("combined", { stream: winston.stream.write }));

app.use("/", routes);

/* eslint-disable no-unused-vars */
app.use((req, res, next) => {
    res.status(404).send("Not Found!");
});

app.use((err, req, res, next) => {
    winston.error(err.stack);
    res.status(500).send("Internal Server Error");
});
/* eslint-enable no-unused-vars */

module.exports = app;
    