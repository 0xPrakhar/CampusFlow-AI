# CampusFlow API

Base URL: `http://localhost:8080`

All protected routes require:

```http
Authorization: Bearer <accessToken>
```

Error format:

```json
{ "error": { "code": "FORBIDDEN", "message": "You do not have access to this resource." } }
```

## Authentication

### `POST /api/auth/register`

- Authentication: No
- Role: Public; always creates `STUDENT`

```json
{ "username": "aman", "fullName": "Aman Kumar", "email": "aman@college.edu", "password": "secret123" }
```

Response `201`:

```json
{ "accessToken": "jwt", "user": { "id": 1, "name": "Aman Kumar", "role": "STUDENT" } }
```

Errors: `400` invalid input, `409` email already in use.

### `POST /api/auth/login`

- Authentication: No
- Role: Any existing user

```json
{ "email": "admin@campusflow.ai", "password": "Admin@123" }
```

Response `200`: same session shape as registration.

Errors: `400`, `401` invalid credentials.

### `GET /api/auth/me`

- Authentication: Yes
- Role: STUDENT or STAFF
- Response `200`: `{ "user": { "id": 1, "name": "Aman Kumar", "role": "STUDENT" } }`

### `POST /api/auth/logout`

- Authentication: Yes
- Role: STUDENT or STAFF
- Body: none
- Response: `204`

### `DELETE /api/auth/account`

- Authentication: Yes
- Role: STUDENT or STAFF
- Body: none
- Permanently deletes the signed-in account, its requests, and related run logs.
- Response: `204`

## Student requests

### `POST /api/requests`

- Authentication: Yes
- Role: STUDENT

```json
{ "text": "Sir mujhe internship mil gayi hai, Friday tak NOC chahiye." }
```

Response `201`:

```json
{ "request": { "id": "CF-1001", "category": "NOC", "priority": "HIGH", "summary": "Student requires an NOC for an internship.", "deadline": "Friday", "missingInformation": [], "suggestedAction": "Process NOC", "status": "PENDING_APPROVAL" } }
```

Errors: `400` invalid text, `401`, `403`, `422` invalid AI response, `502` AI provider unavailable.

### `GET /api/requests/my`

- Authentication: Yes
- Role: STUDENT
- Response `200`: `{ "requests": [...] }`, containing only the signed-in student's requests.

### `GET /api/requests/:id`

- Authentication: Yes
- Role: STUDENT
- Response `200`: `{ "request": { ... } }`
- A student cannot retrieve another student's request. Errors: `403`, `404`.

### `GET /api/requests/:id/logs`

- Authentication: Yes
- Role: STUDENT
- Response `200`: `{ "logs": [...] }` for that student's request.

### `DELETE /api/requests/:id`

- Authentication: Yes
- Role: STUDENT
- Permanently deletes the student's own request and related run logs.
- Any linked Notion page is archived when available.
- A student cannot delete another student's request. Errors: `403`, `404`.

## Staff operations

### `GET /api/staff/requests`

- Authentication: Yes
- Role: STAFF
- Response `200`: `{ "requests": [...] }`

### `GET /api/staff/requests/:id`

- Authentication: Yes
- Role: STAFF
- Response `200`: `{ "request": { ... } }`

### `PATCH /api/staff/requests/:id/approve`

- Authentication: Yes
- Role: STAFF
- Body: none
- Only accepts a request in `PENDING_APPROVAL`.

Response `200`:

```json
{ "request": { "id": "CF-1001", "status": "COMPLETED" }, "action": { "message": "NOC processing completed." } }
```

The action is a safe simulation. It runs only after the authenticated staff approval is saved. Errors: `409` invalid status, `404` not found, `500` action failure.

### `PATCH /api/staff/requests/:id/reject`

- Authentication: Yes
- Role: STAFF
- Body: none
- Response `200`: `{ "request": { "status": "REJECTED" } }`

### `GET /api/staff/requests/:id/logs`

- Authentication: Yes
- Role: STAFF
- Response `200`: `{ "logs": [...] }`

### `GET /api/staff/run-logs` or `GET /api/run-logs`

- Authentication: Yes
- Role: STAFF
- Response `200`: `{ "logs": [...] }`

## Health

### `GET /health`

- Authentication: No
- Response `200`: `{ "status": "ok" }`

## Notion database setup

Share the database with the integration and create these properties:

- `Name` — title (or configure `NOTION_TITLE_PROPERTY`)
- `Student` — rich text
- `Category` — select
- `Priority` — select
- `Summary` — rich text
- `Deadline` — rich text
- `Suggested Action` — rich text
- `Status` — select

Then set `NOTION_ENABLED=true`, `NOTION_API_KEY`, and `NOTION_DATABASE_ID` in `backend/.env`.

## Postman / curl test path

1. Run `npm run db:migrate`, then `npm run db:seed-staff` in `backend`.
2. Register a student and copy `accessToken` into a Postman environment as `studentToken`.
3. `POST /api/requests` with `Authorization: Bearer {{studentToken}}`.
4. Login with the seeded staff account and store `accessToken` as `staffToken`.
5. `GET /api/staff/requests`, then approve the returned request id.
6. `GET /api/staff/run-logs` and verify events from request creation through completion.

Example curl request creation:

```bash
curl -X POST http://localhost:8080/api/requests \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Sir mujhe internship mil gayi hai, Friday tak NOC chahiye.\"}"
```
