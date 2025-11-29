require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserService = require('../modules/user/user.service');


const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'other ';

const auth = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";

      const parts = authHeader.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return next({ statusCode: 401, message: "Unauthorized", status: "AUTH_FAILED" });
      }

      const token = parts[1];
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      const user = await UserService.getCurrentUser(decoded.id); 
      if (!user) return next({ statusCode: 401, message: "User not found", status: "AUTH_FAILED" });

      if (allowedRoles.length && !allowedRoles.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
        return next({ statusCode: 403, message: "Forbidden", status: "ACCESS_DENIED" });
      }

      req.loggedInUser = user; 
      next();
    } catch (error) {
      next({ statusCode: 401, message: "Invalid or expired token", status: "AUTH_FAILED" });
    }
  };
};

/**
 * @param {MongooseModel} model 
 * @param {string} ownerField 
 */
// console.log(" ACCESS_TOKEN_SECRET used in auth:", ACCESS_TOKEN_SECRET);

const verifyOwnership = (model, ownerField = "employer") => {
  return async (req, res, next) => {
    try {
      const doc = await model.findById(req.params.id);
      if (!doc) return res.status(404).json({ status: "error", message: "Resource not found" });
      
      if (!doc[ownerField].equals(req.loggedInUser._id)) {
        return res.status(403).json({ status: "error", message: "You do not have permission to modify this resource" });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};


module.exports = {
  auth,
  verifyOwnership
};
