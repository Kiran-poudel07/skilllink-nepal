const fs = require("fs");
const multer = require("multer");

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = "./public/uploads";
    if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploader = (type = "image") => {
  let limit = 3 * 1024 * 1024; 
  let allowedExts = ["jpg","jpeg","png","gif","svg","bmp","webp","jfif"];

  if (type === "doc") {
    allowedExts = ["doc","docx","csv","pdf","xlsx","json"];
    limit = 5 * 1024 * 1024;
  }

  const fileFilter = (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb({ status: 422, message: "File format not supported" });
    }
  };

  return multer({ storage: myStorage, fileFilter, limits: { fileSize: limit } });
};

module.exports = uploader;
