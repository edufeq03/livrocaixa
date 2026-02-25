from database import SessionLocal, engine, Base
import models
import auth

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    # Create Default Tenant if not exists
    default_tenant = db.query(models.Tenant).filter(models.Tenant.office_name == "Principal Office").first()
    if not default_tenant:
        print("Creating default tenant...")
        default_tenant = models.Tenant(
            office_name="Principal Office",
            cnpj="00.000.000/0001-00",
            status=models.TenantStatus.ACTIVE
        )
        db.add(default_tenant)
        db.commit()
        db.refresh(default_tenant)
        print("Default tenant created!")

    # Create Super Admin if not exists
    super_admin_email = "admin@livrocaixa.com.br"
    db_user = db.query(models.User).filter(models.User.email == super_admin_email).first()
    
    if not db_user:
        print(f"Creating super admin: {super_admin_email}")
        new_user = models.User(
            email=super_admin_email,
            name="System Admin",
            password_hash=auth.get_password_hash("admin123"),
            role=models.UserRole.SUPER_ADMIN,
            is_active=True,
            tenant_id=default_tenant.id
        )
        db.add(new_user)
        db.commit()
        print("Super admin created!")
    # Create Default Categories if none exist
    category_count = db.query(models.Category).filter(models.Category.tenant_id == default_tenant.id).count()
    if category_count == 0:
        print("Creating default categories...")
        categories = [
            models.Category(tenant_id=default_tenant.id, name="Vendas", type=models.TransactionType.INCOME),
            models.Category(tenant_id=default_tenant.id, name="Serviços", type=models.TransactionType.INCOME),
            models.Category(tenant_id=default_tenant.id, name="Aluguel", type=models.TransactionType.EXPENSE),
            models.Category(tenant_id=default_tenant.id, name="Salários", type=models.TransactionType.EXPENSE),
            models.Category(tenant_id=default_tenant.id, name="Impostos", type=models.TransactionType.EXPENSE),
        ]
        db.add_all(categories)
        db.commit()
        print("Default categories created!")

    # Create Default Accounts if none exist
    account_count = db.query(models.Account).filter(models.Account.tenant_id == default_tenant.id).count()
    if account_count == 0:
        print("Creating default accounts...")
        accounts = [
            models.Account(tenant_id=default_tenant.id, name="Caixa Geral"),
            models.Account(tenant_id=default_tenant.id, name="Banco do Brasil"),
            models.Account(tenant_id=default_tenant.id, name="Itaú"),
        ]
        db.add_all(accounts)
        db.commit()
        print("Default accounts created!")

    db.close()

if __name__ == "__main__":
    seed()
