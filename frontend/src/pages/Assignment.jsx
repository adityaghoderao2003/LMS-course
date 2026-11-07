import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const role = localStorage.getItem("role");

    useEffect(() => {
        getAssignments();
    }, []);

    async function getAssignments() {
        try {
            const response = await fetch("http://localhost:5000/api/assignments");
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

    async function deleteAssignment(id) {
        const answer = prompt("Type YES to delete this assignment");

        if (answer !== "YES") {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/assignments/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Assignment deleted");
                getAssignments();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2>Assignments</h2>

            {role === "instructor" && (
                <Link to="/create-assignment">Create Assignment</Link>
            )}

            {assignments.map((assignment) => (
                <div key={assignment._id}>
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <p>Due Date: {assignment.dueDate}</p>

                    <Link to={`/assignments/${assignment._id}`}>
                        View Assignment
                    </Link>

                    {role === "instructor" && (
                        <>
                            <br />
                            <Link to={`/edit-assignment/${assignment._id}`}>
                                Edit
                            </Link>
                            <br />
                            <button onClick={() => deleteAssignment(assignment._id)}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Assignments;