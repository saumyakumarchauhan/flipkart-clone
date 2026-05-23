from database import engine
import models

print("Dropping all existing tables...")
models.Base.metadata.drop_all(bind=engine)

print("Recreating all tables from scratch...")
models.Base.metadata.create_all(bind=engine)

print("Database reset complete! It is now completely empty.")