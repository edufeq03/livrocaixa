from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, get_db
import models
from routes import auth as auth_routes
from routes import companies as companies_routes
from routes import transactions as transactions_routes

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Livro Caixa SaaS API", version="0.1.0")

app.include_router(auth_routes.router)
app.include_router(companies_routes.router)
app.include_router(transactions_routes.router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Livro Caixa SaaS API is running", "version": "0.1.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
