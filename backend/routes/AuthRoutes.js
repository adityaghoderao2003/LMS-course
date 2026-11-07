const express = require("express");
const router = express.Router();

const {
    Register,
    Login
} = require("../controllers/AuthController");

// Register
router.post("/register", Register);

// Login
router.post("/login", Login);

module.exports = router;