import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        navigate("/login");
    }

    return (
        <nav className="navbar">
            <h2 onClick={() => navigate("/courses")}>LMS</h2>

            <div className="navbar-links">

                <NavLink to="/courses">Courses</NavLink>

                {token && role === "student" && (
                    <>
                        <NavLink to="/my-enrollments">
                            My Enrollments
                        </NavLink>

                        <NavLink to="/assignments">
                            Assignments
                        </NavLink>

                        <NavLink to="/submissions">
                            Submissions
                        </NavLink>
                    </>
                )}

                {token && (role === "instructor" || role === "admin") && (
                    <>
                        <NavLink to="/create-course">
                            Add Course
                        </NavLink>

                        <NavLink to="/create-assignment">
                            Create Assignment
                        </NavLink>

                        <NavLink to="/submissions">
                            Submissions
                        </NavLink>
                    </>
                )}

                {!token ? (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                ) : (
                    <button type="button" onClick={logout}>
                        Logout
                    </button>
                )}

            </div>
        </nav>
    );
}

export default Navbar;