const Course = require('../models/Course');

const createCourse = async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({
                message: 'Only instructors can create courses'
            });
        }

        const { title, description, category } = req.body;

        const course = await Course.create({
            title, description,category , image: req.file ? req.file.path : '', instructor: req.user.id
        });

        res.status(201).json({
            message: "Course created successfully",
            course: course
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// Update Course
const UpdateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        if (req.user.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can update courses"
            });
        }

        if (course.instructor != req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own courses"
            });
        }

        course.title = req.body.title || course.title;
        course.description = req.body.description || course.description;
        course.category = req.body.category || course.category;

        await course.save();

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Courses
const getCourses = async (req, res) => {
    try {
        const {
            search,
            category,
            sort,
            page = 1,
            limit = 5
        } = req.query;

        const query = {};

        if (search) {
            query.title = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            query.category = category;
        }

        const skip = (Number(page) - 1) * Number(limit);

        let sortOption = {};

        if (sort === "asc") {
            sortOption.title = 1;
        } else if (sort === "desc") {
            sortOption.title = -1;
        }

        const courses = await Course.find(query)
            .populate("instructor", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalCourses = await Course.countDocuments(query);

        res.status(200).json({
            success: true,
            totalCourses: totalCourses,
            currentPage: Number(page),
            totalPages: Math.ceil(totalCourses / Number(limit)),
            courses: courses
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

async function getCourseById(req, res) {
    try {
        const course = await Course.findById(req.params.id)
            .populate("instructor", "name email");

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json({
            course: course
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

// 4. Delete Course - Owner Instructor only
async function deleteCourse(req, res) {
    try {
        if (req.user.role !== "instructor") {
            return res.status(403).json({
                message: "Only instructors can delete courses"
            });
        }

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can delete only your own courses"
            });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Course deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {createCourse, UpdateCourse , getCourseById , getCourses , deleteCourse};