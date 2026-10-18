// Turns whatever shape question.json has into the rows the app stores:
//   { title, topic, leetcode, difficulty, order }
//
// Accepted layouts:
//   1. A flat array:        [{ title, topic, link, difficulty }, ...]
//   2. Grouped by topic:    { "Array": [{...}, ...], "String": [...] }
//   3. Nested topics:       { topics: [{ name, questions: [{...}] }] }  or  [{ topic, questions: [...] }]
//   4. Wrapped:             { questions: [...] }  or  { data: [...] }
// Field names are matched loosely (title / name / question, topic / category / section, link / url / leetcode ...).

const TITLE_KEYS = ["title", "name", "question", "problem", "questionTitle", "question_title", "Problem", "Question", "Title", "Name"];
const TOPIC_KEYS = ["topic", "category", "section", "topicName", "topic_name", "Topic", "Category", "Section", "tag", "chapter"];
const LINK_KEYS = [
    "leetcode", "leetcodeLink", "leetcode_link", "leetcodeUrl", "leetcode_url", "LeetCode", "Leetcode",
    "link", "Link", "url", "URL", "problemLink", "problem_link", "problemUrl", "practice", "practiceLink",
    "gfg", "GFG", "codingninjas", "href",
];
const DIFFICULTY_KEYS = ["difficulty", "level", "Difficulty", "Level", "diff"];

const pick = (obj, keys) => {
    for (const key of keys) {
        const value = obj[key];
        if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
};

const normalizeDifficulty = (raw) => {
    const value = String(raw || "").trim().toLowerCase();
    if (!value) return "";
    if (["easy", "basic", "school", "beginner", "e"].includes(value)) return "Easy";
    if (["medium", "med", "intermediate", "m"].includes(value)) return "Medium";
    if (["hard", "difficult", "advanced", "h"].includes(value)) return "Hard";
    return "";
};

const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);

// Walks the file and returns every question-like object with the topic it sits under.
const collect = (node, topicHint, out) => {
    if (Array.isArray(node)) {
        for (const item of node) collect(item, topicHint, out);
        return;
    }
    if (!isObject(node)) return;

    const title = pick(node, TITLE_KEYS);
    const nestedKey = ["questions", "problems", "items", "list", "data"].find((k) => Array.isArray(node[k]));

    // a group: { name/topic: "Array", questions: [...] }
    if (nestedKey && (!title || pick(node, TOPIC_KEYS) || node.name)) {
        const groupName = pick(node, TOPIC_KEYS) || pick(node, ["name", "title"]) || topicHint;
        collect(node[nestedKey], groupName, out);
        return;
    }

    // a question
    if (title) {
        out.push({ raw: node, title, topic: pick(node, TOPIC_KEYS) || topicHint });
        return;
    }

    // { topics: [...] } / { questions: [...] } wrappers, or { "Array": [...], "String": [...] }
    for (const [key, value] of Object.entries(node)) {
        if (Array.isArray(value) || isObject(value)) {
            const isWrapper = ["topics", "questions", "problems", "data", "items", "sheet", "list"].includes(key);
            collect(value, isWrapper ? topicHint : key, out);
        }
    }
};

function normalize(json) {
    const found = [];
    collect(json, "", found);

    const seen = new Set();
    const questions = [];
    const problems = { noTopic: 0, noLink: 0, noDifficulty: 0, duplicates: 0 };

    for (const { raw, title, topic } of found) {
        const finalTopic = topic || "General";
        if (!topic) problems.noTopic += 1;

        const key = `${finalTopic.toLowerCase()}||${title.toLowerCase()}`;
        if (seen.has(key)) {
            problems.duplicates += 1;
            continue;
        }
        seen.add(key);

        const leetcode = pick(raw, LINK_KEYS);
        if (!leetcode) problems.noLink += 1;

        const difficulty = normalizeDifficulty(pick(raw, DIFFICULTY_KEYS));
        if (!difficulty) problems.noDifficulty += 1;

        questions.push({
            title,
            topic: finalTopic,
            leetcode,
            difficulty: difficulty || "Medium",
            order: questions.length + 1,
        });
    }

    return { questions, problems };
}

module.exports = { normalize };
