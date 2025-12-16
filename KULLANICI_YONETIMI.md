# Doktor ve Hasta Yönetimi

## Sistem Yapısı

Sistemde iki tür kullanıcı bulunmaktadır:

### 1. 👨‍⚕️ Doktorlar
- Manuel olarak veritabanına eklenir
- Backend script ile kayıt edilir
- Email ve şifre ile giriş yapar

### 2. 🤒 Hastalar
- Web arayüzünden kayıt olabilir
- Otomatik olarak veritabanına kaydedilir
- Email ve şifre ile giriş yapar

---

## Doktor Ekleme İşlemi

### Yöntem 1: Script ile Doktor Ekleme (Önerilen)

Backend klasöründe şu komutu çalıştırın:

```bash
cd backend
python add_doctor.py
```

Script size şunları soracak:
- Doktor Adı Soyadı
- Email
- Şifre
- Şifre Tekrar

### Kayıtlı Doktorları Listeleme

```bash
cd backend
python add_doctor.py list
```

### Yöntem 2: Python REPL ile Manuel Ekleme

```bash
cd backend
python
```

Ardından şu kodları çalıştırın:

```python
from sqlmodel import Session
from app.database import engine
from app.models.base import User, UserRole
from app.auth import hash_password

with Session(engine) as session:
    doctor = User(
        email="doktor@hastane.com",
        password_hash=hash_password("doktor123"),
        role="doctor",
        full_name="Dr. Ahmet Yılmaz"
    )
    session.add(doctor)
    session.commit()
    print(f"✅ Doktor eklendi: {doctor.email}")
```

---

## Hasta Kayıt İşlemi

Hastalar sisteme web arayüzünden kayıt olur:

1. Web sayfasındaki **"Register"** sekmesine tıklayın
2. Formu doldurun:
   - Ad Soyad
   - Email
   - Şifre
   - Şifre Tekrar
3. **"Create account"** butonuna tıklayın
4. Otomatik olarak sisteme giriş yapılır

---

## Giriş İşlemi (Doktor ve Hasta İçin Aynı)

1. Web sayfasındaki **"Login"** sekmesine tıklayın
2. Email ve şifrenizi girin
3. **"Sign in"** butonuna tıklayın
4. Dashboard sayfasına yönlendirilirsiniz

---

## API Endpoints

### Kayıt (Sadece Hastalar için)
```http
POST /auth/register
Content-Type: application/json

{
  "email": "hasta@example.com",
  "password": "sifre123",
  "full_name": "Mehmet Demir"
}
```

### Giriş (Doktor ve Hastalar için)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "kullanici@example.com",
  "password": "sifre123"
}
```

**Yanıt:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## Varsayılan Test Kullanıcıları

Uygulama ilk başlatıldığında otomatik olarak şu kullanıcılar oluşturulur:

### Doktor
- Email: `doktor@hospital.com`
- Şifre: `doktor123`
- Rol: Doktor

### Hasta
- Email: `hasta@hospital.com`
- Şifre: `hasta123`
- Rol: Hasta

---

## Güvenlik Notları

⚠️ **Önemli:**
- Doktorlar sadece veritabanı üzerinden eklenebilir
- Web arayüzünden kayıt olan tüm kullanıcılar otomatik olarak "hasta" rolü alır
- Şifreler bcrypt ile hashlenmiş olarak saklanır
- JWT token ile kimlik doğrulama yapılır
- Production ortamında `SECRET_KEY` değiştirilmelidir

---

## Sorun Giderme

### "Email zaten kayıtlı" hatası
Bu email ile bir kullanıcı zaten var. Farklı bir email kullanın.

### Doktor eklenemiyor
Backend uygulamasının çalıştığından emin olun:
```bash
cd backend
uvicorn app.main:app --reload
```

### Veritabanı bulunamıyor
Veritabanı otomatik olarak oluşturulur. Eğer sorun yaşıyorsanız:
```bash
cd backend
rm -f database.db  # Varsa eski veritabanını sil
python -m app.main  # Yeniden oluştur
```
