"use strict";

const express = require("express");

const userRouter = require("./user/user");

var router = express.Router();

router.use("/users", userRouter);

module.exports = router;
