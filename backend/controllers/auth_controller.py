from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import bcrypt # <-- Using bcrypt directly now
import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# --- NEW BCRYPT HELPER FUNCTIONS ---
def get_password_hash(password: str) -> str:
    # bcrypt requires passwords to be encoded as bytes
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password.decode('utf-8') # Decode back to string for database

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)
# -----------------------------------

@router.post("/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    user_email_lower = user.email.lower() # Force lowercase
    
    db_user = db.query(models.User).filter(models.User.email == user_email_lower).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_phone = db.query(models.User).filter(models.User.phone == user.phone).first()
    if db_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    hashed_password = get_password_hash(user.password)
    
    new_user = models.User(
        first_name=user.firstName,
        last_name=user.lastName,
        email=user_email_lower, # Save lowercase
        phone=user.phone,
        gender=user.gender,
        password_hash=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login")
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    user_email_lower = user.email.lower() # Force lowercase
    
    db_user = db.query(models.User).filter(models.User.email == user_email_lower).first()
    
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    return {
        "message": "Login successful",
        "user": {
            "id": db_user.id,
            "name": f"{db_user.first_name} {db_user.last_name}",
            "email": db_user.email
        }
    }