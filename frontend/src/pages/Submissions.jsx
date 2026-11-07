import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [editId, setEditId] = useState(null);
    const [answer, setAnswer] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        getSubmissions();
    }, []);

    async function getSubmissions() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/submissions/my-submissions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSubmissions(data.submissions);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleEdit(submission) {
        setEditId(submission._id);
        setAnswer(submission.answer);
    }

    async function updateSubmission(e) {
        e.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:5000/api/submissions/${editId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ answer: answer })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Submission updated successfully");
                setEditId(null);
                setAnswer("");
                getSubmissions();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function deleteSubmission(id) {
        const confirmDelete = prompt("Type YES to delete submission");

        if (confirmDelete !== "YES") {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/submissions/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Submission deleted");
                getSubmissions();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2>My Submissions</h2>

            <Link to="/create-submission">Submit Assignment</Link>

            {submissions.map((item) => (
                <div key={item._id}>
                    <h3>
                        Assignment: {item.assignment?.title}
                    </h3>

                    {editId === item._id ? (
                        <form onSubmit={updateSubmission}>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                required
                            />

                            <br />

                            <button type="submit">Update</button>

                            <button
                                type="button"
                                onClick={() => setEditId(null)}
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <p>{item.answer}</p>
                    )}

                    <button onClick={() => handleEdit(item)}>
                        Edit
                    </button>

                    <button onClick={() => deleteSubmission(item._id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Submissions;