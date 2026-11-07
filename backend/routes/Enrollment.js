const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/AuthMiddleware");

const {
    enrollCourse,
    GetMyEnrollments,
    GetEnrollmentById,
    DeleteEnrollment
} = require("../controllers/EnrollmentController");

// Enroll in a course
router.post("/", AuthMiddleware, enrollCourse);

// Get my enrollments
router.get("/my-enrollments", AuthMiddleware, GetMyEnrollments);

// Get enrollment by ID
router.get("/:id", AuthMiddleware, GetEnrollmentById);

// Delete enrollment
router.delete("/:id", AuthMiddleware, DeleteEnrollment);

module.exports = router;