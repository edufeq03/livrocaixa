from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
import models
import auth
from database import get_db

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/summary")
async def get_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Total Income
    total_income = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.tenant_id == current_user.tenant_id,
        models.Transaction.type == models.TransactionType.INCOME
    ).scalar() or 0.0

    # Total Expenses
    total_expense = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.tenant_id == current_user.tenant_id,
        models.Transaction.type == models.TransactionType.EXPENSE
    ).scalar() or 0.0

    # Balance
    balance = total_income - total_expense

    # Total Companies
    total_companies = db.query(models.Company).filter(
        models.Company.tenant_id == current_user.tenant_id
    ).count()

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "total_companies": total_companies
    }
