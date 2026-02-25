from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/companies", tags=["companies"])

@router.post("/", response_model=schemas.Company)
async def create_company(
    company: schemas.CompanyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Check if user is Admin or super admin
    if current_user.role not in [models.UserRole.CONTADOR_ADMIN, models.UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to create companies")
    
    # In a multi-tenant SaaS, usually companies belong to a tenant
    # For MVP, we'll associate it with the current user's tenant
    company_data = company.dict()
    company_data.pop("tenant_id", None)
    
    db_company = models.Company(
        **company_data,
        tenant_id=current_user.tenant_id
    )
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@router.get("/", response_model=List[schemas.Company])
async def list_companies(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Filter by user's tenant
    query = db.query(models.Company)
    if current_user.role != models.UserRole.SUPER_ADMIN:
        query = query.filter(models.Company.tenant_id == current_user.tenant_id)
    
    return query.all()
