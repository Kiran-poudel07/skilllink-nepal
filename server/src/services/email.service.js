const nodemailer = require("nodemailer");
const { SMTPConfig } = require("../config/config");

class EmailService {
    #transport
    constructor() {
        try {
            this.#transport = nodemailer.createTransport({
                host: SMTPConfig.host,
                port: SMTPConfig.port,
                service: SMTPConfig.provider,
                auth: {
                    user: SMTPConfig.user,
                    pass: SMTPConfig.password
                }
            })
        }catch(exception){
            throw exception
        }
    }

    emailSend = async({to, subject, message, cc=null, bcc=null, attachements=null}) =>{
        try{
            let messageBag = {
                to: to,
                subject: subject,
                from: SMTPConfig.fromAddress,
                html: message,
            };
            if(cc){
                messageBag["cc"] = cc;
            }

            if(bcc){
                messageBag["bcc"] = bcc;
            }
            
            if(attachements){
                messageBag["attachments"] = attachements;
            }
            return await this.#transport.sendMail(messageBag);
        }catch(exception){
            throw exception
        }
    }
}

module.exports = EmailService