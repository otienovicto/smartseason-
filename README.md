# SmartSeason — Field Monitoring System

Lightweight full-stack sample app to track crop progress across multiple fields during a growing
season. Built as a technical assessment / demo project (backend: Django + DRF, frontend: React + Vite).

This README covers local setup, key design decisions, API overview, demo credentials, and where to
find the core business logic.

---

## TL;DR

- Run the backend (Django) on port `8008` and the frontend (Vite) on the default `5173` port.
- The frontend expects the API at `http://localhost:8008/api` (adjust with `VITE_API_URL`).
- Create demo users via the register endpoint or with `createsuperuser`.

---

## Tech stack

- Backend: Django 6 + Django REST Framework + djangorestframework-simplejwt
- Frontend: React + Vite + axios
- DB: SQLite locally by default; Postgres-ready via `DATABASE_URL` (dj-database-url)

---

## Features implemented

- JWT authentication (login + refresh)
- Two roles: `ADMIN` and `AGENT` (role is stored on the user model)
- Field CRUD (Admin), including assignment to agents
- Field updates (agents can post stage updates + notes)
- Computed field `status` (Active / At Risk / Completed)
- Dashboard for Admin and Agent (totals, status breakdown, recent updates)
- Admin UI: create users, inline edit/delete users
- Fields UI: create fields, inline edit/reassign fields, view details and updates
- Simple modern UI and responsive card-based layout

Not included here: automated tests, production deployment pipeline, and advanced charts (planned).

---

## Quick start (development)

Prerequisites:

- Python 3.10+ (project used a 3.x venv)
- Node.js & npm

1) Install Python dependencies

```powershell
# from project root
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

2) Apply migrations and create a superuser (optional)

```powershell
cd backend
# create DB + run migrations
venv\Scripts\activate
python manage.py migrate

# create a superuser (optional; gives `is_superuser=True`)
python manage.py createsuperuser

# start backend
python manage.py runserver 0.0.0.0:8008
```

3) Frontend

```bash
cd frontend
npm install
# (optional) set API url, e.g. in frontend/.env
echo "VITE_API_URL=http://localhost:8008/api" > .env
npm run dev
```

Open the app at `http://localhost:5173`.

---

## Demo credentials (quick seed)

Created demo accounts using the public register endpoint:

```bash
# Admin
curl -X POST http://localhost:8008/login -H "Content-Type: application/json" \
  -d '{"username":"otieno","email":"otieno@gmail.com","password":"0284","name":"Victor Otieno","role":"ADMIN"}'

# Agent
curl -X POST http://localhost:8008/login -H "Content-Type: application/json" \
  -d '{"username":"obuwa","email":"otienovictor502@gmail.com","password":"Loch2023","name":"Field Agent","role":"AGENT"}'
```

Or create a true Django superuser (recommended for admin console access):

```powershell
python manage.py createsuperuser
```

Login (token):

```bash
curl -X POST http://localhost:8008/api/auth/login/ -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"AdminPass123"}'
```

Use the returned `access` token as `Authorization: Bearer <token>` for API requests.

---

## API overview (important endpoints)

- POST `/api/auth/login/` — obtain JWT access/refresh tokens
- POST `/api/auth/token/refresh/` — refresh access token
- POST `/api/users/register/` — create user (username, password, role)
- GET `/api/users/me/` — current user
- GET/POST/PATCH/DELETE `/api/users/` — user CRUD (update/delete restricted to Admin)
- GET/POST/PATCH/DELETE `/api/fields/` — field CRUD (creation/update/destroy restricted to Admin)
- GET/POST `/api/fields/{id}/updates/` — list or create updates for a field (agents post updates)
- GET `/api/dashboard/` — admin/agent dashboard summary

Refer to the source for exact behavior and permission rules.

---

## Field status logic (how `status` is computed)

Implemented in the `Field` model: the `status` property returns one of:

- `Completed`: when `current_stage` is `harvested`.
- `At Risk`: when recent updates' notes contain risk keywords (e.g. `disease`, `pest`), or when the field has
  not changed stage for `STALE_DAYS` (14 days by default).
- `Active`: otherwise.

This logic lives in the model and is used by the dashboard summarizer. See the implementation at:

- `backend/apps/fields/models.py` (property `status`)

Note: `STALE_DAYS` and `RISK_KEYWORDS` are currently hard-coded in the model; they can be moved to settings later.

---

## Key files (overview)

- Field model & status logic: `backend/apps/fields/models.py`
- Field serializers & viewset: `backend/apps/fields/serializers.py`, `backend/apps/fields/views.py`
- Dashboard endpoint: `backend/apps/dashboard/views.py`
- User registration/login: `backend/apps/users/serializers.py`, `backend/config/urls.py`
- Frontend pages:
  - `frontend/src/pages/DashboardPage.jsx`
  - `frontend/src/pages/FieldsPage.jsx`
  - `frontend/src/pages/FieldDetailPage.jsx`
  - `frontend/src/pages/AdminPage.jsx`

---

## Notes, troubleshooting and gotchas

- If you change serializers or model fields, restart the Django dev server so code reloads correctly.
- If migrations are inconsistent (manual edits to migrations), you may need to reset the DB locally:

  1. backup your data
  2. remove `backend/db.sqlite3`
  3. `python manage.py makemigrations` then `python manage.py migrate`

- The register endpoint is public for convenience in the demo. In a production system you'd restrict who can create `ADMIN` users.

---

## Tests & next steps


## Contact

Phone: 0745651224
Email: otienovictor502@gmail.com

---

# SmartSeason Field Monitoring System

Scaffold for the SmartSeason technical assessment. This repository contains a backend (Django) and frontend (React) scaffold.

Directories:
- `backend/` - Django project skeleton
- `frontend/` - React app skeleton (Vite)
- `docs/` - architecture and API notes

## Phase 0 — Project Definition

- **System name:** SmartSeason

- **Roles:**
	- Admin (Coordinator)
	- Field Agent

- **Field lifecycle:** Planted → Growing → Ready → Harvested

- **Status logic (recommended):**
	- **Completed:** stage = 'harvested'
	- **At Risk:** stage has not changed in X days (default: 14 days) OR notes contain keywords such as 'disease' or 'pest'
	- **Active:** everything else


