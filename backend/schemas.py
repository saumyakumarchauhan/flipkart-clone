from pydantic import BaseModel, EmailStr
from typing import List, Optional

# -------------------------
# AUTHENTICATION SCHEMAS
# -------------------------
class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    gender: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    gender: str
    addresses: list = []

    class Config:
        from_attributes = True

# -------------------------
# PRODUCT SCHEMAS
# -------------------------
class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class ProductResponse(BaseModel):
    id: int
    brand: str
    name: str
    description: str
    price: float
    original_price: float
    discount: int
    rating: float
    reviews_count: int
    image_url: Optional[str] = None
    sizes: List[str] = []
    offers: List[str] = []
    
    # This will nest the category inside the product JSON!
    category: CategoryResponse

    class Config:
        from_attributes = True


# -------------------------
# CART SCHEMAS
# -------------------------
class CartItemAdd(BaseModel):
    user_id: int
    product_id: int
    quantity: int = 1


# -------------------------
# ORDER SCHEMAS
# -------------------------
class AddressSchema(BaseModel):
    name: str
    pincode: str
    details: str

class OrderCreate(BaseModel):
    user_id: int
    payment_method: str = "COD"
    shipping_address: AddressSchema


# -------------------------
# WISHLIST SCHEMAS
# -------------------------
class WishlistToggle(BaseModel):
    user_id: int
    product_id: int


class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    gender: str

class AddressUpdate(BaseModel):
    addresses: list