import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Try PostgreSQL first; fall back to MySQL for local dev
_pg_url = os.getenv("DATABASE_URL")
if _pg_url:
    DATABASE_URL = _pg_url
    _connect_args = {}
else:
    DATABASE_URL = "mysql+pymysql://root:Ashish%401406@localhost/thermoshelter"
    _connect_args = {}

engine = create_engine(DATABASE_URL, connect_args=_connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
