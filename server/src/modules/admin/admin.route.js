const express = require("express");
const adminRouter = express.Router();
const adminCtrl = require("./admin.controller");
const { createAdminSchema,changeUserStatusSchema,userListQuerySchema,gigActionSchema,auditQuerySchema } = require("./admin.validator");
const { auth } = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const multer = require("multer");
const { userRoles } = require("../../config/constant");
const upload = multer(); 

adminRouter.post("/", auth(userRoles.SUPERADMIN),upload.none(), bodyValidator(createAdminSchema), adminCtrl.createAdmin);

adminRouter.get("/users", auth(userRoles.ADMIN,userRoles.SUPERADMIN), bodyValidator(userListQuerySchema), adminCtrl.listUsers);

adminRouter.post("/users/action", auth(userRoles.ADMIN,userRoles.SUPERADMIN), bodyValidator(changeUserStatusSchema), adminCtrl.changeUserStatus);

adminRouter.post("/gigs/action", auth(userRoles.ADMIN,userRoles.STUDENT), bodyValidator(gigActionSchema), adminCtrl.actOnGig);

adminRouter.get("/payments", auth(userRoles.ADMIN,userRoles.SUPERADMIN), adminCtrl.listPayments);

adminRouter.get("/logs", auth(userRoles.ADMIN,userRoles.SUPERADMIN), bodyValidator(auditQuerySchema), adminCtrl.getAuditLogs);

module.exports = adminRouter;
