const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary ,
    params: {
        folder: "lms-courses",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;