require("dotenv").config()

const CloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
};
const mongoDBConfig = {
    url: process.env.MONGODB_URL,
    dbName: process.env.MONGODB_DBNAME
}
const AppConfig = {
   frontendUrl: process.env.FORNTEND_URL,
    khaltiSecretKey: process.env.KHALTI_SECRET_KEY,
    khaltiBaseUrl:process.env.KHALTI_BASE_URL
}
const SMTPConfig = {
    provider: process.env.SMTP_PROVIDER,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromAddress: process.env.SMTP_FROM_ADDRESS
}


// const AppConfig = {
//     frontendUrl: process.env.FORNTEND_URL,
//     jwtSecret:process.env.JWT_SECRET,
//     khaltiSecretKey: process.env.KHALTI_SECRET_KEY,
//     khaltiBaseUrl:process.env.KHALTI_BASE_URL
// };

module.exports = {
    CloudinaryConfig,
    mongoDBConfig,
    SMTPConfig,
    AppConfig,
   
}