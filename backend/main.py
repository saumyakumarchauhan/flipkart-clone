import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager # <-- NEW: For cache lifecycle

# --- NEW: Import Cache libraries ---
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

import models
from database import engine

# Import your controllers
from controllers import auth_controller
from controllers import product_controller
from controllers import cart_controller
from controllers import order_controller
from controllers import wishlist_controller
from controllers import user_controller

models.Base.metadata.create_all(bind=engine)

# --- NEW: Startup Event to initialize the Cache memory ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")
    yield

# --- UPDATED: Pass the lifespan to the FastAPI app ---
app = FastAPI(title="Flipkart Clone API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(auth_controller.router)
app.include_router(product_controller.router) 
app.include_router(cart_controller.router)
app.include_router(order_controller.router)
app.include_router(wishlist_controller.router)
app.include_router(user_controller.router)

@app.get("/")
def read_root():
    return {"message": "Flipkart Clone API is running! Database and tables verified."}

if __name__ == "__main__":
    print("Starting FastAPI server...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)