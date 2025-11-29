const notificationSvc = require("../notification/notification.service");
const UserModel = require("./user.model");

class UserService {
  async createUser(data) {
    try {
      const userObject = new UserModel(data);
      return await userObject.save();
    } catch (exception) {
      throw exception;
    }
  }

  async getByEmail(email) {
    return await UserModel.findOne({ email }).lean();
  }

  async getById(id) {
    return await UserModel.findById(id);
  }

  async getUserById(id) {
    return await UserModel.findById(id).select("-password");
  }
  getUserPublicProfile = (userObj) => {
    return {
      _id: userObj.id,
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      gender: userObj.gender,
      dob: userObj.dob,
      status: userObj.status,
      phone: userObj.phone,
      age: userObj.age,
      address: userObj.address,
      image: userObj.image
    };
  }
  async getCurrentUser(userId) {
    return await UserModel.findById(userId).select("-password");
  }

  async getAllUsersAdmin(query) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {
      role: { $ne: "admin" }
    };


    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.isBlocked !== undefined) filter.isBlocked = query.isBlocked === "true";
    if (query.isDeleted !== undefined) filter.isDeleted = query.isDeleted === "true";


    if (query.q) {
      filter.$or = [
        { name: { $regex: query.q.trim(), $options: "i" } },
        { email: { $regex: query.q.trim(), $options: "i" } }
      ];
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      UserModel.countDocuments(filter)
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateProfileByAdmin(userId, data) {

    const allowedFields = ["name", "email", "age", "dob", "gender", "image", "role"];
    const filteredData = {};


    allowedFields.forEach((field) => {
      if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
        filteredData[field] = data[field];
      }
    });

    const updatedUser = await UserModel.findByIdAndUpdate(userId, filteredData, { new: true });

    if (!updatedUser) {
      throw {
        message: "User not found",
        status: "BAD_REQUEST",
        error: null,
        options: null
      };
    }

    return updatedUser;
  }



  getSingleRowByFilter = async (filter) => {
    try {
      const userDetail = await UserModel.findOne(filter)
      return userDetail
    } catch (exception) {
      throw exception
    }
  }

  updateSingleRowByFilter = async (data, filter) => {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(filter, data);
      return updatedUser
    } catch (exception) {
      throw exception
    }
  }

  async deleteUser(id) {
    return await UserModel.findByIdAndDelete(id);
  }
  async moderateUser({ adminId, userId, action, reason }) {
    const user = await UserModel.findById(userId);
    if (!user) throw { statusCode: 404, message: "User not found" };

    let update = {};
    let notificationType = "admin_action";
    let message = "";

    switch (action) {

      case "BLOCK":
        if (user.isBlocked === true)
          throw { statusCode: 400, message: "User already blocked" };

        update.isBlocked = true;
        message = "Your account has been blocked by an admin.";
        break;


      case "UNBLOCK":
        if (user.isBlocked === false)
          throw { statusCode: 400, message: "User is not blocked" };

        update.isBlocked = false;
        message = "Your account has been unblocked.";
        break;


      case "DELETE":
        if (user.isDeleted === true)
          throw { statusCode: 400, message: "User already deleted" };

        update.isDeleted = true;
        message = "Your account has been deleted by admin.";
        break;


      case "RESTORE":
        if (user.isDeleted === false)
          throw { statusCode: 400, message: "User is not deleted" };

        update.isDeleted = false;
        message = "Your account has been restored.";
        break;


      case "ACTIVATE":
        if (user.status === "active")
          throw { statusCode: 400, message: "User already active" };

        update.status = "active";
        message = "Your account is now active.";
        break;


      case "DEACTIVATE":
        if (user.status === "inactive")
          throw { statusCode: 400, message: "User already inactive" };

        update.status = "inactive";
        message = "Your account has been deactivated.";
        break;

      default:
        throw { statusCode: 400, message: "Invalid action" };
    }


    await UserModel.findByIdAndUpdate(userId, update, { new: true });


    await notificationSvc.createNotification({
      recipient: userId,
      sender: adminId,
      type: "admin_action",
      title: `Admin Action: ${action}`,
      message: reason ? `${message} Reason: ${reason}` : message,
    });

    return { success: true };
  }

}

const userSvc = new UserService();
module.exports = userSvc;
