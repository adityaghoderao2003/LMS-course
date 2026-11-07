const Assignment = require('../models/Assignment');
const Course = require('../models/Course')

const CreateAssignment = async (req, res) =>{
    try{
         const { title, description, dueDate, course } = req.body;

         if(req.user.role !== 'instructor'){
            return res.status(403).json({
                success : false,
                message : "only instructors can create course"
            })
         };

         const Existingcourse = await Course.findById(course);

         if(!Existingcourse){
            return res.status(400).json({
                success : false,
                mesage : 'Courses not found'
            });
         }

         if(Existingcourse.instructor != req.user.id){
            return res.status(403).json({
                 success: false,
                message: "You can only create assignments for your own courses"
            });
         }

         const assignment = await Assignment.create({
            title , description , dueDate , course
         })

         res.status(201).json({
             success: true,
            message: "Assignment created successfully",
            assignment: assignment
         })
    }catch(err){
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
};

// Get Assignments
const GetAssignments = async (req, res) => {
    try {
        const { course } = req.query;

        const query = {};

        if (course) {
            query.course = course;
        }

        const assignments = await Assignment.find(query)
            .populate("course", "title")
            .sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            totalAssignments: assignments.length,
            assignments: assignments
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get Assignment By ID
const GetAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate("course", "title");

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });
        }

        res.status(200).json({
            success: true,
            assignment: assignment
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Update Assignment
const UpdateAssignment = async (req, res) => {
    try {
        // Check instructor role
        if (req.user.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can update assignments"
            });
        }

        // Find assignment
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });
        }

        // Find course
        const course = await Course.findById(assignment.course);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Check course ownership
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only update assignments for your own courses"
            });
        }

        const { title, description, dueDate } = req.body;

        if (title !== undefined) {
            assignment.title = title;
        }

        if (description !== undefined) {
            assignment.description = description;
        }

        if (dueDate !== undefined) {
            assignment.dueDate = dueDate;
        }

        await assignment.save();

        res.status(200).json({
            success: true,
            message: "Assignment updated successfully",
            assignment: assignment
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const DeleteAssignment = async(req,res)=>{
    try{
           // Check instructor role
        if (req.user.role !== "instructor") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can delete assignments"
            });
        }

                // Find assignment
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found"
            });
        }

        const course = await course.findById(assignment.course);

         if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        if(course.instructor != req.user.id){
            return res.status(403).json({
                success: false,
                message: "You can only delete assignments for your own courses"
            });
        }
        await Assignment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success : true,
            message : 'deleted succesfully'
        })
    }catch(err){
           res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {CreateAssignment , GetAssignmentById , GetAssignments , UpdateAssignment , DeleteAssignment}