const express = require("express");
const appRouter = express.Router();
const { createApplicationDTO, updateApplicationStatusDTO } = require("./application.validator");
const { auth } = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const applicationCtrl = require("../application/application.controller");
const { userRoles } = require("../../config/constant");

appRouter.post("/", auth(userRoles.STUDENT), bodyValidator(createApplicationDTO), applicationCtrl.createApplication);


appRouter.delete("/:id", auth(userRoles.STUDENT), applicationCtrl.deleteApplication);


appRouter.patch("/:id/status", auth(userRoles.EMPLOYER), bodyValidator(updateApplicationStatusDTO), applicationCtrl.updateStatus);


appRouter.get("/student/me", auth(userRoles.STUDENT), applicationCtrl.getStudentApplications);


appRouter.get("/employer/me", auth(userRoles.EMPLOYER), applicationCtrl.getEmployerApplications);


appRouter.get("/all", auth(userRoles.ADMIN), applicationCtrl.getAllApplications);



appRouter.get("/:id", auth(userRoles.STUDENT,userRoles.EMPLOYER,userRoles.ADMIN), applicationCtrl.getApplicationById);


module.exports = appRouter;
