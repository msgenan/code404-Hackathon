"""
Doktor Ekleme Script'i
======================
Bu script doktorları manuel olarak veritabanına eklemek için kullanılır.
"""

import sys
from getpass import getpass
from sqlmodel import Session, select
from app.database import engine
from app.models import User, UserRole
from app.auth import hash_password


def add_doctor():
    """Veritabanına yeni doktor ekle"""
    print("=" * 50)
    print("DOKTOR EKLEME SİSTEMİ")
    print("=" * 50)
    print()
    
    # Doktor bilgilerini al
    full_name = input("Doktor Adı Soyadı: ").strip()
    if not full_name:
        print("❌ Hata: Ad soyad boş olamaz!")
        sys.exit(1)

    email = input("Email: ").strip()
    if not email:
        print("❌ Hata: Email boş olamaz!")
        sys.exit(1)

    password = getpass("Şifre: ")
    if len(password) < 6:
        print("❌ Hata: Şifre en az 6 karakter olmalıdır!")
        sys.exit(1)

    password_confirm = getpass("Şifre (Tekrar): ")
    if password != password_confirm:
        print("❌ Hata: Şifreler eşleşmiyor!")
        sys.exit(1)

    print()
    print("=" * 50)
    print("Doktor bilgileri:")
    print(f"  Ad Soyad: {full_name}")
    print(f"  Email: {email}")
    print(f"  Rol: Doktor")
    print("=" * 50)
    print()
    
    confirm = input("Bu bilgilerle doktor eklensin mi? (E/H): ").strip().upper()
    if confirm != "E":
        print("❌ İptal edildi.")
        sys.exit(0)

    try:
        with Session(engine) as session:
            # Email kontrolü
            existing_user = session.exec(
                select(User).where(User.email == email)
            ).first()

            if existing_user:
                print(f"❌ Hata: {email} adresi zaten kayıtlı!")
                sys.exit(1)
            
            # Yeni doktor oluştur
            new_doctor = User(
                email=email,
                password_hash=hash_password(password),
                role=UserRole.doctor,
                full_name=full_name
            )
            
            session.add(new_doctor)
            session.commit()
            session.refresh(new_doctor)
            
            print()
            print("✅ Başarılı!")
            print(f"   Doktor ID: {new_doctor.id}")
            print(f"   Email: {new_doctor.email}")
            print(f"   Ad Soyad: {new_doctor.full_name}")
            print()
            print("Bu bilgilerle sisteme giriş yapabilirsiniz.")

    except Exception as e:
        print(f"❌ Hata oluştu: {str(e)}")
        sys.exit(1)


def list_doctors():
    """Mevcut doktorları listele"""
    print("=" * 50)
    print("KAYITLI DOKTORLAR")
    print("=" * 50)
    print()
    
    try:
        with Session(engine) as session:
            doctors = session.exec(
                select(User).where(User.role == UserRole.doctor)
            ).all()
            
            if not doctors:
                print("Henüz kayıtlı doktor yok.")
            else:
                for idx, doctor in enumerate(doctors, 1):
                    print(f"{idx}. {doctor.full_name}")
                    print(f"   Email: {doctor.email}")
                    print(f"   ID: {doctor.id}")
                    print()

    except Exception as e:
        print(f"❌ Hata oluştu: {str(e)}")
        sys.exit(1)


def main():
    """Ana fonksiyon"""
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        list_doctors()
    else:
        add_doctor()


if __name__ == "__main__":
    main()
