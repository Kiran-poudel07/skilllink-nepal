const notificationSvc = require("./notification.service");

class NotificationController {
 
  async create(req, res, next) {
    try {
      const data = {
        recipient: req.body.recipient,
        sender: req.loggedInUser._id,
        type: req.body.type,
        title: req.body.title,
        message: req.body.message,
        gig: req.body.gig || null,
      };

      const notif = await notificationSvc.createNotification(data);
      res.status(201).json({
        status: "success",
        message: "Notification created successfully",
        data: notif,
      });
    } catch (err) {
      next(err);
    }
  }
 async getUnreadCount(req, res, next) {
    try {
      const userId = req.loggedInUser._id;
      // console.log(userId)
      const count = await notificationSvc.getUnreadCount(userId);

      res.status(200).json({
        status: "success",
        data: { unreadCount: count },
      });
    } catch (err) {
      next(err);
    }
  }
 
  async getAll(req, res, next) {
    try {
      const notifs = await notificationSvc.getUserNotifications(req.loggedInUser._id);
      res.json({
        data: {data:notifs},
        status: "success",
        
      });
    } catch (err) {
      next(err);
    }
  }

 
  async markRead(req, res, next) {
    try {
      const notif = await notificationSvc.markAsRead(
        req.params.id,
        req.loggedInUser._id
      );
      res.json({
        status: "success",
        message: "Notification marked as read",
        data: notif,
      });
    } catch (err) {
      next(err);
    }
  }

 
  async clear(req, res, next) {
  try {
    const result = await notificationSvc.deleteOne(
      req.params.id,
      req.loggedInUser._id
    );

    res.json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}


}
const notificationCtrl = new NotificationController();
module.exports = notificationCtrl
