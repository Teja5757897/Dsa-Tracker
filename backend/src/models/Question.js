const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        topic: { type: String, required: true, trim: true, index: true },
        leetcode: { type: String, default: "" }, // problem link
        difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
        order: { type: Number, default: 0 }, // keeps topics and questions in sheet order
    },
    { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
