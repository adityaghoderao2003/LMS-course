const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2");
const multer = require("multer");


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: {
        folder: "vehicles",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});


const upload = multer({
    storage: storage
});


module.exports = upload;