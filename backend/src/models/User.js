const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false, // never returned unless asked for explicitly
        },
        // Saved progress, synced from the browser
        progress: {
            solved: { type: [String], default: [] },
            saved: { type: [String], default: [] },
            solvedDates: { type: mongoose.Schema.Types.Mixed, default: {} }, // { questionId: "YYYY-MM-DD" }
            dailyTarget: { type: Number, default: 3, min: 1, max: 50 },
            updatedAt: { type: Date, default: null },
        },
    },
    { timestamps: true, minimize: false }
);

module.exports = mongoose.model("User", userSchema);
