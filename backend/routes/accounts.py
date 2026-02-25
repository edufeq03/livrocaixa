from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.get("/", response_model=List[schemas.Account])
async def list_accounts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Account)
    if current_user.role != models.UserRole.SUPER_ADMIN:
        query = query.filter(models.Account.tenant_id == current_user.tenant_id)
    return query.all()

@router.post("/", response_model=schemas.Account)
async def create_account(
    account: schemas.AccountCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_account = models.Account(
        **account.dict(),
        tenant_id=current_user.tenant_id
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.put("/{account_id}", response_model=schemas.Account)
async def update_account(
    account_id: str,
    account: schemas.AccountCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    if current_user.role != models.UserRole.SUPER_ADMIN and db_account.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    for key, value in account.dict().items():
        setattr(db_account, key, value)
    
    db.commit()
    db.refresh(db_account)
    return db_account

@router.delete("/{account_id}")
async def delete_account(
    account_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    if current_user.role != models.UserRole.SUPER_ADMIN and db_account.tenant_id != current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(db_account)
    db.commit()
    return {"message": "Account deleted"}
