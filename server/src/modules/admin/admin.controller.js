const adminSvc = require("./admin.service");
const isSuperAdmin = (user) => user && user.role && user.role.toLowerCase() === "superadmin";

class AdminController {
  
  async createAdmin(req, res, next) {
    try {
      if (!isSuperAdmin(req.loggedInUser)) {
        return next({ statusCode: 403, message: "Only superadmin can create admin accounts" });
      }
      const actorIp = req.ip || req.headers["x-forwarded-for"] || null;
      const admin = await adminSvc.createAdmin(req.body, req.loggedInUser._id, actorIp);
      const { password, ...safe } = admin.toObject ? admin.toObject() : admin;
      res.status(201).json({ status: "success", data: safe });
    } catch (err) {
      next(err);
    }
  }

  async listUsers(req, res, next) {
    try {
      const result = await adminSvc.listUsers(req.query, req.loggedInUser);
      res.json({ status: "success", data: result.users, meta: result.meta });
    } catch (err) {
      next(err);
    }
  }

  async changeUserStatus(req, res, next) {
    try {
      const actorIp = req.ip || req.headers["x-forwarded-for"] || null;
      const result = await adminSvc.changeUserStatus(req.loggedInUser._id, req.body, actorIp);
      res.json({ status: "success", message: result.message || "done" });
    } catch (err) {
      next(err);
    }
  }

  async actOnGig(req, res, next) {
    try {
      const actorIp = req.ip || req.headers["x-forwarded-for"] || null;
      const result = await adminSvc.actOnGig(req.loggedInUser._id, req.body, actorIp);
      res.json({ status: "success", message: result.message || "done" });
    } catch (err) {
      next(err);
    }
  }

  
  async listPayments(req, res, next) {
    try {
      const result = await adminSvc.listPayments(req.query);
      res.json({ status: "success", data: result.payments, meta: result.meta });
    } catch (err) {
      next(err);
    }
  }

  
  async getAuditLogs(req, res, next) {
    try {
      const result = await adminSvc.getAuditLogs(req.query);
      res.json({ status: "success", data: result.logs, meta: result.meta });
    } catch (err) {
      next(err);
    }
  }
}
const adminCtrl = new AdminController()
module.exports = adminCtrl
