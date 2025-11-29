const notificationSvc = require("../notification/notification.service");
const GigModel = require("./gig.model");
class GigService {

  async createGig(data) {
    const gig = new GigModel(data);
    return await gig.save();
  }

  async updateGig(id, data) {
    return await GigModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteGig(id) {
    return await GigModel.findByIdAndDelete(id);
  }

  async getGigById(id) {
    return await GigModel.findById(id)
      .populate("employer", "name email companyName");
  }
  async getMyGigs({
    employerId,
    search,
    status,
    category,
    minBudget,
    maxBudget,
    isDeleted,
    page,
    limit,
  }) {
    const query = { employer: employerId };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    if (isDeleted !== undefined) {
      query.isDeleted = isDeleted === "true";
    }

    const skip = (page - 1) * limit;

    const [gigs, total] = await Promise.all([
      GigModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      GigModel.countDocuments(query),
    ]);

    return {
      gigs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  async getGigs(query) {

    const filter = { status: "active", isDeleted: false };


    if (query.category) filter.category = query.category;
    if (query.skills) filter.requiredSkills = { $in: query.skills.split(",") };
    if (query.minBudget) filter.budget = { $gte: Number(query.minBudget) };
    if (query.maxBudget) filter.budget = { ...filter.budget, $lte: Number(query.maxBudget) };

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const gigs = await GigModel.find(filter)
      .populate("employer", "name companyName email") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const validGigs = gigs.filter(gig => gig.employer != null);

    const total = await GigModel.countDocuments(filter);

    return {
      total,
      page,
      limit,
      gigs: validGigs,
    };
  }
 async getAllGigsAdmin({
  page,
  limit,
  search,
  status,
  category,
  minBudget,
  maxBudget,
  employer,
  isDeleted
}) {
  const query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (status) {
    query.status = status;
  }

  
  if (category) {
    query.category = category;
  }

  if (employer) {
    query.employer = employer;
  }

  if (minBudget || maxBudget) {
    query.budget = {};
    if (minBudget) query.budget.$gte = Number(minBudget);
    if (maxBudget) query.budget.$lte = Number(maxBudget);
  }

  if (isDeleted !== undefined) {
    query.isDeleted = isDeleted === "true";
  }

  const skip = (page - 1) * limit;

  const [gigs, total] = await Promise.all([
    GigModel.find(query)
      .populate("employer", "name email companyName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    GigModel.countDocuments(query)
  ]);

  return {
    gigs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async adminUpdateGig(actorId, gigId, updateFields = {}, action = null, reason = "", actorIp = null) {
  const gig = await GigModel.findById(gigId);
  if (!gig) throw { statusCode: 404, message: "Gig not found" };

  let message = "";
  let actionPerformed = false;

  if (gig.isDeleted && action !== "RESTORE") {
    throw { statusCode: 400, message: "Cannot perform action on a deleted gig" };
  }

  if (Object.keys(updateFields).length > 0) {
    Object.assign(gig, updateFields);
    await gig.save();
    message = "Gig details updated successfully";
    actionPerformed = true;
  }

  if (action) {
    const act = action.toUpperCase();

    switch (act) {
      case "PAUSE":
        if (gig.status === "inactive") {
          throw { statusCode: 400, message: "Gig is already paused" };
        }
        gig.status = "inactive";
        message = "Gig paused successfully";
        actionPerformed = true;
        break;

      case "UNPAUSE":
      case "ACTIVE":
        if (gig.status === "active") {
          throw { statusCode: 400, message: "Gig is already active" };
        }
        gig.status = "active";
        message = "Gig unpaused successfully";
        actionPerformed = true;
        break;

      case "CLOSE":
        if (gig.status === "closed") {
          throw { statusCode: 400, message: "Gig is already closed" };
        }
        gig.status = "closed";
        message = "Gig closed successfully";
        actionPerformed = true;
        break;

      case "DELETE":
        if (gig.isDeleted) {
          throw { statusCode: 400, message: "Gig is already deleted" };
        }
        gig.isDeleted = true;
        message = "Gig deleted successfully";
        actionPerformed = true;
        break;

        case "RESTORE":
        const deletedGig = await GigModel.findOne({ _id: gigId });
        if (!deletedGig) throw { statusCode: 404, message: "Gig not found" };

        if (!deletedGig.isDeleted) {
          throw { statusCode: 400, message: "Gig is not deleted" };
        }

        deletedGig.isDeleted = false;
        await deletedGig.save();
        message = "Gig restored successfully";
        actionPerformed = true;
        break;

        if (!gig.isDeleted) {
          throw { statusCode: 400, message: "Gig is not deleted" };
        }
        gig.isDeleted = false;
        message = "Gig restored successfully";
        actionPerformed = true;
        break;

      default:
        throw { statusCode: 400, message: "Invalid action" };
    }

    if (actionPerformed) {
      await gig.save();
    }
  }

  if (actionPerformed) {
    await notificationSvc.createNotification({
      recipient: gig.employer,
      sender: actorId,
      type: "gig_moderation",
      title: `Your gig "${gig.title}" was updated`,
      message: reason || `Admin performed ${action || "edit"} on your gig.`,
      gig: gig._id
    });
  }

  return { message, gig };
}

  async changeStatus(id, status) {
    return await GigModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}
const gigSvc = new GigService();
module.exports = gigSvc
