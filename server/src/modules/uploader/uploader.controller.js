const cloudinarySvc = require("../../services/cloudinary.service");
const uploaderSvc = require("./uploader.service");

class UploaderController {
  async getProfile(req, res, next) {
    try {
      const profile = await uploaderSvc.getProfile(req.loggedInUser._id);
      if (!profile) throw { status: 404, message: "Profile not found" };
      res.json({ data: profile, message: "Profile retrieved", status: "OK" });
    } catch (err) {
      next(err);
    }
  }
  async getAllProfiles(req, res, next) {
    try {
      if (req.loggedInUser.role !== "admin")
        throw { status: 403, message: "Access denied: Only admin can view all uploads" };

      const { page = 1, limit = 10, role, search } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (role) filter.role = role.toLowerCase();

      
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $or: [
            { "userId.name": { $regex: search, $options: "i" } },
            { "userId.email": { $regex: search, $options: "i" } }
          ]
        };
      }

      const { data, total } = await uploaderSvc.getAllProfiles({
        filter,
        searchQuery,
        skip,
        limit: parseInt(limit),
      });

      res.json({
        data:{data,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
        message: "All profiles retrieved successfully",
        status: "OK",
      });
    } catch (err) {
      next(err);
    }
  }
  async updateProfile(req, res, next) {
    try {
      const role = req.loggedInUser.role;
      if (role === "admin") {
        return res.status(403).json({
          status: "FORBIDDEN",
          message: "Admin cannot update company or student details"
        });
      }

      let filesData = {};

     
      if (role === "student") {
        if (req.files.avatar && req.files.avatar[0]) {
          const avatar = await cloudinarySvc.fileUpload(req.files.avatar[0].path, "skilllink/avatars");
          filesData.avatar = { original: avatar.url, optimized: avatar.optimizedUrl };
        }
        if (req.files.resume && req.files.resume[0]) {
          const resume = await cloudinarySvc.fileUpload(req.files.resume[0].path, "skilllink/resumes");
          filesData.resume = { original: resume.url, optimized: resume.optimizedUrl };
        }
      }

     
      if (role === "employer") {
        if (req.files.companyLogo && req.files.companyLogo[0]) {
          const logo = await cloudinarySvc.fileUpload(req.files.companyLogo[0].path, "skilllink/logos");
          filesData.companyLogo = { original: logo.url, optimized: logo.optimizedUrl };
        }
        if (req.files.companyDocs && req.files.companyDocs[0]) {
          const docs = await cloudinarySvc.fileUpload(req.files.companyDocs[0].path, "skilllink/docs");
          filesData.companyDocs = { original: docs.url, optimized: docs.optimizedUrl };
        }
      }

      const profile = await uploaderSvc.createOrUpdateProfile(
        req.loggedInUser._id,
        role,
        { ...req.body, ...filesData }
      );

      res.json({ data: profile, message: "Profile updated successfully", status: "OK" });
    } catch (err) {
      next(err);
    }
  }

  async deleteProfile(req, res, next) {
    try {
      const role = req.loggedInUser.role;

      if (role === "admin")
        throw { status: 400, message: "Admin does not have a profile to delete" };

      const deleted = await uploaderSvc.deleteProfile(req.loggedInUser._id);
      if (!deleted)
        throw { status: 404, message: "Profile not found or already deleted" };

      res.json({ message: "Profile deleted successfully", status: "OK" });
    } catch (err) {
      next(err);
    }
  }
  async adminDeleteProfile(req, res, next) {
    try {
      if (req.loggedInUser.role !== "admin")
        throw { status: 403, message: "Access denied: Only admin can delete profiles" };

      const { userId } = req.params;

      const profile = await uploaderSvc.getProfile(userId);
      if (!profile) throw { status: 404, message: "Profile not found" };

      
      const deletePromises = [];

      if (profile.avatar?.original)
        deletePromises.push(cloudinarySvc.deleteFile(profile.avatar.original));

      if (profile.resume?.original)
        deletePromises.push(cloudinarySvc.deleteFile(profile.resume.original));

      if (profile.companyLogo?.original)
        deletePromises.push(cloudinarySvc.deleteFile(profile.companyLogo.original));

      if (profile.companyDocs?.original)
        deletePromises.push(cloudinarySvc.deleteFile(profile.companyDocs.original));

      await Promise.all(deletePromises);

      
      await uploaderSvc.deleteProfile(userId);

      res.json({ message: "Profile deleted successfully by admin", status: "OK" });
    } catch (err) {
      next(err);
    }
  }
}
const uploaderCtrl = new UploaderController();

module.exports = uploaderCtrl