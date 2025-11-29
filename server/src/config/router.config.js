const router = require('express').Router()
const adminRouter = require('../modules/admin/admin.route');
const appRouter = require('../modules/application/application.route');
const authRouter = require('../modules/auth/auth.route');
const conversationRouter = require('../modules/conversation/conversation.router');
const dashboardRouter = require('../modules/dashboard/dashboard.router');
const gigRouter = require('../modules/gig/gig.router');
const messageRouter = require('../modules/message/message.router');
const notificationRouter = require('../modules/notification/notification.route');
const paymentRouter = require('../modules/payment/payment.route');
const publicRouter = require('../modules/public/public.router');
const reviewRouter = require('../modules/review/review.route');
const uploaderRouter = require('../modules/uploader/uploader.router');
const userRouter = require('../modules/user/user.route');
router.use('/auth', authRouter);
router.use("/users", userRouter);
router.use("/upload", uploaderRouter);
router.use("/gig", gigRouter);
router.use("/application", appRouter);
router.use("/notification",notificationRouter);
router.use("/message", messageRouter);
router.use("/conversation", conversationRouter);
router.use("/payment", paymentRouter);
router.use("/review", reviewRouter);
router.use("/admin", adminRouter);
router .use("/public", publicRouter);
router.use("/dashboard", dashboardRouter)

module.exports = router;
