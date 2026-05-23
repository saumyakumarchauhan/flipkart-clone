from database import SessionLocal, engine
import models

# Drop and recreate tables to ensure the new image_url column is added
print("Resetting database tables...")
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# 1. Create Categories
category_names = [
    "Electronics", "TVs & Appliances", "Men", "Women", 
    "Baby & Kids", "Home & Furniture", "Sports"
]
categories = {}
for name in category_names:
    cat = models.Category(name=name)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    categories[name] = cat.id

# 2. Create Products (Mapped 1 to 12 for the grid)
seed_products = [
    # Row 1 (0,0 to 0,3)
    {"name": "Running Shoes For Men", "brand": "Puma", "cat": "Men", "price": 1499, "orig": 2999, "img": "/images/1.jpg"},
    {"name": "iPhone 15 (Blue, 128 GB)", "brand": "Apple", "cat": "Electronics", "price": 72999, "orig": 79900, "img": "/images/2.jpg"},
    {"name": "Men Slim Fit Dark Blue Jeans", "brand": "Levis", "cat": "Men", "price": 1299, "orig": 2599, "img": "/images/3.jpg"},
    {"name": "WH-1000XM5 Bluetooth Headphones", "brand": "Sony", "cat": "Electronics", "price": 29990, "orig": 34990, "img": "/images/4.jpg"},
    
    # Row 2 (1,0 to 1,3)
    {"name": "Galaxy S24 Ultra 5G", "brand": "Samsung", "cat": "Electronics", "price": 129999, "orig": 134999, "img": "/images/5.jpg"},
    {"name": "43 inch 4K Ultra HD Smart TV", "brand": "LG", "cat": "TVs & Appliances", "price": 29990, "orig": 49990, "img": "/images/6.jpg"},
    {"name": "Front Load Washing Machine", "brand": "Bosch", "cat": "TVs & Appliances", "price": 35990, "orig": 45990, "img": "/images/7.jpg"},
    {"name": "Air Max Pulse", "brand": "Nike", "cat": "Men", "price": 8499, "orig": 14999, "img": "/images/8.jpg"},
    
    # Row 3 (2,0 to 2,3)
    {"name": "Women Printed Cotton Kurta", "brand": "Biba", "cat": "Women", "price": 899, "orig": 1999, "img": "/images/9.jpg"},
    {"name": "Newborn Baby Romper Set", "brand": "Mothercare", "cat": "Baby & Kids", "price": 599, "orig": 1299, "img": "/images/10.jpg"},
    {"name": "Engineered Wood Study Table", "brand": "Wakefit", "cat": "Home & Furniture", "price": 3499, "orig": 6999, "img": "/images/11.jpg"},
    {"name": "45 L Travel Backpack", "brand": "Wildcraft", "cat": "Sports", "price": 999, "orig": 1999, "img": "/images/12.jpg"},
]

for p in seed_products:
    discount_percent = int(((p['orig'] - p['price']) / p['orig']) * 100)
    product = models.Product(
        category_id=categories[p['cat']],
        brand=p['brand'],
        name=p['name'],
        description="Premium quality product with authentic brand guarantee.",
        price=p['price'],
        original_price=p['orig'],
        discount=discount_percent,
        rating=4.5,
        reviews_count=120,
        image_url=p['img'],
        sizes=["Standard"],
        offers=["Bank Offer: 5% Cashback", "Special Price: Extra 10% off"]
    )
    db.add(product)

db.commit()
print("Database successfully seeded with categories and products!")
db.close()