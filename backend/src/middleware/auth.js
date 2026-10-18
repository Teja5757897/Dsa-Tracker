const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Requires "Authorization: Bearer <token>"
const requireAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;

        if (!token) {
            return res.status(401).json({ message: "Please log in to continue." });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return res.status(401).json({ message: "Your session has expired. Log in again." });
        }

        const user = await User.findById(payload.id);
        if (!user) {
            return res.status(401).json({ message: "This account no longer exists." });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { requireAuth };
