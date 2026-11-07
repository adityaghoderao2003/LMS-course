import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import CourseDetails from "./pages/CourseDetails";

import MyEnrollments from "./pages/MyEnrollment";
import EnrollCourse from "./pages/EnrollCourse";
import EnrollmentDetails from "./pages/EnrollmentDetails";

import Assignments from "./pages/Assignment";
import CreateAssignment from "./pages/CreateAssignment";
import EditAssignment from "./pages/EditAssignment";

import Submissions from "./pages/Submissions";
import CreateSubmission from "./pages/CreateSubmission";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/courses",
        element: (
            <>
                <Navbar />
                <Courses />
            </>
        )
    },
    {
        path: "/create-course",
        element: (
            <ProtectedRoute allowedRoles={["instructor", "admin"]}>
                <>
                    <Navbar />
                    <CreateCourse />
                </>
            </ProtectedRoute>
        )
    },
    {
        path: "/edit-course/:id",
        element: (
            <ProtectedRoute allowedRoles={["instructor", "admin"]}>
                <>
                    <Navbar />
                    <EditCourse />
                </>
            </ProtectedRoute>
        )
    },
    {
        path: "/courses/:id",
        element: (
            <>
                <Navbar />
                <CourseDetails />
            </>
        )
    },
    {
        path: "/my-enrollments",
        element: (
            <ProtectedRoute allowedRoles={["student"]}>
                <>
                    <Navbar />
                    <MyEnrollments />
                </>
            </ProtectedRoute>
        )
    },
    {
        path: "/enroll/:id",
        element: (
            <ProtectedRoute allowedRoles={["student"]}>
                <>
                    <Navbar />
                    <EnrollCourse />
                </>
            </ProtectedRoute>
        )
    },
    {
        path: "/enrollment/:id",
        element: (
            <ProtectedRoute allowedRoles={["student"]}>
                <>
                    <Navbar />
                    <EnrollmentDetails />
                </>
            </ProtectedRoute>
        )
    },
    {
        path: "/assignments",
        element: (
            <>
                <Navbar />
                <Assignments />
            </>
        )
    },
    {
        path: "/create-assignment",
        element: (
            <>
                <Navbar />
                <CreateAssignment />
            </>
        )
    },
    {
        path: "/edit-assignment/:id",
        element: (
            <>
                <Navbar />
                <EditAssignment />
            </>
        )
    },
  
    {
        path: "/submissions",
        element: (
            <>
                <Navbar />
                <Submissions />
            </>
        )
    },
    {
        path: "/create-submission",
        element: (
            <>
                <Navbar />
                <CreateSubmission />
            </>
        )
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;