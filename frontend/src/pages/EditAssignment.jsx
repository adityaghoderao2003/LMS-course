import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formdata, setFormdata] = useState({
        title: "",
        description: "",
        dueDate: ""
    });

    useEffect(() => {
        getAssignment();
    }, []);

    async function getAssignment() {
        try {
            const response = await fetch(
                `http://localhost:5000/api/assignments/${id}`
            );

            const data = await response.json();

            if (response.ok) {
                setFormdata({
                    title: data.assignment.title,
                    description: data.assignment.description,
                    dueDate: data.assignment.dueDate.split("T")[0]
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

    async function updateAssignment(e) {
        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:5000/api/assignments/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(formdata)
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Assignment updated successfully");
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
            <h2>Edit Assignment</h2>

            <form onSubmit={updateAssignment}>
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

                <button type="submit">Update Assignment</button>
            </form>
        </div>
    );
};

export default EditAssignment;