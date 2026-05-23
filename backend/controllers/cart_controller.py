from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/api/cart",
    tags=["Cart"]
)

# Helper function to satisfy the assignment requirement: "Assume a default user is logged in"
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
def get_cart(user_id: int, db: Session = Depends(get_db)):
    # Fetch all cart items for this user (If they don't exist, it just returns [])
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()
    
    result = []
    for item in cart_items:
        result.append({
            "id": item.id, 
            "product_id": item.product.id,
            "name": item.product.name,
            "brand": item.product.brand,
            "price": item.product.price,
            "originalPrice": item.product.original_price,
            "discount": item.product.discount,
            "image_url": item.product.image_url,
            "quantity": item.quantity
        })
    return result

@router.post("/add")
def add_to_cart(cart_item: schemas.CartItemAdd, db: Session = Depends(get_db)):
    # Check if this exact product is already in the user's cart
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == cart_item.user_id,
        models.CartItem.product_id == cart_item.product_id
    ).first()

    if existing_item:
        existing_item.quantity += cart_item.quantity
        db.commit()
        return {"message": "Quantity increased", "cart_item_id": existing_item.id}
    else:
        new_item = models.CartItem(
            user_id=cart_item.user_id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity
        )
        db.add(new_item)
        db.commit()
        return {"message": "Added to cart", "cart_item_id": new_item.id}

@router.put("/update/{cart_item_id}")
def update_quantity(cart_item_id: int, quantity: int = Query(...), db: Session = Depends(get_db)):
    item = db.query(models.CartItem).filter(models.CartItem.id == cart_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    if quantity <= 0:
        db.delete(item)
    else:
        item.quantity = quantity
        
    db.commit()
    return {"message": "Cart updated"}

@router.delete("/remove/{cart_item_id}")
def remove_from_cart(cart_item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.CartItem).filter(models.CartItem.id == cart_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}