from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/api/wishlist",
    tags=["Wishlist"]
)

@router.get("/{user_id}")
def get_wishlist(user_id: int, db: Session = Depends(get_db)):
    wish_items = db.query(models.WishlistItem).filter(models.WishlistItem.user_id == user_id).all()
    
    result = []
    for item in wish_items:
        result.append({
            "id": item.product.id, 
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
    # Check if item already exists in wishlist
    existing_item = db.query(models.WishlistItem).filter(
        models.WishlistItem.user_id == data.user_id,
        models.WishlistItem.product_id == data.product_id
    ).first()

    if existing_item:
        db.delete(existing_item)
        db.commit()
        return {"status": "removed", "message": "Removed from wishlist"}
    else:
        new_item = models.WishlistItem(
            user_id=data.user_id,
            product_id=data.product_id
        )
        db.add(new_item)
        db.commit()
        return {"status": "added", "message": "Added to wishlist"}