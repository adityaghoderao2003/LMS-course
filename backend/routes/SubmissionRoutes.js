const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/AuthMiddleware");

const {
    CreateSubmission,
    GetMySubmissions,
    GetSubmissionById,
    UpdateSubmission,
    DeleteSubmission
} = require("../controllers/SubmissionController");

// Create submission
router.post("/", AuthMiddleware, CreateSubmission);

// Get my submissions
router.get("/my-submissions", AuthMiddleware, GetMySubmissions);

// Get submission by ID
router.get("/:id", AuthMiddleware, GetSubmissionById);

// Update submission
router.put("/:id", AuthMiddleware, UpdateSubmission);

// Delete submission
router.delete("/:id", AuthMiddleware, DeleteSubmission);

module.exports = router;