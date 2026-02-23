import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Enum, DateTime, Float, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    CONTADOR_ADMIN = "CONTADOR_ADMIN"
    CONTADOR_USER = "CONTADOR_USER"
    CLIENTE = "CLIENTE"

class TenantStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    TRIAL = "TRIAL"

class TransactionType(str, enum.Enum):
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    office_name = Column(String(150), nullable=False)
    cnpj = Column(String(18), nullable=True)
    logo_url = Column(Text, nullable=True)
    primary_color = Column(String(7), default="#000000")
    subdomain = Column(String(100), unique=True, nullable=True)
    status = Column(Enum(TenantStatus), default=TenantStatus.TRIAL)
    plan = Column(String(50), default="Free")
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    users = relationship("User", back_populates="tenant")
    companies = relationship("Company", back_populates="tenant")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=True)
    company_id = Column(String, ForeignKey("companies.id"), nullable=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=False)
    invite_token = Column(String, nullable=True)
    invite_expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    tenant = relationship("Tenant", back_populates="users")
    company = relationship("Company", back_populates="users")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    company_name = Column(String(150), nullable=False)
    cnpj = Column(String(18), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    tenant = relationship("Tenant", back_populates="companies")
    users = relationship("User", back_populates="company")
    transactions = relationship("Transaction", back_populates="company")

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)

class Account(Base):
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    name = Column(String(100), nullable=False)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    account_id = Column(String, ForeignKey("accounts.id"), nullable=False)
    description = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    date_lancamento = Column(DateTime(timezone=True), nullable=False)
    receipt_url = Column(Text, nullable=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    company = relationship("Company", back_populates="transactions")

# Indexes
Index('ix_transactions_tenant_company_date', Transaction.tenant_id, Transaction.company_id, Transaction.date_lancamento)
Index('ix_transactions_created_by', Transaction.created_by)
