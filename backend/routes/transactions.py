from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/", response_model=schemas.Transaction)
async def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # For MVP, check if the company belongs to the user's tenant or they are allowed
    company = db.query(models.Company).filter(models.Company.id == str(transaction.company_id)).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    if current_user.role != models.UserRole.SUPER_ADMIN and company.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not authorized to add transactions to this company")

    db_transaction = models.Transaction(
        **transaction.dict(),
        tenant_id=current_user.tenant_id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[schemas.Transaction])
async def list_transactions(
    company_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Transaction)
    
    # Isolation filter
    if current_user.role != models.UserRole.SUPER_ADMIN:
        query = query.filter(models.Transaction.tenant_id == current_user.tenant_id)
    
    # Optional company filter
    if company_id:
        query = query.filter(models.Transaction.company_id == str(company_id))
        
    return query.order_by(models.Transaction.date.desc()).all()
