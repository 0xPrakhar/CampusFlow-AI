# CampusFlow AI

CampusFlow AI is a small, end-to-end college operations MVP.

`Student request → AI analysis → PostgreSQL → Notion → staff approval → safe action → audit log`

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, PostgreSQL, JWT, bcrypt
- Integrations: OpenAI-compatible AI API and Notion API

The brief mentioned both MongoDB and PostgreSQL. This implementation uses **PostgreSQL**, as requested in the technology list; `DATABASE_URL` replaces `MONGO_URI`.

## Quick start

### 1. Create a PostgreSQL database

Create a database called `campusflow` in PostgreSQL.

### 2. Configure the backend

```powershell
cd backend
Copy-Item .env.example .env
```

Edit `backend/.env` with your PostgreSQL connection and random JWT secrets. For a complete local demo without external services, leave `AI_MODE=mock` and `NOTION_ENABLED=false`.

```powershell
npm install
npm run db:migrate
npm run db:seed-staff
npm run dev
```

The API starts on `http://localhost:8080`.

### 3. Configure and run the frontend

From the project root:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). The root `.env.example` sets `VITE_DEMO_MODE=false`, which makes the UI call the Express backend at `VITE_API_URL`.

## Accounts

- Public registration always creates a `STUDENT` account.
- A `STAFF` account is intentionally created only by the seed script.
- The default development staff credentials from `backend/.env.example` are `admin@campusflow.ai` / `Admin@123`. Change them before any shared deployment.

## End-to-end demo

1. Create a student account from the registration page.
2. Sign in as that student and submit a natural-language request.
3. The backend validates the AI result, stores it in PostgreSQL, and creates a Notion record when Notion is enabled.
4. Sign out, then sign in using the seeded staff account.
5. Open the pending request and approve it.
6. The backend runs only its safe simulated action and marks it `COMPLETED`.
7. Open **Run logs** to see the audit history.

## AI and Notion modes

- `AI_MODE=mock` is a deterministic local analyser for development. It lets the full workflow work without an API key.
- `AI_MODE=live` calls an OpenAI-compatible `POST /chat/completions` endpoint using `AI_API_KEY`, `AI_MODEL`, and `AI_BASE_URL`. Its output is validated before it is saved.
- Set `NOTION_ENABLED=true` only after creating the documented Notion database fields. When disabled, the backend records `NOTION_SYNC_SKIPPED` in the run log but the approval workflow still works locally.

See [backend/API.md](backend/API.md) for endpoints, payloads, errors, and Postman/curl testing.
