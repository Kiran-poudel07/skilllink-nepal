const notificationRouter = require("express").Router()
const notificationCtrl = require("./notification.controller");
const {createNotificationSchema,markReadSchema} = require("./notification.validator");
const { auth } = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");


notificationRouter.post("/",auth(),bodyValidator(createNotificationSchema),notificationCtrl.create);

notificationRouter.get("/", auth(), notificationCtrl.getAll);

notificationRouter.patch("/:id/read",auth(),bodyValidator(markReadSchema),notificationCtrl.markRead);

notificationRouter.get("/unread", auth(), notificationCtrl.getUnreadCount);


notificationRouter.delete("/delete/:id", auth(), notificationCtrl.clear);

module.exports = notificationRouter;
