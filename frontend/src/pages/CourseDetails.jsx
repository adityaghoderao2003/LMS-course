import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    async function enrollCourse() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                "https://lms-course-y0ig.onrender.com/api/enrollments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        course: id
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessage("Successfully enrolled in this course!");
            } else {
                setMessage(data.message || "Enrollment failed.");
            }
        } catch (error) {
            console.log("Enrollment error:", error);
            setMessage("Something went wrong. Please try again.");
        }
    }

    // Fetch selected course details
    async function fetchCourseDetails() {
        try {
            const response = await fetch(
                `https://lms-course-y0ig.onrender.com/api/courses/${id}`
            );

            const data = await response.json();

            if (data.success) {
                setCourse(data.course);
            } else {
                setCourse(null);
            }
        } catch (error) {
            console.log("Error fetching course:", error);
            setCourse(null);
        } finally {
            setLoading(false);
        }
    }

    // Run when the page loads or the course ID changes
    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    if (loading) {
        return <h2>Loading course details...</h2>;
    }

    if (!course) {
        return (
            <div>
                <h2>Course not found</h2>
                <button onClick={() => navigate("/courses")}>
                    Back to Courses
                </button>
            </div>
        );
    }

    return (
        <div className="course-details">
            <button onClick={() => navigate("/courses")}>
                Back to Courses
            </button>

            {course.image && (
                <img
                    src={course.image}
                    alt={course.title}
                    className="course-image"
                />
            )}

            <h1>{course.title}</h1>

            <p>
                <strong>Category:</strong> {course.category}
            </p>

            <p>
                <strong>Description:</strong> {course.description}
            </p>

            <p>
                <strong>Instructor:</strong>{" "}
                {course.instructor.name || "Instructor"}
            </p>

            <button type="button" onClick={enrollCourse}>
                Enroll Now
            </button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default CourseDetails;