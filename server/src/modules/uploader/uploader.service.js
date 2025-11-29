const UploaderModel = require("./uploader.model");

class UploaderService {
  async createOrUpdateProfile(userId, role, data) {
    const existing = await UploaderModel.findOne({ userId });

    if (existing) {
      Object.assign(existing, { ...data, role });
      return await existing.save();
    } else {
      const profile = new UploaderModel({ userId, role, ...data });
      return await profile.save();
    }
  }

  async getAllProfiles({ filter = {}, searchQuery = {}, skip = 0, limit = 10 }) {
 
    const baseAggregate = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      { $match: { ...filter, ...searchQuery } }, 
    ];


    const totalAgg = await UploaderModel.aggregate([
      ...baseAggregate,
      { $count: "total" },
    ]);
    const total = totalAgg[0]?.total || 0;


    const data = await UploaderModel.aggregate([
      ...baseAggregate,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return { data, total };
  }


  async getProfile(userId) {
    return await UploaderModel.findOne({ userId });
  }

  async deleteProfile(userId) {
    return await UploaderModel.findOneAndDelete({ userId });
  }
}
const uploaderSvc = new UploaderService();
module.exports = uploaderSvc
