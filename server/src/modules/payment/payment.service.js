const PaymentModel = require("./payment.model");
const GigModel = require("../gig/gig.model");
const ApplicationModel = require("../application/application.model");
const NotificationService = require("../notification/notification.service");
const fetch = require("node-fetch");
const { AppConfig } = require("../../config/config")

class PaymentService {

  async initiateKhaltiPayment(employer, data) {
    const gig = await GigModel.findById(data.gigId);
    if (!gig) throw { statusCode: 404, message: "Gig not found" };

    const application = await ApplicationModel.findById(data.applicationId).populate("student");
    if (!application) throw { statusCode: 404, message: "Application not found" };

   
    if (application.status !== "completed") {
      throw { statusCode: 400, message: "Payment can only be initiated for completed applications" };
    }

    const student = application.student;

    
    const existingPayment = await PaymentModel.findOne({
      application: application._id,
      status: { $in: ["PENDING", "SUCCESS", "PAID"] }
    });

    if (existingPayment) {
      throw { statusCode: 400, message: "This application is already paid or payment is in progress" };
    }

    const amountInPaisa = data.amount * 100;

    const response = await fetch(`${AppConfig.khaltiBaseUrl}epayment/initiate/`, {
      method: "POST",
      headers: {
        Authorization: `Key ${AppConfig.khaltiSecretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        return_url: `${AppConfig.frontendUrl}/employer/khalti-success`,
        website_url: AppConfig.frontendUrl,
        amount: amountInPaisa,
        purchase_order_id: gig._id.toString(),
        purchase_order_name: gig.title
      })
    });

    const result = await response.json();

 
    await PaymentModel.create({
      employer: employer._id,
      student: student._id,
      gig: gig._id,
      application: application._id,
      amount: data.amount,
      txnId: result.pidx || "TEMP_" + Date.now(),
      status: "PENDING",
      rawData: result
    });

    return result;
  }



  async verifyKhaltiPayment(employerId, payload) {
    const lookupRes = await fetch(`${AppConfig.khaltiBaseUrl}epayment/lookup/`, {
      method: "POST",
      headers: {
        Authorization: `Key ${AppConfig.khaltiSecretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ pidx: payload.pidx })
    });

    const verified = await lookupRes.json();

    if (verified.status !== "Completed") {
      throw { statusCode: 400, message: "Payment verification failed" };
    }

    const existingPayment = await PaymentModel.findOne({ txnId: verified.pidx }).populate("student employer");
    if (!existingPayment) throw { statusCode: 404, message: "Transaction not found" };

    existingPayment.status = "SUCCESS";
    existingPayment.rawData = verified;
    await existingPayment.save();

    await NotificationService.createNotification({
      recipient: existingPayment.student._id,
      title: "Payment Received",
      message: ` You have received payment of Rs. ${existingPayment.amount} for "${verified.purchase_order_name}"`,
      type: "PAYMENT_RECEIVED"
    });

    await NotificationService.createNotification({
      recipient: existingPayment.employer._id,
      title: "Payment Sent",
      message: ` Payment of Rs. ${existingPayment.amount} sent successfully to student`,
      type: "PAYMENT_SUCCESS"
    });

    await ApplicationModel.findByIdAndUpdate(existingPayment.application, { status: "PAID" });

    return existingPayment;
  }
  async getAllPaymentsForAdmin(query) {
  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  let filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.q) {
    filter.$or = [
      { txnId: { $regex: query.q, $options: "i" } },
      { remarks: { $regex: query.q, $options: "i" } }
    ];
  }

  const data = await PaymentModel.find(filter)
    .populate("employer", "name email")
    .populate("student", "name email")
    .populate("gig", "title")
    .populate("application", "status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await PaymentModel.countDocuments(filter);

  return {
    data,
    total,
    page,
    limit
    
  };
}


  async getPaymentsForEmployer(userId) {
    return PaymentModel.find({ employer: userId })
      .populate("student gig", "name title")
      .sort({ createdAt: -1 });
  }

  async getPaymentsForStudent(userId) {
    return PaymentModel.find({ student: userId })
      .populate("employer gig", "name title")
      .sort({ createdAt: -1 });
  }
}
const paymentSvc = new PaymentService();
module.exports = paymentSvc
