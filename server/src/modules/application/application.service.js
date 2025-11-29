const ApplicationModel = require("./application.model");
const GigModel = require("../gig/gig.model");

class ApplicationService {


  async createApplication(studentId, data, resumeUrls, portfolioLinks) {
    const gig = await GigModel.findById(data.gig);
    if (!gig) throw { statusCode: 404, message: "Gig not found" };
    if (gig.employer.equals(studentId)) throw { statusCode: 400, message: "Cannot apply to your own gig" };
    if(gig.status !== "active") throw {message:"cannot apply to inactive gig"}

    const existing = await ApplicationModel.findOne({ student: studentId, gig: gig._id });
    if (existing) throw { statusCode: 400, message: "You have already applied for this gig" };

    const application = new ApplicationModel({
      student: studentId,
      gig: gig._id,
      proposalMessage: data.proposalMessage,
      expectedRate: data.expectedRate,
      resume: resumeUrls,
      coverLetter: data.coverLetter,
      estimatedDuration: data.estimatedDuration,
      portfolioLink: portfolioLinks.length ? portfolioLinks[0] : null,
    });

    gig.applicationsCount = (gig.applicationsCount || 0) + 1;
    await gig.save();

    return await application.save();
  }


  async updateStatus(applicationId, employerId, status) {
    const application = await ApplicationModel.findById(applicationId).populate("gig");
    if (!application) throw { statusCode: 404, message: "Application not found" };
    if (!application.gig.employer.equals(employerId)) throw { statusCode: 403, message: "Not authorized to update status" };

    application.status = status;
    application.studentRead = false; 
    return await application.save();
  }

async getApplicationsForStudent(studentId, { search, gigId, page = 1, limit = 10, appliedAt }) {
  const query = { student: studentId };

  if (search) {
    query.$or = [{ "gig.category": { $regex: search, $options: "i" } }];
  }

  if (appliedAt) {
    const date = new Date(appliedAt);
    if (!isNaN(date.getTime())) {
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      query.appliedAt = { $gte: start, $lte: end };
    }
  }

  if (gigId) {
    query.gig = gigId;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await ApplicationModel.countDocuments(query);

  const applications = await ApplicationModel.find(query)
    .populate("gig", "title category budget employer")
    .sort({ appliedAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    applications,
    meta: {
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalApplications: total,
    },
  };
}

 async getApplicationsForEmployer(
    employerId,
    page = 1,
    limit = 10,
    search = "",
    status = "",
    sort = "latest"
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const perPage = parseInt(limit);

    const applications = await ApplicationModel.find()
      .populate({
        path: "gig",
        match: { employer: employerId },
        select: "title category budget",
      })
      .populate("student", "name email skills")
      .sort({ appliedAt: -1 }); 

    let filtered = applications.filter((a) => a.gig !== null);

    if (status) {
      filtered = filtered.filter(
        (app) => app.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app._id.toString().includes(searchLower) ||
          app.student?.name?.toLowerCase().includes(searchLower) ||
          app.student?.email?.toLowerCase().includes(searchLower) ||
          app.gig?.title?.toLowerCase().includes(searchLower) ||
          app.gig?.category?.toLowerCase().includes(searchLower)
      );
    }

    if (sort === "latest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
      );
    } else if (sort === "oldest") {
      filtered = filtered.sort(
        (a, b) => new Date(a.appliedAt) - new Date(b.appliedAt)
      );
    } else if (sort === "rate-high") {
      filtered = filtered.sort((a, b) => b.expectedRate - a.expectedRate);
    } else if (sort === "rate-low") {
      filtered = filtered.sort((a, b) => a.expectedRate - b.expectedRate);
    }

    const totalResults = filtered.length;
    const totalPages = Math.ceil(totalResults / perPage);
    const paginated = filtered.slice(skip, skip + perPage);

    return {
      data: paginated,
      pages: {
        page: parseInt(page),
        limit: perPage,
        totalPages,
        totalResults,
      },
    };
  }

  async getApplicationById(id, user) {
    const application = await ApplicationModel.findById(id)
      .populate("gig", "title category employer")
      .populate("student", "name email skills");
    if (!application) throw { statusCode: 404, message: "Application not found" };
    if (user.role === "employer") {
      if (!application.gig || !application.gig.employer) {
        throw { statusCode: 404, message: "Gig or employer not found" };
      }
      if (application.gig.employer.toString() !== user._id.toString()) {
        throw { statusCode: 403, message: "Forbidden" };
      }
    }

    if (user.role === "student" && !application.student.equals(user._id)) {
      throw { statusCode: 403, message: "Forbidden" };
    }

    if (user.role === "employer" && !application.gig.employer.equals(user._id)) {
      throw { statusCode: 403, message: "Forbidden" };
    }

    return application;
  }
  async getAllApplications({ filter = {}, searchQuery = {}, skip = 0, limit = 10 }) {
    const aggregate = [
      {
        $lookup: {
          from: "users",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $lookup: {
          from: "gigs",
          localField: "gig",
          foreignField: "_id",
          as: "gig",
        },
      },
      { $unwind: "$gig" },
      { $match: { ...filter, ...searchQuery } },
      { $sort: { appliedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          "student.password": 0, 
          "student.__v": 0,
          "gig.__v": 0,
        },
      },
    ];

    const data = await ApplicationModel.aggregate(aggregate);
    const total = await ApplicationModel.countDocuments(filter);

    return { data, total };
  }

  async deleteApplication(applicationId, studentId) {
    const application = await ApplicationModel.findById(applicationId);
    if (!application) throw { statusCode: 404, message: "Application not found" };
    if (!application.student.equals(studentId)) throw { statusCode: 403, message: "Cannot delete others application" };

    const gig = await GigModel.findById(application.gig);
    if (gig && gig.applicationsCount > 0) {
      gig.applicationsCount -= 1;
      await gig.save();
    }

    return await ApplicationModel.findByIdAndDelete(applicationId);
  }
}


const applicationSvc = new ApplicationService();
module.exports = applicationSvc
