const { Status } = require("../../config/constant");
const authSvc = require("./auth.service");
const userSvc = require("../user/user.service");
const authNotificationEmailSvc = require("../../mail/auth.email");
class AuthController {
  async registerUser(req, res, next) {
    try {
      const data = await authSvc.transformRegisterUser(req);
      const user = await userSvc.createUser(data);
      const safeUser = await userSvc.getUserPublicProfile(user);
      await authNotificationEmailSvc.sendActivationNotification(user)
      res.status(201).json({
        data: safeUser,
        message: "User registered successfully",
        status: "OK",
        options: null
      });
    } catch (exception) {
      next(exception);
    }
  }
  activateUser = async(req, res, next) => {
       try{
        const token = req.params.token;
        const userDetail = await userSvc.getSingleRowByFilter({
            activationToken: token
        })

        if(!userDetail){
            throw{
                code:422,
                status: "VALIDATION_FAILED",
                message:"Token invalid",
                // status:"INVALID_TOKEN_ERR"
            }
        }
        const updateUser = {
            activationToken: null,
            status:Status.ACTIVE
        }
        const updatedUserDetail = await userSvc.updateSingleRowByFilter(updateUser, {
            _id: userDetail
        })

        await authNotificationEmailSvc.sendWelcomeNotification(updatedUserDetail);
        res.json({
            data:userSvc.getUserPublicProfile(updatedUserDetail),
            message:"your account activated",
            status:"ACTIVATION_SUCCESS",
            options: null
        })

       }catch(exception){
        next(exception)
       }
    };

  async loginUser(req, res, next) {
    try {
      
      const { email, password } = req.body;
      const result = await authSvc.login({ email, password, ip: req.ip });
      res.json({
        data: result,
        message: "Login successful",
        status: "OK",
      });
    } catch (exception) {
      next(exception);
    }
  }

  async logoutUser(req, res, next) {
    try {
      const user = req.loggedInUser;
      await authSvc.revokeSession(user._id, req.sessionId || null);

      res.json({
        message: "Logged out successfully",
        status: "OK",
        options: null
      });
    } catch (exception) {
      next(exception);
    }
  }


  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authSvc.refreshTokens(refreshToken);

      res.json({
        data: result.user, 
        tokens: result.tokens,
        message: "Token refreshed",
        status: "OK",
        options: null
      });
    } catch (exception) {
      next(exception);
    }
  }
  async forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authSvc.forgotPassword(email);
    res.status(200).json({
      message: result.message,
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
}

async resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await authSvc.resetPassword(token, password);
    res.status(200).json({
      message: result.message,
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
}


}

const authCtrl = new AuthController();
module.exports = authCtrl;
