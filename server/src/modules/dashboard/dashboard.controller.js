const dashboardSvc = require("./dashboard.service");

class DashboardController {
  async getStudentDashboard(req, res, next) {
    try {
      const studentId = req.loggedInUser._id;

      const dashboardData = await dashboardSvc.getStudentDashboard(studentId);

      res.json({ status: "success", data: dashboardData });
    } catch (err) {
      next(err);
    }
  }
  async getEmployerDashboard(req, res, next) {
    try {
      const employerId = req.loggedInUser._id;
      const data = await dashboardSvc.getEmployerDashboard(employerId);
      res.json({ status: "success", data });
    } catch (err) {
      next(err);
    }
  }

  async getAdminDashboard(req, res, next) {
    try {
      const data = await dashboardSvc.getAdminDashboard();
      res.json({ status: "success", data });
    } catch (err) {
      next(err);
    }
  }
}

const dashboardCtrl = new DashboardController();
module.exports = dashboardCtrl;
