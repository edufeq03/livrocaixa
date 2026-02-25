from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from models import UserRole, TenantStatus, TransactionType

# --- Tenant Schemas ---
class TenantBase(BaseModel):
    office_name: str
    cnpj: Optional[str] = None
    subdomain: Optional[str] = None
    primary_color: Optional[str] = "#000000"

class TenantCreate(TenantBase):
    pass

class Tenant(TenantBase):
    id: str
    status: TenantStatus
    plan: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
    tenant_id: Optional[str] = None
    company_id: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Company Schemas ---
class CompanyBase(BaseModel):
    company_name: str
    cnpj: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

class CompanyCreate(CompanyBase):
    tenant_id: Optional[str] = None

class Company(CompanyBase):
    id: str
    tenant_id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    type: TransactionType

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: str
    tenant_id: str
    
    model_config = ConfigDict(from_attributes=True)

# --- Account Schemas ---
class AccountBase(BaseModel):
    name: str

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: str
    tenant_id: str
    
    model_config = ConfigDict(from_attributes=True)

# --- Transaction Schemas ---
class TransactionBase(BaseModel):
    description: str
    amount: float
    type: TransactionType
    category_id: str
    account_id: str
    date_lancamento: datetime
    company_id: str

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: str
    tenant_id: str
    receipt_url: Optional[str] = None
    created_by: str
    created_at: datetime
    category_name: Optional[str] = None
    account_name: Optional[str] = None
    company_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    tenant_id: Optional[str] = None
    role: Optional[UserRole] = None
