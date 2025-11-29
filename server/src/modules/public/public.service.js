const GigModel = require("../gig/gig.model");
const UserModel = require("../user/user.model");
const UploaderModel = require("../uploader/uploader.model"); 

class PublicService {

  async getEmployers({ name,companyName, category, page = 1, limit = 10, sort }) {
    const query = {
      role: "employer",
      status: "active",
      isDeleted: false,
      isBlocked: false
    };

    if (name | companyName) {
      query.name = { $regex: name, $options: "i" }; 
      query.companyName = { $regex: companyName, $options: "i" };
    }


    const skip = (page - 1) * limit;
    const sortOption = sort === "alphabetical" ? {companyName: 1, name: 1 } : { createdAt: -1 };

    const [total, users] = await Promise.all([
      UserModel.countDocuments(query),
      UserModel.find(query)
        .select("name email _id")
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sortOption)
        .lean()
    ]);


    const employersWithDetails = await Promise.all(
      users.map(async (user) => {
        const profile = await UploaderModel.findOne({ userId: user._id })
          .select("companyName companyDescription companyAddress contactInfo companyLogo companyDocs category")
          .lean();


        if (category && profile?.category !== category) return null;

        const totalGigs = await GigModel.countDocuments({ employer: user._id });

        return profile
          ? {
              _id: user._id,
              name: user.name,
              email: user.email,
              companyName: profile.companyName,
              companyDescription: profile.companyDescription,
              companyAddress: profile.companyAddress,
              contactInfo: profile.contactInfo,
              companyLogo: profile.companyLogo,
              companyDocs: profile.companyDocs,
              category: profile.category || null,
              totalGigs
            }
          : null;
      })
    );

    const filteredEmployers = employersWithDetails.filter(Boolean);

    return {
      total: filteredEmployers.length,
      page: parseInt(page),
      limit: parseInt(limit),
      employers: filteredEmployers
    };
  }


  async getStats() {
    const [totalGigs, activeGigs, totalStudents, totalEmployers] = await Promise.all([
      GigModel.countDocuments(),
      GigModel.countDocuments({ status: "active" }),
      UserModel.countDocuments({ role: "student", isDeleted: false, isBlocked: false }),
      UserModel.countDocuments({ role: "employer", status: "active", isDeleted: false, isBlocked: false })
    ]);

    return { totalGigs, activeGigs, totalStudents, totalEmployers };
  }
}

const publicSvc = new PublicService();
module.exports = publicSvc;
