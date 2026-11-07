import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAssignment = () => {
    const navigate = useNavigate();

    const [formdata, setFormdata] = useState({
        title: "",
        description: "",
        dueDate: "",
        course: ""
    });

    const [courses, setCourses] = useState([]);

    React.useEffect(() => {
        getCourses();
    }, []);

    async function getCourses() {
        try {
            const response = await fetch("http://localhost:5000/api/courses");
            const data = await response.json();

            if (response.ok) {
                setCourses(data.courses);
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

    async function createAssignment(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formdata)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Assignment created successfully");
                navigate("/assignments");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2>Create Assignment</h2>

            <form onSubmit={createAssignment}>
                <input
                    name="title"
                    placeholder="Assignment Title"
                    value={formdata.title}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formdata.description}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="date"
                    name="dueDate"
                    value={formdata.dueDate}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <select
                    name="course"
                    value={formdata.course}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Course</option>

                    {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                            {course.title}
                        </option>
                    ))}
                </select>

                <br /><br />

                <button type="submit">Create Assignment</button>
            </form>
        </div>
    );
};

export default CreateAssignment;