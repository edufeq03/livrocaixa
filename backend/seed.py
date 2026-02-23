from database import SessionLocal, engine, Base
import models
import auth

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    # Create Super Admin if not exists
    super_admin_email = "admin@livrocaixa.local"
    db_user = db.query(models.User).filter(models.User.email == super_admin_email).first()
    
    if not db_user:
        print(f"Creating super admin: {super_admin_email}")
        new_user = models.User(
            email=super_admin_email,
            name="System Admin",
            password_hash=auth.get_password_hash("admin123"),
            role=models.UserRole.SUPER_ADMIN,
            is_active=True
        )
        db.add(new_user)
        db.commit()
        print("Super admin created!")
    else:
        print("Super admin already exists.")
    db.close()

if __name__ == "__main__":
    seed()
