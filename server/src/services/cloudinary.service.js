const { CloudinaryConfig } = require("../config/config");
const { deletFile } = require("../utilites/helper");


const cloudinary = require("cloudinary").v2;


class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: CloudinaryConfig.cloudName,
            api_key: CloudinaryConfig.apiKey,
            api_secret: CloudinaryConfig.apiSecret
        });
    }

    
    fileUpload = async (path, dir = "", isPdf = false) => {
        try {
            const uploadOptions = {
                folder: "/skilllink" + dir,
                unique_filename: true,
                resource_type: isPdf ? "raw" : "image"
            };

            const { public_id, secure_url } = await cloudinary.uploader.upload(path, uploadOptions);

            let optimizedUrl = secure_url;
            if (!isPdf) {
                optimizedUrl = cloudinary.url(public_id, {
                    transformation: [
                        { dpr: "auto", responsive: true, width: "auto", crop: "scale" },
                        { quality: "auto" },
                        { fetch_format: "auto" }
                    ]
                });
            }

            deletFile(path);

            return { publicId: public_id, url: secure_url, optimizedUrl };
        } catch (exception) {
            throw exception;
        }
    };
    async deleteFile(fileUrl) {
    try {
      const publicId = fileUrl.split("/upload/")[1].split(".")[0]; // extract Cloudinary public ID
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.error("Cloudinary deletion failed:", error);
      return false;
    }
  }
    /**
    
     * @param {Array} files 
     * @param {string} employerId
     * @returns {Array} 
     */
    uploadGigFiles = async (files = [], employerId) => {
        try {
            const results = [];
            for (const file of files) {
                const uploaded = await this.fileUpload(file.path, `/employer/${employerId}/gig-attachments`, file.mimetype === "application/pdf");
                results.push(uploaded);
            }
            return results;
        } catch (err) {
            throw err;
        }
    };
    /**
     
     * @param {string} path
     * @param {boolean} isPdf 
     * @returns {Object} 
 */
    uploadChatAttachment = async (path, isPdf = false) => {
        try {
            const uploaded = await this.fileUpload(path, "/chat", isPdf);
            return uploaded;
        } catch (err) {
            throw err;
        }
    };

    /**
    
     * @param {Array} files
     * @returns {Array} 
     */
    uploadMultipleChatAttachments = async (files = []) => {
        try {
            const results = [];
            for (const file of files) {
                const isPdf = file.mimetype === "application/pdf";
                const uploaded = await this.uploadChatAttachment(file.path, isPdf);
                results.push(uploaded);
            }
            return results;
        } catch (err) {
            throw err;
        }
    };

}

const cloudinarySvc = new CloudinaryService();
module.exports = cloudinarySvc;
