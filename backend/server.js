require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middleware/errors");

const authRoutes = require("./src/routes/auth");
const topicRoutes = require("./src/routes/topics");
const questionRoutes = require("./src/routes/questions");
const progressRoutes = require("./src/routes/progress");

if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET. Copy .env.example to .env and set it.");
    process.exit(1);
}

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
    cors({
        origin(origin, callback) {
            // allow tools like curl/Postman (no origin) and the configured frontends
            if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
            callback(new Error("Not allowed by CORS"));
        },
    })
);
app.use(express.json({ limit: "200kb" }));

// Stop password guessing on login/register
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts. Try again in a few minutes." },
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("Could not connect to MongoDB:", err.message);
        process.exit(1);
    });
