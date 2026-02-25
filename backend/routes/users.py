from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[schemas.User])
async def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Only admins can list users for the tenant
    if current_user.role not in [models.UserRole.CONTADOR_ADMIN, models.UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to list users")
    
    query = db.query(models.User)
    if current_user.role != models.UserRole.SUPER_ADMIN:
        query = query.filter(models.User.tenant_id == current_user.tenant_id)
        
    return query.all()

@router.post("/", response_model=schemas.User)
async def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role not in [models.UserRole.CONTADOR_ADMIN, models.UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to create users")
    
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    try:
        user_data = user.dict()
        password = user_data.pop("password")
        # Remove tenant_id from user_data if it exists to avoid multiple values error
        user_data.pop("tenant_id", None)
        
        db_user = models.User(
            **user_data,
            password_hash=auth.get_password_hash(password),
            tenant_id=current_user.tenant_id if current_user.role != models.UserRole.SUPER_ADMIN else user.tenant_id,
            is_active=True # For now, auto-activate
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        print(f"DEBUG: User created successfully: {db_user.email}")
        return db_user
    except Exception as e:
        print(f"DEBUG: Error creating user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role not in [models.UserRole.CONTADOR_ADMIN, models.UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to delete users")
    
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if current_user.role != models.UserRole.SUPER_ADMIN and db_user.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
