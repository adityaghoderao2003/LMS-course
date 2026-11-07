import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function fetchMyEnrollments() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                "https://lms-course-y0ig.onrender.com/api/enrollments/my-enrollments",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setEnrollments(data.enrollments);
                setMessage("");
            } else {
                setMessage(data.message || "Could not fetch enrollments.");
            }
        } catch (error) {
            console.log("Error fetching enrollments:", error);
            setMessage("Something went wrong. Please try again.");
        }
    }

    async function deleteEnrollment(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to cancel this enrollment?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://lms-course-y0ig.onrender.com/api/enrollments/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Enrollment cancelled successfully");
                fetchMyEnrollments();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log("Error cancelling enrollment:", error);
        }
    }

    useEffect(() => {
        fetchMyEnrollments();
    }, []);

    return (
        <div className="my-enrollments">
            <h1>My Enrolled Courses</h1>

            {message && <p>{message}</p>}

            {enrollments.length > 0 ? (
                <div className="courses-grid">
                    {enrollments.map((enrollment) => (
                        <div className="course-card" key={enrollment._id}>
                            {enrollment.course?.image && (
                                <img
                                    src={enrollment.course.image}
                                    alt={enrollment.course.title}
                                    className="course-image"
                                />
                            )}

                            <h2>
                                {enrollment.course?.title ||
                                    "Course unavailable"}
                            </h2>

                            <p>{enrollment.course?.category}</p>

                            <p>{enrollment.course?.description}</p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/courses/${enrollment.course._id}`
                                    )
                                }
                                disabled={!enrollment.course?._id}
                            >
                                View Course
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    deleteEnrollment(enrollment._id)
                                }
                            >
                                Cancel Enrollment
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                !message && (
                    <p>You have not enrolled in any courses yet.</p>
                )
            )}
        </div>
    );
};

export default MyEnrollments;