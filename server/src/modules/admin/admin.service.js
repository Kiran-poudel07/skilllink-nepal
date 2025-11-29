const UserModel = require("../user/user.model");
const GigModel = require("../gig/gig.model");
const ApplicationModel = require("../application/application.model");
const PaymentModel = require("../payment/payment.model");
const ReviewModel = require("../review/review.model");
const NotificationService = require("../notification/notification.service");
const AdminLog = require("./admin.model");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

class AdminService {
    async createAdmin(payload, actorId, actorIp = null) {
        const { name, email, password, role = "admin" } = payload;
        const existing = await UserModel.findOne({ email: email.toLowerCase() });
        if (existing) throw { statusCode: 400, message: "Email already in use" };

        const hashed = await bcrypt.hash(password, 12);
        const adminUser = await UserModel.create({
            name,
            email: email.toLowerCase(),
            password: hashed,
            role,
        });

        await AdminLog.create({
            actor: actorId,
            action: "CREATE_ADMIN",
            targetType: "User",
            targetId: adminUser._id,
            details: { email, role, name },
            ip: actorIp
        });

        return adminUser;
    }

    async listUsers(query = {}, loggedInUser) {
        const page = Number(query.page) || 1;
        const limit = Math.min(Number(query.limit) || 20, 200);
        const skip = (page - 1) * limit;

        const filter = {};

        if (loggedInUser.role !== "superadmin") {
            filter.role = { $ne: "superadmin" };
        }

        if (query.role) filter.role = query.role;
        if (query.status) {
            if (query.status === "blocked") filter.isBlocked = true;
            else if (query.status === "active") filter.isBlocked = { $ne: true };
        }
        if (query.q) {
            const q = query.q.trim();
            filter.$or = [
                { name: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } }
            ];
        }

        const [users, total] = await Promise.all([
            UserModel.find(filter).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 }),
            UserModel.countDocuments(filter)
        ]);

        return { users, meta: { page, limit, total } };
    }


    async changeUserStatus(actorId, { userId, action, reason }, actorIp = null) {
        if (!mongoose.Types.ObjectId.isValid(userId))
            throw { statusCode: 400, message: "Invalid userId" };

        const user = await UserModel.findById(userId);
        if (!user) throw { statusCode: 404, message: "User not found" };

        if (user.role === "superadmin")
            throw { statusCode: 403, message: "Cannot modify superadmin" };

        if (user.isBlocked === undefined) user.isBlocked = false;
        if (user.isDeleted === undefined) user.isDeleted = false;

        let message = "";
        let actionPerformed = false;

        switch (action) {
            case "BLOCK":
                if (user.isDeleted) {
                    message = "Cannot block a deleted user";
                } else if (user.isBlocked) {
                    message = "User is already blocked";
                } else {
                    user.isBlocked = true;
                    await user.save();
                    message = "User blocked successfully";
                    actionPerformed = true;
                }
                break;

            case "UNBLOCK":
                if (user.isDeleted) {
                    message = "Cannot unblock a deleted user";
                } else if (!user.isBlocked) {
                    message = "User is already unblocked";
                } else {
                    user.isBlocked = false;
                    await user.save();
                    message = "User unblocked successfully";
                    actionPerformed = true;
                }
                break;

            case "DELETE":
                if (user.isDeleted) {
                    message = "User already deleted";
                } else {
                    user.isDeleted = true; 
                    user.isBlocked = true;  
                    await user.save();
                    message = "User deleted successfully";
                    actionPerformed = true;
                }
                break;

            default:
                throw { statusCode: 400, message: "Invalid action type" };
        }

        if (actionPerformed) {
            await AdminLog.create({
                actor: actorId,
                action: `USER_${action}`,
                targetType: "User",
                targetId: user._id,
                details: { reason },
                ip: actorIp
            });

            if (["BLOCK", "UNBLOCK"].includes(action)) {
                const notifTitle = `Account ${action === "BLOCK" ? "Blocked" : "Unblocked"}`;
                const notifMessage =
                    reason ||
                    `Your account has been ${action === "BLOCK" ? "blocked" : "unblocked"
                    } by the admin.`;

                await NotificationService.createNotification({
                    recipient: user._id,
                    sender: actorId,
                    type: "admin_action",
                    title: notifTitle,
                    message: notifMessage,
                });
            }
        }

        return { message };
    }

    async actOnGig(actorId, { gigId, action, reason }, actorIp = null) {
    if (!mongoose.Types.ObjectId.isValid(gigId)) 
        throw { statusCode: 400, message: "Invalid gigId" };

    const gig = await GigModel.findById(gigId);
    if (!gig || gig.isDeleted) 
        throw { statusCode: 404, message: "Gig not found or already deleted" };

    let message = "";
    let actionPerformed = false;

    switch(action) {
        case "PAUSE":
            if (gig.status === "inactive") {
                message = "Gig is already paused";
            } else {
                gig.status = "inactive";
                await gig.save();
                message = "Gig paused successfully";
                actionPerformed = true;
            }
            break;

        case "UNPAUSE":
            if (gig.status === "active") {
                message = "Gig is already active";
            } else {
                gig.status = "active";
                await gig.save();
                message = "Gig unpaused successfully";
                actionPerformed = true;
            }
            break;

        case "CLOSE":
            if (gig.status === "closed") {
                message = "Gig is already closed";
            } else {
                gig.status = "closed";
                await gig.save();
                message = "Gig closed successfully";
                actionPerformed = true;
            }
            break;

        case "DELETE":
            gig.isDeleted = true; // ✅ soft delete
            await gig.save();
            message = "Gig deleted successfully";
            actionPerformed = true;
            break;

        default:
            throw { statusCode: 400, message: "Invalid action" };
    }

    // Only log and notify if action actually performed
    if (actionPerformed) {
        await AdminLog.create({
            actor: actorId,
            action: `GIG_${action}`,
            targetType: "Gig",
            targetId: gig._id,
            details: { reason },
            ip: actorIp
        });

        // Notify employer
        await NotificationService.createNotification({
            recipient: gig.employer,
            sender: actorId,
            type: "gig_moderation",
            title: `Your gig "${gig.title}" was ${action.toLowerCase()}`,
            message: reason || `Admin performed ${action} on your gig.`,
            gig: gig._id
        });
    }

    return { message };
    }


    async listPayments(query = {}) {
        const page = Number(query.page) || 1;
        const limit = Math.min(Number(query.limit) || 20, 200);
        const skip = (page - 1) * limit;

        const filter = {};
        if (query.status) filter.status = query.status;
        if (query.q) {
            const q = query.q.trim();
            filter.$or = [
                { txnId: { $regex: q, $options: "i" } },
                { "rawData.purchase_order_name": { $regex: q, $options: "i" } }
            ];
        }

        const [payments, total] = await Promise.all([
            PaymentModel.find(filter).populate("employer student gig").skip(skip).limit(limit).sort({ createdAt: -1 }),
            PaymentModel.countDocuments(filter)
        ]);

        return { payments, meta: { page, limit, total } };
    }

    async getAuditLogs(query = {}) {
        const page = Number(query.page) || 1;
        const limit = Math.min(Number(query.limit) || 20, 200);
        const skip = (page - 1) * limit;
        const filter = {};
        if (query.actor) filter.actor = query.actor;
        if (query.action) filter.action = query.action;

        const [logs, total] = await Promise.all([
            AdminLog.find(filter).populate("actor", "name email").skip(skip).limit(limit).sort({ createdAt: -1 }),
            AdminLog.countDocuments(filter)
        ]);

        return { logs, meta: { page, limit, total } };
    }
}

const adminSvc = new AdminService()
module.exports = adminSvc;
