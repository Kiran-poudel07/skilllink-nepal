const mongoose = require("mongoose");
const { userRoles, Gender, Status } = require("../../config/constant");

const UserSchema = new mongoose.Schema({
    name: { type: String, min: 2, max: 50, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(userRoles), default: userRoles.STUDENT },
    age: {
        type: Number,
        required: function () {
            return this.role !== 'admin';
        }
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
        required: function () {
            return this.role !== 'admin' ;
        }
    },

    dob: Date,
    phone: String,
    address: String,
    image: { publicId: String, url: String, optimizedUrl: String },
    activationToken: String,
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    status: { type: String, enum: Object.values(Status), default: Status.INACTIVE },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
