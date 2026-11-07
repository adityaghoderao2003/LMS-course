const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");const CreateSubmission = async (req, res) => {
    try {
        const { assignment, answer } = req.body;

        // Check student role
        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can submit assignments"
            });
        }

        // Check whether assignment exists
        const existingAssignment = await Assignment.findById(assignment);

        if (!existingAssignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });
        }

        // Check duplicate submission
        const existingSubmission = await Submission.findOne({
            assignment: assignment,
            student: req.user.id
        });

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted this assignment"
            });
        }

        // Create submission
        const submission = new Submission({
            assignment: assignment,
            student: req.user.id,
            answer: answer
        });

        await submission.save();

        res.status(201).json({
            success: true,
            message: "Assignment submitted successfully",
            submission: submission
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Get My Submissions
// Get My Submissions
const GetMySubmissions = async (req, res) => {
    try {
        const {
            search,
            sort,
            page = 1,
            limit = 5
        } = req.query;

        // Find logged-in student's submissions
        const query = {
            student: req.user.id
        };

        // Search by assignment title
        if (search) {
            const assignments = await Assignment.find({
                title: {
                    $regex: search,
                    $options: "i"
                }
            });

            const assignmentIds = [];

            for (const assignment of assignments) {
                assignmentIds.push(assignment._id);
            }

            query.assignment = {
                $in: assignmentIds
            };
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Sorting
        let sortOption = {};

        if (sort === "asc") {
            sortOption.createdAt = 1;
        } else if (sort === "desc") {
            sortOption.createdAt = -1;
        }

        const submissions = await Submission.find(query)
            .populate("assignment")
            .populate("student", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalSubmissions = await Submission.countDocuments(query);

        res.status(200).json({
            success: true,
            totalSubmissions: totalSubmissions,
            currentPage: Number(page),
            totalPages: Math.ceil(totalSubmissions / Number(limit)),
            submissions: submissions
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Get Submission By ID
const GetSubmissionById = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate("assignment")
            .populate("student", "name email");

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            });
        }

        // Check ownership for students
        if (
            req.user.role === "student" &&
            submission.student._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot view another student's submission"
            });
        }

        res.status(200).json({
            success: true,
            submission: submission
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Update Submission
const UpdateSubmission = async (req, res) => {
    try {
        // Check student role
        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can update submissions"
            });
        }

        // Find submission
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            });
        }

        // Check ownership
        if (submission.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot update another student's submission"
            });
        }

        // Update answer
        const { answer } = req.body;

        if (answer !== undefined) {
            submission.answer = answer;
        }

        await submission.save();

        res.status(200).json({
            success: true,
            message: "Submission updated successfully",
            submission: submission
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// Delete Submission
const DeleteSubmission = async (req, res) => {
    try {
        // Check student role
        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can delete submissions"
            });
        }

        // Find submission
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            });
        }

        // Check ownership
        if (submission.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot delete another student's submission"
            });
        }

        // Delete submission
        await Submission.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Submission deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    CreateSubmission,
    GetMySubmissions,
    GetSubmissionById,
    UpdateSubmission,
    DeleteSubmission
};