const applicationSvc = require("./application.service");
const UploaderModel = require("../uploader/uploader.model")

class ApplicationController {
  async createApplication(req, res, next) {
    try {
      const user = req.loggedInUser;

      const uploaderData = await UploaderModel.findOne({ userId: user._id }).select("resume portfolioLinks");

      const resumeUrls = uploaderData?.resume || {};
      const portfolioLinks = uploaderData?.portfolioLinks || [];

      const application = await applicationSvc.createApplication(
        user._id,
        req.body,
        resumeUrls,
        portfolioLinks
      );

      const responseData = {
        ...application.toObject(),
        resume: {
          original: resumeUrls.original || null,
          optimized: resumeUrls.optimized || null,
        },
        portfolioLinks,
      };

      res.json({
        status: "success",
        message: "Application submitted",
        data: responseData,
      });
    } catch (err) {
      next(err);
    }
  }
  async updateStatus(req, res, next) {
    try {
      console.log("employer id", req.loggedInUser._id)
      const employerId = req.loggedInUser._id;
      const application = await applicationSvc.updateStatus(req.params.id, employerId, req.body.status);
      res.json({ status: "success", message: "Application status updated", data: application });
    } catch (err) {
      next(err);
    }
  }

async getStudentApplications(req, res, next) {
  try {
    const studentId = req.loggedInUser._id;
    const { search, gigId, page, limit, appliedAt } = req.query;

    const result = await applicationSvc.getApplicationsForStudent(studentId, {
      search,
      gigId,
      page,
      limit,
      appliedAt,
    });

    res.json({
      status: "success",
      data: {
        applications: result.applications,
        meta: result.meta,
      },
    });
  } catch (err) {
    next(err);
  }
}
  async getEmployerApplications(req, res, next) {
    try {
      const employerId = req.loggedInUser._id;
      const {
        page = 1,
        limit = 10,
        search = "",
        status = "",
        sort = "latest",
      } = req.query;

      const result = await applicationSvc.getApplicationsForEmployer(
        employerId,
        page,
        limit,
        search,
        status,
        sort
      );

      res.json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }


  async getAllApplications(req, res, next) {
    try {
      const user = req.loggedInUser;

      if (!["admin", "super"].includes(user.role)) {
        return res.status(403).json({
          status: "FORBIDDEN",
          message: "Only admin or super admin can view all applications",
        });
      }

      const { page = 1, limit = 10, status, search } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (status) filter.status = status;

      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { "student.name": { $regex: search, $options: "i" } },
            { "student.email": { $regex: search, $options: "i" } },
            { "gig.title": { $regex: search, $options: "i" } }
          ]
        };
      }

      const { data, total } = await applicationSvc.getAllApplications({
        filter,
        searchQuery,
        skip,
        limit: parseInt(limit),
      });

      res.json({
        status: "success",
        message: "All applications retrieved successfully",
        data:{data,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      }
      });
    } catch (err) {
      next(err);
    }
  }


  async getApplicationById(req, res, next) {
    try {
      const data = await applicationSvc.getApplicationById(req.params.id, req.loggedInUser);
      res.json({ status: "success", data:{ data} });
    } catch (err) {
      next(err);
    }
  }

  async deleteApplication(req, res, next) {
    try {
      const application = await applicationSvc.deleteApplication(req.params.id, req.loggedInUser._id);
      res.json({ status: "success", message: "Application deleted" });
    } catch (err) {
      next(err);
    }
  }
}


const applicationCtrl = new ApplicationController();
module.exports = applicationCtrl

