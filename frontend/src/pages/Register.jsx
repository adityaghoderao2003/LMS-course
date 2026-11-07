import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "https://lms-course-y0ig.onrender.com/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Registration successful");

            navigate("/login");

        } catch (err) {
            console.log(err);
            alert("Server error");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <br />
                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                />

                <br />
                <br />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="student">
                        Student
                    </option>

                    <option value="instructor">
                        Instructor
                    </option>
                </select>

                <br />
                <br />

                <button type="submit">
                    Register
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </form>

            <p>
                Already registered? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Register;