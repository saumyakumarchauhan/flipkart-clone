from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}/profile")
def update_profile(user_id: int, profile_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.first_name = profile_data.first_name
    user.last_name = profile_data.last_name
    user.email = profile_data.email
    user.phone = profile_data.phone
    user.gender = profile_data.gender
    
    db.commit()
    return {"message": "Profile updated successfully"}

@router.put("/{user_id}/addresses")
def update_addresses(user_id: int, address_data: schemas.AddressUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.addresses = address_data.addresses
    db.commit()
    return {"message": "Addresses updated successfully"}