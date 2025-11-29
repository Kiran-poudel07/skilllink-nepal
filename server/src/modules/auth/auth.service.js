const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SessionModel = require("./session.model");
const UserService = require("../user/user.service");
const cloudinarySvc = require("../../services/cloudinary.service");
const { Status } = require("../../config/constant");
const { randomStringGenerate } = require("../../utilites/helper");
require("dotenv").config();
const crypto = require("crypto");
const UserModel = require("../user/user.model");
const { AppConfig } = require("../../config/config");
const authNotificationEmailSvc = require("../../mail/auth.email");


const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "change_this_secret";
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "change_refresh_secret";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

class AuthService {
  async transformRegisterUser(req) {
    try {
      const data = req.body;
      if (req.file) {
        try {
          data.image = await cloudinarySvc.fileUpload(req.file.path, "profile/");
        } catch {
          throw { statusCode: 400, message: "Image upload failed" };
        }
      }

      data.password = await bcrypt.hash(data.password, 12);
      data.status = Status.INACTIVE
      data.activationToken = randomStringGenerate(50)
      return data;
    } catch (exception) {
      throw exception;
    }
  }

  async login({ email, password, ip }) {
    try {
      const user = await UserService.getByEmail(email);

      if (!user)
        throw { statusCode: 401, message: "Invalid credentials", status: "AUTH_FAILED" };

      if (user.isDeleted)
        throw { statusCode: 403, message: "Your account has been deleted. Please contact support." };

      if (user.isBlocked)
        throw { statusCode: 403, message: "Your account has been blocked by the admin. Please contact support." };

      if (user.status !== "active")
        throw { statusCode: 403, message: "Your account is not active. Please verify your email or contact support." };

      const matched = await bcrypt.compare(password, user.password);
      if (!matched)
        throw { statusCode: 401, message: "Invalid credentials", status: "AUTH_FAILED" };

      const payload = { id: user._id, role: user.role, email: user.email };
      const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });

      const session = new SessionModel({
        user: user._id,
        accessToken: {
          actual: accessToken,
          masked: accessToken.substr(0, 10) + "...",
        },
        refreshToken: {
          actual: refreshToken,
          masked: refreshToken.substr(0, 10) + "...",
        },
        userSessionData: JSON.stringify({ ip }),
      });
      const saved = await session.save();

      const safeUser = await UserService.getCurrentUser(user._id);

      return {
        user: safeUser,
        tokens: {
          accessToken,
          refreshToken,
          sessionId: saved._id,
        },
      };
    } catch (exception) {
      throw exception;
    }
  }

  async revokeSession(userId, sessionId) {
    if (!sessionId) return await SessionModel.deleteMany({ user: userId });
    return await SessionModel.deleteOne({ _id: sessionId, user: userId });
  }

  async refreshTokens(refreshToken) {
    try {
      if (!refreshToken) throw { statusCode: 401, message: "Refresh token missing", status: "AUTH_FAILED" };

      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const userId = decoded.id;

      const user = await UserService.getCurrentUser(userId);
      if (!user) throw { statusCode: 401, message: "Invalid refresh token", status: "AUTH_FAILED" };

      const payload = { id: user._id, role: user.role, email: user.email };
      const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
      const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

      const session = new SessionModel({
        user: user._id,
        accessToken: { actual: accessToken, masked: accessToken.substr(0, 10) + '...' },
        refreshToken: { actual: newRefreshToken, masked: newRefreshToken.substr(0, 10) + '...' }
      });
      await session.save();

      return {
        user, 
        tokens: { accessToken, refreshToken: newRefreshToken }
      };
    } catch (exception) {
      if (exception.name === 'TokenExpiredError' || exception.name === 'JsonWebTokenError') {
        throw { statusCode: 401, message: "Invalid or expired refresh token", status: "AUTH_FAILED" };
      }
      throw exception;
    }
  }
  async forgotPassword(email) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw { statusCode: 404, message: "No user found with this email" };
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = tokenExpiry;
      await user.save();

      const resetLink = `${AppConfig.frontendUrl}/reset-password/${resetToken}`;
      await authNotificationEmailSvc.sendPasswordResetNotification(user, resetLink);
      
      return { message: "Password reset email has been sent to your inbox." };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token, password) {
    try {
      const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw { statusCode: 400, message: "Invalid or expired reset token" };
      }

      user.password = await bcrypt.hash(password, 12);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return { message: "Password has been successfully reset." };
    } catch (error) {
      throw error;
    }
  }
}

const authSvc = new AuthService();
module.exports = authSvc;
