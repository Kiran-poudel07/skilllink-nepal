const paymentSvc = require("./payment.service");

class PaymentController {
  async initiateKhalti(req, res, next) {
    try {
      const employer = req.loggedInUser;
      const data = await paymentSvc.initiateKhaltiPayment(employer, req.body);
      res.json({ status: "success", message: "Payment initiated via Khalti", data:{data} });
    } catch (err) {
      next(err);
    }
  }

  async verifyKhalti(req, res, next) {
    try {
      const employer = req.loggedInUser;
      const payment = await paymentSvc.verifyKhaltiPayment(employer._id, req.body);
      res.json({ status: "success", message: "Payment verified successfully", data: {payment} });
    } catch (err) {
      next(err);
    }
  }

  async getAllPaymentsAdmin(req, res, next) {
  try {
    const data = await paymentSvc.getAllPaymentsForAdmin(req.query);

    res.json({
      status: "success",
      message: "All payment records fetched",
      data: {data}
    });
  } catch (err) {
    next(err);
  }
}


  async getMyPayments(req, res, next) {
    try {
      const user = req.loggedInUser;
      const payments = user.role === "employer"
        ? await paymentSvc.getPaymentsForEmployer(user._id)
        : await paymentSvc.getPaymentsForStudent(user._id);

      res.json({ status: "success", data: {payments} });
    } catch (err) {
      next(err);
    }
  }
}
const paymentCtrl = new PaymentController();
module.exports = paymentCtrl
