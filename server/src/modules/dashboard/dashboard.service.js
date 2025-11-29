// src/modules/dashboard/dashboard.service.js
const ApplicationModel = require("../application/application.model");
const PaymentModel = require("../payment/payment.model");
const ReviewModel = require("../review/review.model");
const GigModel = require("../gig/gig.model");
const UserModel = require("../user/user.model");

class DashboardService {
    
    async getStudentDashboard(studentId) {
        const applications = await ApplicationModel.find({ student: studentId }).lean();

        const totalApplications = applications.length;
        const applicationsPending = applications.filter(app => app.status.toLowerCase() === "pending").length;
        const applicationsAccepted = applications.filter(app => app.status.toLowerCase() === "accepted").length;
        const applicationsRejected = applications.filter(app => app.status.toLowerCase() === "rejected").length;
        const applicationsCompleted = applications.filter(app => app.status.toLowerCase() === "completed").length;
        const applicationsPaid = applications.filter(app => app.status === "PAID").length;

        const payments = await PaymentModel.find({ student: studentId, status: "SUCCESS" }).lean();
        const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        const reviews = await ReviewModel.find({ reviewee: studentId, status: "VISIBLE" }).lean();
        const averageRating = reviews.length
            ? Number((reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(2))
            : null;

        
        const gigIds = applications.map(a => a.gig);
        const gigs = await GigModel.find({ _id: { $in: gigIds } }).lean();
        const gigMap = gigs.reduce((acc, g) => ({ ...acc, [g._id]: g }), {});

        const appliedGigsByCategory = {};
        applications.forEach(app => {
            const gig = gigMap[app.gig];
            if (gig?.category) {
                appliedGigsByCategory[gig.category] = (appliedGigsByCategory[gig.category] || 0) + 1;
            }
        });

        return {
            totalApplications,
            applicationsPending,
            applicationsAccepted,
            applicationsRejected,
            applicationsCompleted,
            applicationsPaid,
            totalEarnings,
            averageRating,
            appliedGigsByCategory
        };
    }
     async getEmployerDashboard(employerId) {
    const gigs = await GigModel.find({ employer: employerId }).lean();
    const totalGigs = gigs.length;
    const activeGigs = gigs.filter(g => g.status === "active").length;

    const gigIds = gigs.map(g => g._id);
    const applications = await ApplicationModel.find({ gig: { $in: gigIds } }).lean();
    const applicationsByStatus = {
      pending: applications.filter(a => a.status.toLowerCase() === "pending").length,
      accepted: applications.filter(a => a.status.toLowerCase() === "accepted").length,
      rejected: applications.filter(a => a.status.toLowerCase() === "rejected").length,
      completed: applications.filter(a => a.status.toLowerCase() === "completed").length,
      paid: applications.filter(a => a.status === "PAID").length
    };

    const payments = await PaymentModel.find({ gig: { $in: gigIds }, status: { $in: ["PAID","SUCCESS"] } }).lean();
    const totalPayout = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const reviews = await ReviewModel.find({ reviewer: employerId }).lean();
    const averageStudentRating = reviews.length ? 
      (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(2) 
      : null;

    const topCategories = {};
    for (const g of gigs) {
      if (g.category) topCategories[g.category] = (topCategories[g.category] || 0) + 1;
    }

    return {
      totalGigs,
      activeGigs,
      applicationsReceived: applications.length,
      applicationsByStatus,
      totalPayout,
      averageStudentRating,
      topCategories
    };
  }


  async getAdminDashboard() {
    
    const [totalStudents, totalEmployers, gigs, applications, payments] = await Promise.all([
      UserModel.countDocuments({ role: "student", isDeleted: false, isBlocked: false }),
      UserModel.countDocuments({ role: "employer", isDeleted: false, isBlocked: false }),
      GigModel.find().lean(),
      ApplicationModel.find().lean(),
      PaymentModel.find({ status: { $in: ["PAID","SUCCESS"] } }).lean()
    ]);

  
    const activeGigs = gigs.filter(g => g.status === "active").length;

   
    const applicationsByStatus = {
      pending: applications.filter(a => a.status.toLowerCase() === "pending").length,
      accepted: applications.filter(a => a.status.toLowerCase() === "accepted").length,
      rejected: applications.filter(a => a.status.toLowerCase() === "rejected").length,
      completed: applications.filter(a => a.status.toLowerCase() === "completed").length,
      paid: applications.filter(a => a.status === "PAID").length
    };

    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  
    const reviewsWithRole = await ReviewModel.find()
      .populate({ path: "reviewee", select: "role" })
      .lean();

    const studentReviews = reviewsWithRole.filter(r => r.reviewee && r.reviewee.role === "student");
    const employerReviews = reviewsWithRole.filter(r => r.reviewee && r.reviewee.role === "employer");

    const averageStudentRating = studentReviews.length
      ? (studentReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / studentReviews.length).toFixed(2)
      : null;

    const averageEmployerRating = employerReviews.length
      ? (employerReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / employerReviews.length).toFixed(2)
      : null;

    
    const topCategories = {};
    for (const g of gigs) {
      if (g.category) topCategories[g.category] = (topCategories[g.category] || 0) + 1;
    }

    return {
      totalStudents,
      totalEmployers,
      totalGigs: gigs.length,
      activeGigs,
      totalApplications: applications.length,
      applicationsByStatus,
      totalPayments,
      averageStudentRating,
      averageEmployerRating,
      topCategories
    };
  }
}


const dashboardSvc = new DashboardService();
module.exports = dashboardSvc;
