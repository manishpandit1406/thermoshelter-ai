import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Try PostgreSQL first; fall back to SQLite for local dev (zero setup)
_pg_url = os.getenv("DATABASE_URL")
if _pg_url:
    DATABASE_URL = _pg_url
    _connect_args = {}
else:
    _db_path = os.path.join(os.path.dirname(__file__), "..", "..", "thermoshelter.db")
    DATABASE_URL = f"sqlite:///{os.path.abspath(_db_path)}"
    _connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=_connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
