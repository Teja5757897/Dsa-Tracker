const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (user) =>
    jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

const publicUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
    try {
        const username = String(req.body.username || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({ message: "Username must be 3 to 30 characters." });
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: "Enter a valid email address." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }
        if (password.length > 72) {
            return res.status(400).json({ message: "Password must be 72 characters or fewer." });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed });

        res.status(201).json({ user: publicUser(user), token: signToken(user) });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }
        next(err);
    }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({ message: "Enter your email and password." });
        }

        const user = await User.findOne({ email }).select("+password");
        const ok = user && (await bcrypt.compare(password, user.password));

        if (!ok) {
            return res.status(401).json({ message: "Email or password is incorrect." });
        }

        res.json({ user: publicUser(user), token: signToken(user) });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me  (used by the frontend to check a saved session)
router.get("/me", requireAuth, (req, res) => {
    res.json({ user: publicUser(req.user) });
});

module.exports = router;
