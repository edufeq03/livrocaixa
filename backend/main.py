from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, get_db
import models
from routes import auth as auth_routes
from routes import companies as companies_routes
from routes import transactions as transactions_routes
from routes import users as users_routes
from routes import categories as categories_routes
from routes import accounts as accounts_routes
from routes import stats as stats_routes
import time

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Livro Caixa SaaS API", version="0.1.0")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    auth_header = request.headers.get("Authorization")
    print(f"DEBUG: Request: {request.method} {request.url.path}")
    print(f"DEBUG: Auth Header: {auth_header[:20] if auth_header else 'None'}...")
    
    response = await call_next(request)
    
    process_time = (time.time() - start_time) * 1000
    print(f"DEBUG: Response status: {response.status_code} in {process_time:.2f}ms")
    return response

app.include_router(auth_routes.router)
app.include_router(companies_routes.router)
app.include_router(transactions_routes.router)
app.include_router(users_routes.router)
app.include_router(categories_routes.router)
app.include_router(accounts_routes.router)
app.include_router(stats_routes.router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production flexibility
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
