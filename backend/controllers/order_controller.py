from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import uuid
import models
import schemas
from database import get_db
from utils.email_sender import send_order_confirmation_email

router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)



@router.post("/place")
def place_order(order_data: schemas.OrderCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    
    # 1. Get the user to find their real email and name
    user = db.query(models.User).filter(models.User.id == order_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == order_data.user_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = sum(item.product.price * item.quantity for item in cart_items)
    order_number = f"OD-{uuid.uuid4().hex[:10].upper()}"

    new_order = models.Order(
        order_number=order_number,
        user_id=order_data.user_id,
        total_amount=total_amount,
        status="Order Confirmed",
        payment_method=order_data.payment_method,
        shipping_address=order_data.shipping_address.dict(),
        shipping_pincode=order_data.shipping_address.pincode
    )
    db.add(new_order)
    db.flush() 

    # We need to save a copy of the items for the email before we delete them from the cart
    items_for_email = list(cart_items) 

    for item in cart_items:
        order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=item.product.price
        )
        db.add(order_item)
        db.delete(item)

    db.commit()

    # --- NEW: Trigger the email in the background! ---
    background_tasks.add_task(
        send_order_confirmation_email,
        receiver_email=user.email,
        user_name=user.first_name,
        order_number=order_number,
        total_amount=total_amount,
        items=items_for_email
    )

    return {"message": "Order placed successfully", "order_number": order_number}

@router.get("/{user_id}")
def get_orders(user_id: int, db: Session = Depends(get_db)):
    # Fetch orders sorted by newest first
    orders = db.query(models.Order).filter(models.Order.user_id == user_id).order_by(models.Order.created_at.desc()).all()
    
    result = []
    for order in orders:
        items = []
        for item in order.items:
            items.append({
                "product_name": item.product.name,
                "brand": item.product.brand,
                "image_url": item.product.image_url,
                "quantity": item.quantity,
                "price": item.price_at_purchase
            })
        
        result.append({
            "id": order.order_number,
            "status": order.status,
            "dateText": order.created_at.strftime("%b %d, %Y"),
            "total_amount": order.total_amount,
            "items": items
        })
        
    return result