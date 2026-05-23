# 🛒 Flipkart Clone — Full-Stack E-Commerce Platform

A responsive full-stack e-commerce web application inspired by Flipkart.  
The project includes product browsing, search/filtering, product details, cart management, wishlist, checkout, order placement, and order history.

---

# 🔗 Live Links

- **GitHub Repository:** [View Repository](https://github.com/saumyakumarchauhan/flipkart-clone)
- **Live Frontend:** [Open Application](https://flipkart-clone-ten-flax.vercel.app/)
- **Backend API:** [Open API](https://flipkart-backend-guta.onrender.com/)
- **Demo Video:** Add your demo video link here

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router DOM
- Context API
- Tailwind CSS / CSS utility classes
- Axios / Fetch API
- Vite

## Backend
- FastAPI
- SQLAlchemy ORM
- Pydantic
- PostgreSQL
- Uvicorn
- Python Dotenv

## Additional Features
- Product API caching
- Email notification support after order placement
- PostgreSQL relational database design

---

# ✨ Features

## Core Features

- Product listing page with Flipkart-style grid layout
- Search products by name
- Filter products by category
- Product detail page with product information, price, discount, rating, and stock status
- Add to cart functionality
- Buy now flow
- Cart page with quantity update and item removal
- Checkout page with shipping address form
- Order placement
- Order confirmation page with order ID

## Bonus Features

- User signup and login
- Wishlist page
- Order history page
- Email notification after successful order placement
- Responsive UI for desktop and smaller screens

---

# 📁 Project Structure

```text
flipkart_clone/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── seed.py
│   ├── requirements.txt
│   └── controllers/
│       ├── auth_controller.py
│       ├── product_controller.py
│       ├── cart_controller.py
│       ├── wishlist_controller.py
│       ├── order_controller.py
│       └── user_controller.py
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProductCard.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx
        │   └── WishlistContext.jsx
        └── pages/
            ├── Home.jsx
            ├── ProductList.jsx
            ├── ProductDetail.jsx
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── OrderConfirmation.jsx
            ├── OrderHistory.jsx
            ├── Wishlist.jsx
            ├── Profile.jsx
            ├── Login.jsx
            └── Signup.jsx
```

---

# 🗄️ Database Design

The application uses PostgreSQL with relational tables for users, products, cart items, wishlist items, orders, and order items.

## Main Entities

- **Users:** Stores registered user details.
- **Products:** Stores product data such as name, brand, category, price, discount, image, and specifications.
- **Cart Items:** Stores products added to a user's cart.
- **Wishlist Items:** Stores products saved by a user.
- **Orders:** Stores order-level information such as user, shipping address, total amount, status, and order number.
- **Order Items:** Stores purchased products for each order.

### Important Design Choice

Order items store the product price at the time of purchase so previous order records remain accurate even if product prices change later.

---

# 🧩 Database ER Diagram

![ER Diagram](screenshots/er-diagram.png)

---

---
# 🎨 Application Wireframe

![Application Wireframe](screenshots/wireframe.png)

---

# 🔌 API Overview

## Authentication APIs

```text
POST /api/auth/signup
POST /api/auth/login
```

## Product APIs

```text
GET /api/products
GET /api/products/{product_id}
GET /api/products?search=keyword
GET /api/products?category=category_name
```

## Cart APIs

```text
GET /api/cart/{user_id}
POST /api/cart/add
PUT /api/cart/update/{cart_item_id}
DELETE /api/cart/remove/{cart_item_id}
```

## Wishlist APIs

```text
GET /api/wishlist/{user_id}
POST /api/wishlist/add
DELETE /api/wishlist/remove/{wishlist_item_id}
```

## Order APIs

```text
POST /api/orders/place
GET /api/orders/{user_id}
GET /api/orders/details/{order_id}
```

---

# ⚙️ Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/flipkart-clone.git
cd flipkart-clone
```

---

## 2. Backend Setup

```bash
cd backend
python -m venv venv
```

### Activate Virtual Environment

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Backend Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/flipkart_db
FRONTEND_URL=http://localhost:5173

MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_FROM=your_email@gmail.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

### Notes

- Use your own PostgreSQL password in `DATABASE_URL`.
- For Gmail email notifications, use a Gmail App Password.
- Do not commit `.env` to GitHub.

---

## 4. Run Backend

```bash
python seed.py
uvicorn main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

FastAPI Swagger Docs:

```text
http://localhost:8000/docs
```

---

## 5. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# ⚡ Caching Strategy

Caching is applied only to:

- Product listing
- Product detail
- Search/category queries

Not cached:

- Cart
- Wishlist
- Orders
- Authentication

---

# 🔒 Security Features

- Password hashing
- Environment variable protection
- User-specific cart and wishlist
- CORS configuration

---

---

# 🚀 Future Improvements

- JWT-based authentication
- Razorpay or Stripe payment integration
- Admin dashboard for managing products and orders
- Seller dashboard for product uploads
- Redis caching for production-level performance
- Pagination and sorting on product listing page
- Unit tests and integration tests

---

# 👨‍💻 Author

**Saumyakumar Chauhan**

- GitHub: [Github Link](https://github.com/saumyakumarchauhan/)
- LinkedIn: [LinkedIn Link](https://www.linkedin.com/in/saumyakumar-chauhan-38467b2b3/)
- Email: [saumyac56@gmail.com](mailto:saumyac56@gmail.com)

---

# 📄 License

This project was created for an SDE Intern Fullstack Assignment and educational purposes.