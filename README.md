# SmartSeason — Field Monitoring System

SmartSeason is a full-stack field monitoring system designed to track crop progress across multiple fields during a growing season. It was developed as part of a technical assessment and demonstrates a production-ready architecture using Django (REST API) and React (Vite).

The system supports role-based access, field lifecycle tracking, and real-time updates from field agents.

---

## Overview

The application allows:

- Administrators to create and manage fields, assign agents, and monitor overall progress
- Field agents to submit updates on assigned fields
- Real-time visibility into field status based on activity and risk indicators

The backend exposes a REST API secured with JWT authentication, while the frontend consumes these endpoints to provide a responsive user interface.

---

## Tech Stack

**Backend**
- Django 6
- Django REST Framework
- SimpleJWT (authentication)
- dj-database-url (PostgreSQL-ready configuration)

**Frontend**
- React (Vite)
- Axios

**Database**
- SQLite (development)
- PostgreSQL (production-ready via `DATABASE_URL`)

---

## Live Deployment

- Backend (API):  
  https://smartseason-api-438b.onrender.com

- Frontend:  
  https://smartseason-khaki.vercel.app

---

## Repository

GitHub repository:  
https://github.com/otienovicto/smartseason-

The repository includes a complete README with setup instructions, architecture notes, and implementation details.

---

## Demo Credentials

Use the following accounts to test the system:

**Admin**
- Username: `otieno`
- Password: `0284`

**Agent**
- Username: `omondi`
- Password: `12345`

---

## Features

- JWT-based authentication (login + token refresh)
- Role-based access control (Admin / Agent)
- Field management (create, update, assign agents)
- Field updates with notes and lifecycle tracking
- Computed field status:
  - Active
  - At Risk
  - Completed
- Dashboard with totals, status breakdown, and recent updates
- Modular backend architecture (apps: users, fields, dashboard)
- Responsive frontend with reusable components

---

## API Overview

Key endpoints:

- `POST /api/auth/login/` — obtain access and refresh tokens  
- `POST /api/auth/token/refresh/` — refresh access token  
- `GET /api/users/me/` — current authenticated user  
- `GET/POST/PATCH/DELETE /api/users/` — user management (Admin only for modifications)  
- `GET/POST/PATCH/DELETE /api/fields/` — field management  
- `GET/POST /api/fields/{id}/updates/` — field updates  
- `GET /api/dashboard/` — dashboard summary  

All protected routes require:
```

Authorization: Bearer <access_token>

```

---

## Field Status Logic

Field status is computed dynamically in the backend:

- **Completed**: `current_stage = harvested`
- **At Risk**:
  - No stage change within 14 days, or
  - Update notes contain risk indicators (e.g. "pest", "disease")
- **Active**: all other cases

Implementation:
```

backend/apps/fields/models.py

```

---

## Project Structure

```

backend/
apps/
users/
fields/
dashboard/
config/

frontend/
src/
pages/
features/
components/

docs/

````

---

## Local Development Setup

### Prerequisites

- Python 3.10+
- Node.js

---

### Backend

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

cd backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8008
````

---

### Frontend

```bash
cd frontend
npm install

# optional environment variable
echo VITE_API_URL=http://localhost:8008/api > .env

npm run dev
```

Access the app at:

```
http://localhost:5173
```

---

## Design Notes

* The backend is structured into modular Django apps to separate concerns (users, fields, dashboard)
* Business logic (such as field status computation) is handled at the model level
* The API follows REST principles and is secured using JWT
* The frontend uses a service layer (`api.js`) to centralize API communication and token handling
* The system is configured for easy migration from SQLite to PostgreSQL in production

---

## Known Limitations / Future Improvements

* No automated test suite included
* No advanced analytics or visual charts
* Public user registration endpoint (should be restricted in production)
* Basic UI styling (can be enhanced further)

---

## Contact

Victor Otieno Obuwa
Phone: +254 745 651 224
Email: [otienovictor502@gmail.com](mailto:otienovictor502@gmail.com)

```

---


