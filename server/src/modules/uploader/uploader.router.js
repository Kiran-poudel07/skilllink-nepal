const uploaderCtrl = require("./uploader.controller");
const bodyValidator = require("../../middlewares/validator.middleware");
const { profileValidation } = require("./uploader.validator");
const multer = require("multer");
const { auth } = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader.middleware");

const uploaderRouter = require("express").Router();

uploaderRouter.get("/me", auth(), uploaderCtrl.getProfile);

uploaderRouter.put(
  "/me",
  auth(),
  uploader("image").fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
    { name: "companyDocs", maxCount: 1 },
  ]),
  bodyValidator(profileValidation),
  uploaderCtrl.updateProfile
);


uploaderRouter.get("/all", auth(), uploaderCtrl.getAllProfiles);

uploaderRouter.delete("/me", auth(), uploaderCtrl.deleteProfile);

uploaderRouter.delete("/admin/:userId",auth(),  uploaderCtrl.adminDeleteProfile);

module.exports = uploaderRouter;
