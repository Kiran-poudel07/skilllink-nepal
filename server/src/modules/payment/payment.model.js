const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  gig: {
    type: mongoose.Types.ObjectId,
    ref: "Gig",
    required: true
  },
  application: {
    type: mongoose.Types.ObjectId,
    ref: "Application",
  },
  amount: {
    type: Number,
    required: true
  },
  txnId: {
    type: String,
    unique: true,
    required: true
  },
  paymentMethod: {
    type: String,
    default: "KHALTI"
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },
  remarks: {
    type: String
  },
  rawData: Object
}, { timestamps: true });

const PaymentModel = mongoose.model("Payment", paymentSchema);
module.exports = PaymentModel;
