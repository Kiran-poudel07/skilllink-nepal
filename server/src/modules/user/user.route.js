const userCtrl = require("./user.controller");
const userRouter = require("express").Router();
const { updateProfileValidation,updateUserActionSchema } = require("./user.validator");
const bodyValidator = require("../../middlewares/validator.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const { auth } = require("../../middlewares/auth.middleware");
const { Status, userRoles } = require("../../config/constant");

userRouter.get("/me", auth(), userCtrl.getMe);
userRouter.put("/admin/action",auth(userRoles.ADMIN)
,bodyValidator(updateUserActionSchema),userCtrl.updateUserAction);
userRouter.put("/admin/:id", auth(userRoles.ADMIN), uploader().single("image"), bodyValidator(updateProfileValidation), userCtrl.updateUserByAdmin);
userRouter.get("/admin/all/userlist", auth(userRoles.ADMIN), userCtrl.getAllUsersAdmin);


userRouter.put("/admin/action",auth(userRoles.ADMIN)
,bodyValidator(updateUserActionSchema),userCtrl.updateUserAction);
userRouter.get("/:id", auth(userRoles.ADMIN), userCtrl.getUserById);
userRouter.delete("/:id", auth(userRoles.ADMIN), userCtrl.deleteUser);

module.exports = userRouter;
