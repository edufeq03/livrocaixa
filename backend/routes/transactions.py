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
        tenant_id=current_user.tenant_id,
        created_by=current_user.id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[schemas.Transaction])
async def list_transactions(
    company_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Transaction)
    
    # Isolation filter
    if current_user.role != models.UserRole.SUPER_ADMIN:
        query = query.filter(models.Transaction.tenant_id == current_user.tenant_id)
    
    # Optional company filter
    if company_id:
        query = query.filter(models.Transaction.company_id == company_id)
        
    transactions = query.order_by(models.Transaction.date_lancamento.desc()).all()
    
    # Manually populate names for the response model (unless we use nested objects)
    # Since we added these to schemas.Transaction, we can set them here
    for t in transactions:
        t.category_name = t.category.name if t.category else "N/A"
        t.account_name = t.account.name if t.account else "N/A"
        t.company_name = t.company.company_name if t.company else "N/A"
        
    return transactions
