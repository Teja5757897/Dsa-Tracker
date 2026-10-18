# DSA Tracker backend

Express + MongoDB API for the DSA Tracker frontend. It handles sign up and login, serves topics and questions, and saves each user's progress so it follows them across devices.

## Run it

1. Install Node 18 or newer and have MongoDB running (local, or a free MongoDB Atlas cluster).
2. In this folder:

```bash
npm install
cp .env.example .env     # then open .env and set MONGO_URI and JWT_SECRET
npm run seed             # imports data/question.json (or a small starter set if the file is missing)
npm run dev              # http://localhost:5000
```

Check it works: open http://localhost:5000/api/health, it should return `{"status":"ok"}`.

## Endpoints

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | no | `{ user, token }` from `{ username, email, password }` |
| POST | `/api/auth/login` | no | `{ user, token }` from `{ email, password }` |
| GET | `/api/auth/me` | yes | `{ user }` |
| GET | `/api/topics` | no | `[{ name, questionCount, questionIds }]` |
| GET | `/api/questions` | no | every question |
| GET | `/api/questions/topic/:topic` | no | questions in one topic |
| GET | `/api/progress` | yes | `{ solved, saved, solvedDates, dailyTarget, updatedAt }` |
| PUT | `/api/progress` | yes | saves the same shape |

Protected routes need the header `Authorization: Bearer <token>`.

A question looks like `{ _id, title, topic, difficulty, leetcode, order }`.

## Importing your questions (question.json)

1. Put your file at `data/question.json`.
2. Run `npm run seed`. It prints how many questions it read and flags anything missing (topic, link, difficulty).

The importer accepts these layouts, and matches field names loosely (`title` / `name` / `question`, `topic` / `category` / `section`, `link` / `url` / `leetcode`, `difficulty` / `level`):

- a flat array: `[{ "title": "Two Sum", "topic": "Array", "link": "...", "difficulty": "Easy" }]`
- grouped by topic: `{ "Array": [{ ... }], "String": [{ ... }] }`
- nested: `{ "topics": [{ "name": "Array", "questions": [{ ... }] }] }`

Re-running is safe. Questions are matched by topic + title, so ids stay the same and users' saved progress keeps working. Add `--prune` to also delete questions that are no longer in the file, or pass another path: `npm run seed -- path/to/file.json`.

## Settings (.env)

- `PORT`: default 5000
- `MONGO_URI`: your MongoDB connection string
- `JWT_SECRET`: long random string, required
- `JWT_EXPIRES_IN`: how long a login lasts, default `7d`
- `CLIENT_URL`: frontend addresses allowed to call the API, comma separated. Add your deployed frontend URL here.

## Notes

- Passwords are hashed with bcrypt and never returned by the API.
- Login and register are rate limited to slow down password guessing.
