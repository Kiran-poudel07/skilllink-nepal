const gigSvc = require("./gig.service")
const cloudinarySvc = require("../../services/cloudinary.service");

class GigController {

  async createGig(req, res, next) {
    try {
      let attachments = [];
      if (req.files && req.files.length) {
        attachments = await cloudinarySvc.uploadGigFiles(req.files, req.loggedInUser._id);
      }

      const data = { ...req.body, employer: req.loggedInUser._id, attachments };
      const gig = await gigSvc.createGig(data);
      res.json({ status: "success", message: "Gig created successfully", data: gig });
    } catch (err) {
      next(err);
    }
  }

  async updateGig(req, res, next) {
    try {
      let attachments = req.body.attachments || [];
      if (req.files && req.files.length) {
        const uploaded = await cloudinarySvc.uploadGigFiles(req.files, req.loggedInUser._id);
        attachments = attachments.concat(uploaded);
      }

      const data = { ...req.body, attachments };
      const gig = await gigSvc.updateGig(req.params.id, data);
      res.json({ status: "success", message: "Gig updated successfully", data: gig });
    } catch (err) {
      next(err);
    }
  }

  async deleteGig(req, res, next) {
    try {
      await gigSvc.deleteGig(req.params.id);
      res.json({ status: "success", message: "Gig deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
    async getMyGigs(req, res, next) {
    try {
      const employerId = req.loggedInUser._id;
      const {
        page = 1,
        limit = 10,
        search,
        status,
        category,
        minBudget,
        maxBudget,
        isDeleted,
      } = req.query;

      
      const filters = {
        employerId,
        search,
        status,
        category,
        minBudget,
        maxBudget,
        isDeleted,
        page: Number(page),
        limit: Number(limit),
      };

      const result = await gigSvc.getMyGigs(filters);

      res.json({
        status: "success",
        message: "Your gigs fetched successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }


  async getGigById(req, res, next) {
    try {
      const gig = await gigSvc.getGigById(req.params.id);
      res.json({ status: "success", message: "Gig details", data: {gig} });
    } catch (err) {
      next(err);
    }
  }

  async getGigs(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const gigsData = await gigSvc.getGigs(req.query);

      res.json({
        status: "success",
        message: "All active gigs",
        data: {
          gigs: gigsData.gigs,
          total: gigsData.total,
          page: Number(page),
          limit: Number(limit),
          
        }
      });
    } catch (err) {
      next(err);
    }
  }
  async getAllGigsAdmin(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      category,
      minBudget,
      maxBudget,
      employer,
      isDeleted
    } = req.query;

    const filters = {
      page: Number(page),
      limit: Number(limit),
      search,
      status,
      category,
      minBudget,
      maxBudget,
      employer,
      isDeleted
    };

    const result = await gigSvc.getAllGigsAdmin(filters);

    res.json({
      data: {data:result},
      status: "success",
      message: "All gigs fetched for admin",
      
    });
  } catch (err) {
    next(err);
  }
}
async adminUpdateGig(req, res, next) {
  try {
    const gigId = req.params.id;
    const actorId = req.loggedInUser._id;
    const actorIp = req.ip;

    const { action, reason, ...updateFields } = req.body; 
    

    const result = await gigSvc.adminUpdateGig(actorId, gigId, updateFields, action, reason, actorIp);

    res.json({
      status: "success",
      message: result.message,
      data: result.gig
    });

  } catch (err) {
    next(err);
  }
}
  async changeStatus(req, res, next) {
    try {
      const gig = await gigSvc.changeStatus(req.params.id, req.body.status);
      res.json({ status: "success", message: "Gig status updated", data: gig });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GigController();
