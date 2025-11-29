const express = require("express");
const bodyValidator = require("../../middlewares/validator.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const authCtrl = require("./auth.controller");
const { userRegisterDTO, loginDTO } = require("./auth.validator");
const { auth } = require("../../middlewares/auth.middleware");
const authRouter = express.Router();

authRouter.post("/register", uploader().single("image"), bodyValidator(userRegisterDTO), authCtrl.registerUser);

authRouter.get("/activate/:token",authCtrl.activateUser);


authRouter.post("/login", bodyValidator(loginDTO), authCtrl.loginUser);

authRouter.post("/forgot-password", authCtrl.forgotPassword);

authRouter.post("/reset-password/:token", authCtrl.resetPassword);



authRouter.post("/logout", auth(), authCtrl.logoutUser);


authRouter.post("/refresh", authCtrl.refreshToken);

module.exports = authRouter;
