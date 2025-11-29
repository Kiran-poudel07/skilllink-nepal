const publicSvc = require("./public.service");

class PublicController {

  async getEmployers(req, res) {
    try {
      const { name,companyName, category, page, limit, sort } = req.query;
      const result = await publicSvc.getEmployers({ name,companyName, category, page, limit, sort });
      res.status(200).json({
        status: "success",
        data: result.employers,
        page: result.page,
        limit: result.limit,
        total: result.total
      });
    } catch (error) {
      console.error("PublicController.getEmployers:", error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  }

  
  async getStats(req, res) {
    try {
      const stats = await publicSvc.getStats();
      res.status(200).json({ status: "success", data: stats });
    } catch (error) {
 
      res.status(500).json({ status: "error", message: "Server error" });
    }
  }
}
const publicCtrl = new PublicController();
module.exports = publicCtrl
