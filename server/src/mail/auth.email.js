const { AppConfig } = require("../config/config");
const EmailService = require("../services/email.service");

class AuthNotificationEmailService extends EmailService{
    sendActivationNotification = async (user) =>{
        try{
            return await this.emailSend({
                to: user.email,
                subject: "Welcome to our community - Activate your account",
                message: `
                <div style="max-width:480px;margin:40px auto;padding:32px 24px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);font-family:Arial,sans-serif;color:#222;">
                    <div style="text-align:center;margin-bottom:24px;">
                        <img src="https://www.mongodb.com/assets/images/global/favicon.ico" alt="Logo" style="width:48px;height:48px;margin-bottom:8px;">
                        <h2 style="margin:0;font-size:24px;color:#13aa52;">Activate your account</h2>
                    </div>
                    <p style="font-size:16px;margin-bottom:16px;">Dear <b>${user.name}</b>,</p>
                    <p style="font-size:15px;margin-bottom:24px;">
                        Thank you for registering with us.<br>
                        Please click the button below to activate your account:
                    </p>
                    <div style="text-align:center;margin-bottom:24px;">
                        <a href="${AppConfig.frontendUrl}/auth/activate/${user.activationToken}" style="display:inline-block;padding:12px 32px;background:#13aa52;color:#fff;text-decoration:none;border-radius:4px;font-size:16px;font-weight:bold;">
                            Activate Account
                        </a>
                    </div>
                    <p style="font-size:14px;color:#555;margin-bottom:16px;">
                        If the button above does not work, copy and paste the following URL into your browser:<br>
                        <span style="word-break:break-all;color:#13aa52;">${AppConfig.frontendUrl}/auth/activate/${user.activationToken}</span>
                    </p>
                    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
                    <p style="font-size:13px;color:#888;margin-bottom:0;">
                        Regards,<br>
                        <b>noreply@bincommerce.com</b><br>
                        <span style="font-size:12px;">Note: Do not reply directly to this email.</span>
                    </p>
                </div>
`
            });

        }catch(exception){
            throw exception
        }
    }
    sendWelcomeNotification = async(user)=>{
        try{
            return await this.emailSend({
                to: user.email,
                subject: "Welcome to SkillBazar – Your Account is Activated!",
                message: `
                <div style="max-width:480px;margin:40px auto;padding:32px 24px;background:#fff;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.10);font-family:Segoe UI,Arial,sans-serif;color:#222;">
                    <div style="text-align:center;margin-bottom:28px;">
                        <img src="https://www.mongodb.com/assets/images/global/favicon.ico" alt="Logo" style="width:56px;height:56px;margin-bottom:10px;">
                        <h2 style="margin:0;font-size:26px;color:#0a7cff;">Welcome to SkillBazar!</h2>
                    </div>
                    <p style="font-size:17px;margin-bottom:18px;">Dear <b>${user.name}</b>,</p>
                    <p style="font-size:16px;margin-bottom:18px;">
                        We’re thrilled to welcome you to our vibrant community! Your account is now active, and you’re all set to explore, connect, and grow with us.
                    </p>
                    <p style="font-size:16px;margin-bottom:18px;">
                        At SkillBazar, we believe in empowering individuals, fostering collaboration, and unlocking new opportunities for everyone. Your presence makes our community stronger and more inspiring.
                    </p>
                    <p style="font-size:16px;margin-bottom:18px;">
                        Dive in, discover new skills, and let’s achieve great things together. If you ever need support, our team is always here to help you on your journey.
                    </p>
                    <div style="text-align:center;margin:32px 0;">
                        <a href="${AppConfig.frontendUrl}/" style="display:inline-block;padding:13px 36px;background:#0a7cff;color:#fff;text-decoration:none;border-radius:5px;font-size:17px;font-weight:600;box-shadow:0 2px 8px rgba(10,124,255,0.10);">
                            Get Started
                        </a>
                    </div>
                    <hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
                    <p style="font-size:13px;color:#888;margin-bottom:0;">
                        Warm regards,<br>
                        <b>The SkillBazar Team</b><br>
                        <span style="font-size:12px;">noreply@skillbazar.com &mdash; Please do not reply directly to this email.</span>
                    </p>
                </div>
                `
            });
        }catch(exception){
            throw exception
        }
    }
    sendPasswordResetNotification = async (user, resetLink) => {
  try {
    return await this.emailSend({
      to: user.email,
      subject: "Password Reset Request - SkillBazar",
      message: `
        <div style="max-width:480px;margin:40px auto;padding:32px 24px;background:#fff;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.10);font-family:Segoe UI,Arial,sans-serif;color:#222;">
            <div style="text-align:center;margin-bottom:28px;">
                <img src="https://www.mongodb.com/assets/images/global/favicon.ico" alt="Logo" style="width:56px;height:56px;margin-bottom:10px;">
                <h2 style="margin:0;font-size:24px;color:#f05454;">Password Reset Request</h2>
            </div>
            <p style="font-size:16px;margin-bottom:18px;">Dear <b>${user.name}</b>,</p>
            <p style="font-size:15px;margin-bottom:18px;">
                We received a request to reset your password. Click the button below to reset it. 
                This link is valid for <b>15 minutes</b>.
            </p>
            <div style="text-align:center;margin:32px 0;">
                <a href="${resetLink}" style="display:inline-block;padding:12px 28px;background:#f05454;color:#fff;text-decoration:none;border-radius:5px;font-size:16px;font-weight:600;">
                    Reset Password
                </a>
            </div>
            <p style="font-size:14px;color:#555;margin-bottom:16px;">
                If you did not request this, please ignore this email.
            </p>
            <p style="font-size:12px;color:#888;">
                If the button does not work, copy and paste this link into your browser:<br>
                <span style="color:#f05454;word-break:break-all;">${resetLink}</span>
            </p>
        </div>
      `
    });
  } catch (exception) {
    throw exception;
  }
 }


}

const authNotificationEmailSvc = new AuthNotificationEmailService()
module.exports = authNotificationEmailSvc