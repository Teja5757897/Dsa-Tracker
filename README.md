# DSA Tracker

Track your progress through a DSA question sheet. React frontend, Node/Express backend, MongoDB database.

```
dsa-tracker/
  backend/    API: login, register, topics, questions, progress sync
  frontend/   React app (Vite)
```

## Setup (first time)

1. Install **Node.js 18+** and **MongoDB** (local install, or a free MongoDB Atlas cluster).
2. From this folder:

```bash
npm run install:all                 # installs everything
cp backend/.env.example backend/.env
```

3. Open `backend/.env` and set:
   - `MONGO_URI`: your MongoDB address (the default works for a local MongoDB)
   - `JWT_SECRET`: any long random text. Generate one with
     `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

4. Put your questions at `backend/data/question.json`, then load them:

```bash
npm run seed
```

(Without that file it loads a small sample set so you can try the app.)

## Run

```bash
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:5000 (check http://localhost:5000/api/health)

Open the app, click **Sign up**, and create an account.

## Notes

- Frontend talks to `http://localhost:5000` by default. To change it, copy `frontend/.env.example` to `frontend/.env` and edit `VITE_API_URL`.
- Re-running `npm run seed` after editing `question.json` is safe: question ids stay the same, so users' saved progress keeps working.
- When you deploy, add your website address to `CLIENT_URL` in `backend/.env`.
- More detail on the API and the importer: `backend/README.md`.
