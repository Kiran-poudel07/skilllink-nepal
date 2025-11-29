const userSvc = require("./user.service");

class UserController {
  async getMe(req, res, next) {
    try {
      const user = await userSvc.getCurrentUser(req.loggedInUser._id);
      if (!user) throw { status: 404, message: "User not found" };

      res.json({
        data: user,
        message: "Current user profile",
        status: "OK",
        options: null
      });
    } catch (err) {
      next(err);
    }
  }

 
async updateUserByAdmin(req, res, next) {
  try {
    const userId = req.params.id;
    const updatedUser = await userSvc.updateProfileByAdmin(userId, req.body);

    res.json({
      data: updatedUser,
      message: "User profile updated successfully by admin",
      status: "OK",
      options: null
    });
  } catch (err) {
   
    if (err.status === "BAD_REQUEST") {
      return res.status(400).json({
        error: err.error || null,
        message: err.message || "Validation Failed",
        status: err.status,
        options: err.options || null
      });
    }

    
    next(err);
  }
}



  async getAllUsersAdmin(req, res, next) {
  try {
    const data = await userSvc.getAllUsersAdmin(req.query);

    res.json({
      data: {data:data.users,
      meta: data.meta},
      message: "All users fetched successfully",
      status: "OK",
      options: null
    });
  } catch (err) {
    next(err);
  }
}
async updateUserAction(req, res, next) {
    try {
      // console.log("Incoming BODY:", req.body);
      const { userId, action, reason } = req.body;
      // console.log("Incoming BODY:", req.body);

      await userSvc.moderateUser({
        adminId: req.loggedInUser._id,
        userId,
        action,
        reason: reason || ""
      });

      res.json({
        status: "success",
        message: `User ${action.toLowerCase()} successfully`,
      });

    } catch (err) {
      next(err);
    }
  }



  async getUserById(req, res, next) {
    try {
      const user = await userSvc.getUserById(req.params.id);
      if (!user) throw { status: 404, message: "User not found" };
      res.json({ data: user, message: "User details", status: "OK" });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userSvc.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully", status: "OK" });
    } catch (err) {
      next(err);
    }
  }
}

const userCtrl = new UserController();
module.exports = userCtrl;
