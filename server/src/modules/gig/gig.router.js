const express = require("express");
const gigRouter = express.Router();
const multer = require("multer");
const gigCtrl = require("./gig.controller");
const { auth, verifyOwnership } = require("../../middlewares/auth.middleware");
const { createGigDTO, updateGigDTO } = require("./gig.validator");
const GigModel = require("./gig.model");
const uploader = require("../../middlewares/uploader.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const { userRoles } = require("../../config/constant");


gigRouter.post("/create", auth(userRoles.EMPLOYER), uploader().array("files"), bodyValidator(createGigDTO), gigCtrl.createGig);
gigRouter.put("/:id", auth(userRoles.EMPLOYER), verifyOwnership(GigModel), uploader().array("files"), bodyValidator(updateGigDTO), gigCtrl.updateGig);
gigRouter.delete("/:id", auth(userRoles.EMPLOYER), verifyOwnership(GigModel), gigCtrl.deleteGig);
gigRouter.patch("/:id/status", auth(userRoles.EMPLOYER), verifyOwnership(GigModel), gigCtrl.changeStatus);
gigRouter.get("/my", auth(userRoles.EMPLOYER), gigCtrl.getMyGigs);
gigRouter.get("/admin/all", auth(userRoles.ADMIN), gigCtrl.getAllGigsAdmin);
gigRouter.put("/admin/edit/:id", auth(userRoles.ADMIN), gigCtrl.adminUpdateGig);




gigRouter.get("/all", auth(userRoles.EMPLOYER,userRoles.ADMIN,userRoles.STUDENT), gigCtrl.getGigs);
gigRouter.get("/:id", auth(userRoles.EMPLOYER,userRoles.ADMIN,userRoles.STUDENT), gigCtrl.getGigById);

module.exports = gigRouter;
