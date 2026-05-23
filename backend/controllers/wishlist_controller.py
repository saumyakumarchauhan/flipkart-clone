from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/api/wishlist",
    tags=["Wishlist"]
)

def ensure_default_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        default_user = models.User(
            id=user_id,
            first_name="Demo",
            last_name="User",
            email=f"demo{user_id}@example.com",
            phone=f"123456789{user_id}",
            password_hash="dummy_hash"
        )
        db.add(default_user)
        db.commit()

@router.get("/{user_id}")
def get_wishlist(user_id: int, db: Session = Depends(get_db)):
    ensure_default_user(db, user_id)
    
    wish_items = db.query(models.WishlistItem).filter(models.WishlistItem.user_id == user_id).all()
    
    # Format the payload for the React frontend grid
    result = []
    for item in wish_items:
        result.append({
            "id": item.product.id, # Map directly to product fields for unified display
            "brand": item.product.brand,
            "name": item.product.name,
            "price": item.product.price,
            "original_price": item.product.original_price,
            "discount": item.product.discount,
            "rating": item.product.rating,
            "reviews_count": item.product.reviews_count,
            "image_url": item.product.image_url
        })
    return result

@router.post("/toggle")
def toggle_wishlist(data: schemas.WishlistToggle, db: Session = Depends(get_db)):
    ensure_default_user(db, data.user_id)
    
    # Check if item already exists in wishlist
    existing_item = db.query(models.WishlistItem).filter(
        models.WishlistItem.user_id == data.user_id,
        models.WishlistItem.product_id == data.product_id
    ).first()

    if existing_item:
        # If it exists, remove it (un-heart)
        db.delete(existing_item)
        db.commit()
        return {"status": "removed", "message": "Removed from wishlist"}
    else:
        # If it doesn't exist, add it (heart)
        new_item = models.WishlistItem(
            user_id=data.user_id,
            product_id=data.product_id
        )
        db.add(new_item)
        db.commit()
        return {"status": "added", "message": "Added to wishlist"}