const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const enrollCourse = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only student can enroll'
            })
        }

        const { course } = req.body;

        const existingCourse = await Course.findById(course);

        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            })
        };

        const existingEnrollment = await Enrollment.findOne({
            student: req.user.id,
            course: course
        })

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: "Already enrolled in this course"
            });
        }

        const enrollment = await Enrollment.create({
            student: req.user.id,
            course
        })

        res.status(200).json({
            success: true,
            message: "Course enrolled successfully",
            enrollment: enrollment
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const GetMyEnrollments = async (req, res) => {
    try {
        // Find enrollments of logged-in student
        const enrollments = await Enrollment.find({
            student: req.user.id
        })
            .populate("course")
            .populate("student", "name email");

        res.status(200).json({
            success: true,
            totalEnrollments: enrollments.length,
            enrollments: enrollments
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
     }
}

const GetEnrollmentById = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate("course")
            .populate("student", "name email");

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        if (
            req.user.role === "student" &&
            enrollment.student._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to view this enrollment"
            });
        }

        res.status(200).json({
            success: true,
            enrollment: enrollment
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const DeleteEnrollment = async (req, res) => {
    try {
        // Find enrollment
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        // Check student role
        if (req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "Only students can cancel enrollment"
            });
        }

        // Check ownership
        if (enrollment.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot cancel another student's enrollment"
            });
        }

        // Delete enrollment
        await Enrollment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Enrollment cancelled successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports={enrollCourse , GetEnrollmentById , GetMyEnrollments , DeleteEnrollment}