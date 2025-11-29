const express = require("express");
const publicCtrl = require("./public.controller");
const publicRouter = express.Router();

publicRouter.get("/employers", publicCtrl.getEmployers);


publicRouter.get("/stats", publicCtrl.getStats);

module.exports = publicRouter;
