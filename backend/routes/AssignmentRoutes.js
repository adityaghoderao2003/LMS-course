const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/AuthMiddleware");

const {
    CreateAssignment,
    GetAssignments,
    GetAssignmentById,
    UpdateAssignment,
    DeleteAssignment
} = require("../controllers/AssignmentController");

// Get all assignments
router.get("/", GetAssignments);

// Get assignment by ID
router.get("/:id", GetAssignmentById);

// Create assignment
router.post("/", AuthMiddleware, CreateAssignment);

// Update assignment
router.put("/:id", AuthMiddleware, UpdateAssignment);

// Delete assignment
router.delete("/:id", AuthMiddleware, DeleteAssignment);

module.exports = router;