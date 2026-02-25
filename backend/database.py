from sqlalchemy import create_engine
import sys
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./livrocaixa.db")

# Diagnostics for production
if not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    print("--- ENVIRONMENT DIAGNOSTICS ---")
    print(f"Python Version: {sys.version}")
    print(f"Working Directory: {os.getcwd()}")
    try:
        import psycopg2
        print(f"psycopg2 version: {psycopg2.__version__}")
        print(f"psycopg2 file: {psycopg2.__file__}")
    except ImportError as e:
        print(f"CRITICAL: Failed to import psycopg2: {e}")
    print("-------------------------------")

# Standardize PostgreSQL connection string
if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

# For SQLite, we need to allow multi-threaded access
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
