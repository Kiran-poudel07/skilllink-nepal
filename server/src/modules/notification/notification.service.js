const NotificationModel = require("./notification.model");

class NotificationService {
  
  async createNotification(data) {
    return await NotificationModel.create(data);
  }

  
  async getUserNotifications(userId) {
    

    return await NotificationModel.find({ recipient: userId })
      .populate("sender", "name email")
      .populate("gig", "title")
      .sort({ createdAt: -1 });
  }

  
  async markAsRead(notificationId, userId) {
    const notif = await NotificationModel.findOne({
      _id: notificationId,
      recipient: userId,
    });
    if (!notif) throw { statusCode: 404, message: "Notification not found" };

    notif.isRead = true;
    return await notif.save();
  }
  async getUnreadCount(userId) {
    return await NotificationModel.countDocuments({
      recipient: userId,
      isRead: false,
    });
  }

 
  async deleteOne(notificationId, userId) {
  const notif = await NotificationModel.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notif) {
    throw { statusCode: 404, message: "Notification not found" };
  }

  await NotificationModel.deleteOne({ _id: notificationId });

  return {
    message: "Notification deleted successfully",
    data: notif,
  };
}

}
const notificationSvc = new NotificationService();
module.exports = notificationSvc
