"use strict";

const app = require("./src/app");
const config = require.main.require("./config");

const port = config.server.port;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
