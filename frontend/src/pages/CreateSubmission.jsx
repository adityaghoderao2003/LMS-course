import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateSubmission = () => {
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);

    const [formdata, setFormdata] = useState({
        assignment: "",
        answer: ""
    });

    useEffect(() => {
        getAssignments();
    }, []);

    async function getAssignments() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/assignments"
            );

            const data = await response.json();

            if (response.ok) {
                setAssignments(data.assignments);
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

    async function createSubmission(e) {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/submissions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(formdata)
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Assignment submitted successfully");
                navigate("/submissions");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2>Submit Assignment</h2>

            <form onSubmit={createSubmission}>
                <select
                    name="assignment"
                    value={formdata.assignment}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Assignment</option>

                    {assignments.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.title}
                        </option>
                    ))}
                </select>

                <br /><br />

                <textarea
                    name="answer"
                    placeholder="Write your answer"
                    value={formdata.answer}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button type="submit">Submit Assignment</button>
            </form>
        </div>
    );
};

export default CreateSubmission;