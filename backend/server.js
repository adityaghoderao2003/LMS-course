const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");


const AuthRoutes = require("./routes/AuthRoutes");
const CourseRoutes = require("./routes/CourseRoutes");
const EnrollmentRoutes = require("./routes/Enrollment");
const AssignmentRoutes = require("./routes/AssignmentRoutes");
const SubmissionRoutes = require("./routes/SubmissionRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "https://lms-course-alpha.vercel.app/login"
}));
app.use(express.json());

// Database connection
connectDB();


//routes
app.use('/api/auth', AuthRoutes);
app.use('/api/courses', CourseRoutes);
app.use("/api/enrollments", EnrollmentRoutes);
app.use("/api/assignments", AssignmentRoutes);
app.use("/api/submissions", SubmissionRoutes);

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LMS API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
});