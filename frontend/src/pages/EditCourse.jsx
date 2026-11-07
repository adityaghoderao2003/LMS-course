import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formdata, setFormdata] = useState({
        title: "",
        description: "",
        category: ""
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        getCourse();
    }, []);

    async function getCourse() {
        try {
            const response = await fetch(
                `https://lms-course-y0ig.onrender.com/api/courses/${id}`
            );

            const data = await response.json();

            if (response.ok) {
                setFormdata({
                    title: data.course.title,
                    description: data.course.description,
                    category: data.course.category
                });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleChange(e) {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    }

    async function updateCourse(e) {
        e.preventDefault();

        try {
            const response = await fetch(
                `https://lms-course-y0ig.onrender.com/api/courses/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formdata)
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Course updated successfully");
                navigate("/courses");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2>Edit Course</h2>

            <form onSubmit={updateCourse}>
                <input
                    type="text"
                    name="title"
                    placeholder="Course Title"
                    value={formdata.title}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <textarea
                    name="description"
                    placeholder="Course Description"
                    value={formdata.description}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formdata.category}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button type="submit">Update Course</button>
            </form>
        </div>
    );
};

export default EditCourse;