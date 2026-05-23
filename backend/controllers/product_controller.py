from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

# --- NEW: Import the cache decorator ---
from fastapi_cache.decorator import cache

import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)

# --- NEW: Add the @cache decorator ---
# This saves the exact JSON response in memory for 60 seconds!
@router.get("/", response_model=List[schemas.ProductResponse])
@cache(expire=60)
def get_products(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    category: Optional[str] = None
):
    # Start with a base query to get all products
    query = db.query(models.Product)

    # If the user searched for something, filter by name or brand
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            models.Product.name.ilike(search_term) | 
            models.Product.brand.ilike(search_term)
        )
    
    # If the user clicked a category link, filter by category name
    if category:
        query = query.join(models.Category).filter(models.Category.name == category)

    # Execute the query and get the results
    products = query.all()
    return products


@router.get("/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return product