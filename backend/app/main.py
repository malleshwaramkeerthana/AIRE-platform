from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.routers import auth, projects
import app.models  # noqa: F401  (ensures models are registered with Base)

app = FastAPI(
    title="AI-Assisted Requirement Engineering Platform",
    description="Converts natural language software requirements into complete software engineering artifacts using LLMs.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    settings.FRONTEND_ORIGIN.strip(),
    "https://aire-platform-eta.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)


@app.on_event("startup")
def on_startup():
    # Creates tables if they do not exist. For production use, prefer Alembic migrations.
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"status": "ok", "service": "AI Requirement Engineering Platform API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
