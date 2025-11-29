const express = require("express");
const dashboardRouter = express.Router();
const dashboardCtrl = require("./dashboard.controller");
const { auth } = require("../../middlewares/auth.middleware");
const { userRoles } = require("../../config/constant");


dashboardRouter.get("/student",auth(userRoles.STUDENT), dashboardCtrl.getStudentDashboard);

dashboardRouter.get("/employer",auth(userRoles.EMPLOYER), dashboardCtrl.getEmployerDashboard);


dashboardRouter.get("/admin",auth(userRoles.ADMIN), dashboardCtrl.getAdminDashboard);


module.exports = dashboardRouter;
