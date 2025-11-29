const paymentRouter = require("express").Router()
const paymentCtrl = require("./payment.controller");
const { initiateSchema, verifySchema,adminGetPaymentSchema } = require("./payment.validator");
const { auth } = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const { userRoles } = require("../../config/constant");


paymentRouter.post("/initiate", auth(userRoles.EMPLOYER), bodyValidator(initiateSchema), paymentCtrl.initiateKhalti);

paymentRouter.post("/verify", auth(userRoles.EMPLOYER), bodyValidator(verifySchema), paymentCtrl.verifyKhalti);

paymentRouter.get("/admin/all",auth(userRoles.ADMIN), bodyValidator(adminGetPaymentSchema),paymentCtrl.getAllPaymentsAdmin);

paymentRouter.get("/", auth(), paymentCtrl.getMyPayments);

module.exports = paymentRouter;
