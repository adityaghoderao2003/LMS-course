import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EnrollCourse() {
    const { id } = useParams();
    const navigate = useNavigate();

    async function enrollCourse() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/enrollments",
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

            if (response.ok) {
                alert("Course enrolled successfully");
                navigate("/my-enrollments");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Enroll in Course</h1>

            <p>Are you sure you want to enroll in this course?</p>

            <button type="button" onClick={enrollCourse}>
                Confirm Enrollment
            </button>

            <button
                type="button"
                onClick={() => navigate("/courses")}
            >
                Cancel
            </button>
        </div>
    );
}

export default EnrollCourse;