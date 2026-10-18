// Usage:
//   npm run seed                      imports data/question.json (or the starter set if that file is missing)
//   npm run seed -- path/to/file.json imports a different file
//   npm run seed -- --prune           also deletes questions that are no longer in the file
//
// Re-running is safe: a question is matched by topic + title, so its id stays the same and
// users' solved / saved progress keeps pointing at the right question.

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Question = require("../models/Question");
const { normalize } = require("./normalize");

const args = process.argv.slice(2);
const prune = args.includes("--prune");
const fileArg = args.find((a) => !a.startsWith("--"));

const defaultFile = path.join(__dirname, "../../data/question.json");
const file = path.resolve(fileArg || defaultFile);

const load = () => {
    if (fs.existsSync(file)) {
        let json;
        try {
            json = JSON.parse(fs.readFileSync(file, "utf8").replace(/^﻿/, ""));
        } catch (err) {
            throw new Error(`${file} is not valid JSON: ${err.message}`);
        }
        const result = normalize(json);
        if (result.questions.length === 0) {
            throw new Error(`No questions found in ${file}. Check that each question has a title.`);
        }
        return { source: file, ...result };
    }

    if (fileArg) throw new Error(`File not found: ${file}`);

    console.log("data/question.json not found, using the small starter set instead.");
    const starter = require("../data/questions");
    return { source: "starter set", questions: starter, problems: null };
};

(async () => {
    try {
        const { source, questions, problems } = load();
        console.log(`Read ${questions.length} questions from ${source}`);

        if (problems) {
            const notes = [];
            if (problems.noTopic) notes.push(`${problems.noTopic} had no topic (put under "General")`);
            if (problems.noLink) notes.push(`${problems.noLink} had no link`);
            if (problems.noDifficulty) notes.push(`${problems.noDifficulty} had no difficulty (set to Medium)`);
            if (problems.duplicates) notes.push(`${problems.duplicates} duplicates skipped`);
            if (notes.length) console.log("Heads up: " + notes.join("; ") + ".");
        }

        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dsa-tracker");

        const result = await Question.bulkWrite(
            questions.map((q) => ({
                updateOne: {
                    filter: { topic: q.topic, title: q.title },
                    update: { $set: { leetcode: q.leetcode, difficulty: q.difficulty, order: q.order } },
                    upsert: true,
                },
            }))
        );
        console.log(`Added ${result.upsertedCount}, updated ${result.modifiedCount}.`);

        if (prune) {
            const keep = questions.map((q) => ({ topic: q.topic, title: q.title }));
            const removed = await Question.deleteMany({ $nor: keep });
            console.log(`Removed ${removed.deletedCount} questions that are not in the file.`);
        }

        const topics = await Question.distinct("topic");
        console.log(`Database now has ${await Question.countDocuments()} questions in ${topics.length} topics.`);
    } catch (err) {
        console.error("Seeding failed:", err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
