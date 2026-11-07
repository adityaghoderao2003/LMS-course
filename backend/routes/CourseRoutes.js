const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/AuthMiddleware");

const {
 createCourse, UpdateCourse , getCourseById , getCourses , deleteCourse
} = require("../controllers/CourseController");

const upload = require('../middleware/upload')

router.get("/", getCourses);
router.get("/:id", getCourseById);

router.post(
    "/",
    AuthMiddleware,
    upload.single("image"),
    createCourse
);

router.put("/:id", AuthMiddleware, UpdateCourse);
router.delete("/:id", AuthMiddleware, deleteCourse);
module.exports = router;