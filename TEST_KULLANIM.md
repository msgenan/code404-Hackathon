# Test Script - Hasta Kaydı ve Giriş

Bu script ile sistemi test edebilirsiniz.

## 1. Yeni Hasta Kaydı

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@hasta.com",
    "password": "test123",
    "full_name": "Test Hasta"
  }'
```

**Beklenen Sonuç:**
```json
{
  "id": 3,
  "email": "test@hasta.com",
  "role": "patient",
  "full_name": "Test Hasta"
}
```

## 2. Giriş Yap

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@hasta.com",
    "password": "test123"
  }'
```

**Beklenen Sonuç:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## 3. Doktor ile Giriş Yap

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doktor@hospital.com",
    "password": "doktor123"
  }'
```

## Web Arayüzü Testi

### Hasta Kaydı:
1. http://localhost:3000/auth adresine git
2. **Register** sekmesine tıkla
3. Bilgileri doldur:
   - Full name: `Ahmet Yılmaz`
   - Email: `ahmet@test.com`
   - Password: `test123`
   - Confirm password: `test123`
4. **Create account** butonuna tıkla
5. Otomatik olarak dashboard'a yönlendirileceksin

### Hasta Girişi:
1. http://localhost:3000/auth adresine git
2. **Login** sekmesinde:
   - Email: `ahmet@test.com`
   - Password: `test123`
3. **Login** butonuna tıkla
4. Dashboard'a yönlendirileceksin

### Doktor Girişi:
1. http://localhost:3000/auth adresine git
2. **Login** sekmesinde:
   - Email: `doktor@hospital.com`
   - Password: `doktor123`
3. **Login** butonuna tıkla
4. Dashboard'a yönlendirileceksin

## Veritabanı Kontrolü

Kayıtlı kullanıcıları görmek için:

```bash
docker exec -it appointment_backend python -c "
from sqlmodel import Session, select
from app.database import engine
from app.models.base import User

with Session(engine) as session:
    users = session.exec(select(User)).all()
    for user in users:
        print(f'{user.id}. {user.full_name} ({user.email}) - Role: {user.role}')
"
```
