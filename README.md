# AI-Assisted Requirement Engineering and Automated System Design Generation Using Large Language Models

A web platform that converts natural language software requirements into complete software
engineering artifacts (functional & non-functional requirements, user stories, use cases,
database schema, ER diagrams, UML diagrams, REST API design, sprint planning, software
architecture, project modules, and a consistency report) using Google's Gemini API.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, Axios, Mermaid.js, PlantUML (rendered via plantuml.com)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL + SQLAlchemy + Alembic
- **Auth**: JWT
- **AI**: Gemini API (`google-generativeai`)
- **PDF Export**: ReportLab

## Project Structure

```
project/
├── backend/
│   ├── app/
│   │   ├── agents/          # 10 AI agents (requirement analysis, generation, diagrams, consistency, etc.)
│   │   ├── core/             # config, database, security, gemini client, pipeline, pdf export
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routers/           # auth & projects API routes
│   │   ├── schemas/            # Pydantic schemas
│   │   └── main.py
│   ├── alembic/                 # DB migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── render.yaml
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                # axios client + auth/project API calls
│   │   ├── components/         # Navbar, Sidebar, ArtifactViewer, MermaidDiagram, PlantUMLDiagram, etc.
│   │   ├── context/             # AuthContext
│   │   ├── pages/               # Landing, Login, Register, Dashboard, CreateProject, ProjectWorkspace, History, Profile
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   ├── vercel.json
│   └── .env.example
└── docker-compose.yml
```

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+ (or use Docker Compose)
- A Gemini API key from https://aistudio.google.com/app/apikey

## Quick Start (Docker Compose)

```bash
cd project
export GEMINI_API_KEY=your_gemini_api_key_here
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Manual Setup (Local Development)

### 1. Database

```bash
# Using local PostgreSQL
createdb airequirements
```

Or run only the db service via Docker:
```bash
docker compose up -d db
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and set:
#   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/airequirements
#   SECRET_KEY=<generate a long random string>
#   GEMINI_API_KEY=<your gemini api key>

alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Backend runs at http://localhost:8000 (Swagger docs at `/docs`).

### 3. Frontend

```bash
cd frontend
npm install

cp .env.example .env
# Edit .env:
#   VITE_API_BASE_URL=http://localhost:8000

npm run dev
```

Frontend runs at http://localhost:5173.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret (use a long random string) |
| `ALGORITHM` | JWT algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes (default `1440`) |
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `FRONTEND_ORIGIN` | Frontend URL for CORS (e.g. `http://localhost:5173`) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |

## Database Migrations

```bash
cd backend
alembic upgrade head           # apply migrations
alembic revision --autogenerate -m "description"   # create new migration after model changes
```

## Application Flow

1. User registers/logs in (JWT issued).
2. User creates a project with a natural language requirement description.
3. Backend kicks off a background pipeline of 10 AI agents using Gemini:
   - Requirement Analysis → Requirements Generation → User Stories → Use Cases →
     Database Design → ER Diagram (Mermaid) → UML Diagrams (PlantUML) → API Design →
     Sprint Planning → Architecture/Modules → Consistency Validation
4. Results are stored in PostgreSQL (`artifacts`, `diagrams`, `consistency_reports`, `history`).
5. User views all artifacts inside a single Project Workspace (sidebar navigation, no page reloads).
6. User can export everything as a single PDF via ReportLab.

## Deployment

### Backend → Render
`backend/render.yaml` defines a Render web service + managed PostgreSQL database.
Set `SECRET_KEY`, `GEMINI_API_KEY`, `DATABASE_URL`, and `FRONTEND_ORIGIN` in the Render dashboard.

### Frontend → Vercel
`frontend/vercel.json` configures the Vite build and SPA rewrites.
Set `VITE_API_BASE_URL` to your deployed backend URL in Vercel project environment variables.

## Notes

- The AI generation pipeline runs as a FastAPI `BackgroundTask`. For production scale, replace
  this with a proper task queue (Celery + Redis, or RQ) to handle retries and concurrency.
- PlantUML diagrams are rendered via the public `plantuml.com` server (requires internet access
  from the browser). For air-gapped deployments, self-host a PlantUML server and update
  `PlantUMLDiagram.jsx`.
- The Consistency Engine cross-checks extracted entities against user stories, use cases,
  database schema, API design, and diagrams, producing a 0-100% consistency score plus a
  relationship-validation report.
