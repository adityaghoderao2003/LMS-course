import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");

    // Create a new course
    async function createCourse(event) {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);

            if (image) {
                formData.append("image", image);
            }

            const response = await fetch(
                "https://lms-course-y0ig.onrender.com/api/courses",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessage("Course created successfully!");

                setTitle("");
                setDescription("");
                setCategory("");
                setImage(null);

                event.target.reset();

                setTimeout(() => {
                    navigate("/courses");
                }, 1000);
            } else {
                setMessage(data.message || "Failed to create course.");
            }
        } catch (error) {
            console.log("Error creating course:", error);
            setMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="create-course-page">
            <h1>Create New Course</h1>
            <p>Fill in the details below to publish your course.</p>

            {message && <p>{message}</p>}

            <form onSubmit={createCourse}>
                <div>
                    <label>Course Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Enter course title"
                        required
                    />
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Describe your course"
                        required
                    />
                </div>

                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        placeholder="e.g. Web Development"
                        required
                    />
                </div>

                <div>
                    <label>Course Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setImage(event.target.files[0])}
                    />
                </div>

                <button type="submit">Create Course</button>

                <button
                    type="button"
                    onClick={() => navigate("/courses")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default CreateCourse;