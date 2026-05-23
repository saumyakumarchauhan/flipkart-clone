import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database
from models import Base

# Load environment variables from the .env file
load_dotenv()

# Fetch the database URL from the .env file
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Safety check: Prevent crash if .env is missing or named incorrectly
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set. Check your .env file!")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Check if the database exists. If not, create it automatically!
if not database_exists(engine.url):
    create_database(engine.url)
    print("Database 'flipkart_db' created successfully!")
else:
    print("Database 'flipkart_db' already exists.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()