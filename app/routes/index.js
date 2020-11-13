"use strict";

const userRoute = require("./user-route");
const groupRoute = require("./group-route");

module.exports = (app) => {
  userRoute(app);
  groupRoute(app);
};
