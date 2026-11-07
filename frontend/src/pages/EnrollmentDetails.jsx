import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EnrollmentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [enrollment, setEnrollment] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getEnrollment();
    }, [id]);

    async function getEnrollment() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://lms-course-y0ig.onrender.com/api/enrollments/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setEnrollment(data.enrollment);
            } else {
                setMessage(data.message || "Enrollment not found");
            }
        } catch (error) {
            console.log(error);
            setMessage("Something went wrong");
        }
    }

    if (message) {
        return <p>{message}</p>;
    }

    if (!enrollment) {
        return <p>Loading enrollment...</p>;
    }

    return (
        <div>
            <h1>Enrollment Details</h1>

            <h2>
                Course: {enrollment.course?.title || "Course unavailable"}
            </h2>

            <p>
                Category: {enrollment.course?.category || "N/A"}
            </p>

            <p>
                Student: {enrollment.student?.name || "N/A"}
            </p>

            <p>
                Email: {enrollment.student?.email || "N/A"}
            </p>

            <p>Enrollment ID: {enrollment._id}</p>

            <button
                type="button"
                onClick={() => navigate("/my-enrollments")}
            >
                Back to My Enrollments
            </button>
        </div>
    );
}

export default EnrollmentDetails;