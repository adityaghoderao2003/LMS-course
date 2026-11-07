import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

    // Get Courses
    async function fetchCourses() {
        try {
            const response = await fetch(
                `https://lms-course-y0ig.onrender.com/api/courses?search=${search}&category=${category}&sort=${sort}&page=${page}&limit=5`
            );

            const data = await response.json();

            if (data.success) {
                setCourses(data.courses);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.log("Error fetching courses:", error);
        }
    }



    // Edit Course
    function editCourse(id) {
        navigate(`/edit-course/${id}`);
    }

    // Delete Course
    async function deleteCourse(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `https://lms-course-y0ig.onrender.com/api/courses/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                alert("Course deleted successfully");
                fetchCourses();
            } else {
                alert(data.message || "Failed to delete course");
            }
        } catch (error) {
            console.log("Error deleting course:", error);
            alert("Something went wrong");
        }
    }

        useEffect(() => {
        fetchCourses();
    }, [search, category, sort, page]);
    return (
        <div className="courses-page">
            <h1>Explore Courses</h1>
            <p>Discover courses and start learning.</p>

            {/* Search */}
            <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />

            {/* Category Filter */}
            <select
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                }}
            >
                <option value="">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Programming">Programming</option>
                <option value="Database">Database</option>
                <option value="Design">Design</option>
            </select>

            {/* Sort */}
            <select
                value={sort}
                onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                }}
            >
                <option value="">Default Order</option>
                <option value="asc">Title A-Z</option>
                <option value="desc">Title Z-A</option>
            </select>

            {/* Courses */}
            <div className="courses-grid">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div className="course-card" key={course._id}>
                            {course.image && (
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="course-image"
                                />
                            )}

                            <h2>{course.title}</h2>

                            <p>{course.category}</p>

                            <p>{course.description}</p>

                            <p>
                                Instructor:{" "}
                                {course.instructor?.name || "Instructor"}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/courses/${course._id}`)
                                }
                            >
                                View Course
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(`/enroll/${course._id}`)}
                            >
                                Enroll Now
                            </button>


                            {token && (role === "instructor" || role === "admin") && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => editCourse(course._id)}
                                    >
                                        Edit Course
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteCourse(course._id)}
                                    >
                                        Delete Course
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No courses available.</p>
                )}
            </div>

            {/* Pagination */}
            <div>
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>

                <span>
                    {" "} Page {page} of {totalPages} {" "}
                </span>

                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Courses;