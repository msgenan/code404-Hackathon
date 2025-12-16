# Hastane Randevu Sistemi - Backend API Dokümantasyonu

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Docker ve Docker Compose
- PostgreSQL (Docker ile otomatik başlatılır)

### Kurulum

1. `.env` dosyasını kontrol edin (zaten oluşturuldu)

2. Docker ile servisleri başlatın:
```bash
docker-compose up --build
```

3. Backend API: http://localhost:8000
4. Frontend: http://localhost:3000
5. API Dokümantasyonu: http://localhost:8000/docs

## 📝 Varsayılan Test Kullanıcıları

Sistem ilk başlatıldığında otomatik olarak aşağıdaki kullanıcılar oluşturulur:

### Doktor
- **Email:** doktor@hospital.com
- **Şifre:** doktor123
- **Rol:** doctor

### Hasta
- **Email:** hasta@hospital.com
- **Şifre:** hasta123
- **Rol:** patient

## 🔌 API Endpoints

### Auth Endpoints

#### Kayıt Ol (Sadece Hasta)
```http
POST /auth/register
Content-Type: application/json

{
  "email": "yeni@hasta.com",
  "password": "123456",
  "full_name": "Yeni Hasta"
}
```

#### Giriş Yap
```http
POST /auth/login
Content-Type: application/json

{
  "email": "hasta@hospital.com",
  "password": "hasta123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Appointment Endpoints

#### Doktorları Listele
```http
GET /doctors
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "doktor@hospital.com",
    "role": "doctor",
    "full_name": "Dr. Ahmet Yılmaz"
  }
]
```

#### Randevu Oluştur
```http
POST /appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "doctor_id": 1,
  "start_time": "2025-12-20T14:00:00"
}
```

**Önemli Notlar:**
- Sadece `patient` rolündeki kullanıcılar randevu alabilir
- Aynı doktora, aynı saat aralığında çifte rezervasyon YAPAMAZ
- Randevu süresi 1 saat olarak varsayılır

**Response:**
```json
{
  "id": 1,
  "doctor_id": 1,
  "patient_id": 2,
  "start_time": "2025-12-20T14:00:00",
  "status": "active"
}
```

**Hata Durumları:**
- `409 Conflict`: Bu doktorun seçilen saatte başka randevusu var
- `403 Forbidden`: Sadece hastalar randevu alabilir
- `404 Not Found`: Doktor bulunamadı

#### Randevularımı Listele
```http
GET /appointments/my
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "doctor_id": 1,
    "patient_id": 2,
    "start_time": "2025-12-20T14:00:00",
    "status": "active",
    "doctor": {
      "id": 1,
      "email": "doktor@hospital.com",
      "role": "doctor",
      "full_name": "Dr. Ahmet Yılmaz"
    }
  }
]
```

## 🛠️ Teknolojiler

### Backend
- **FastAPI** - Modern, hızlı Python web framework
- **SQLModel** - SQL veritabanları için ORM (SQLAlchemy + Pydantic)
- **PostgreSQL** - İlişkisel veritabanı
- **JWT** - Token bazlı authentication
- **Bcrypt** - Şifre hashleme
- **Pydantic** - Data validation

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

## 🔐 Güvenlik

- Şifreler bcrypt ile hashlenmiş olarak saklanır
- JWT token ile authentication
- Token süresi: 24 saat
- Minimum şifre uzunluğu: 6 karakter

## 📂 Proje Yapısı

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # Ana uygulama, endpoints
│   ├── database.py      # Database bağlantısı
│   ├── models.py        # SQLModel modelleri ve şemaları
│   └── auth.py          # JWT ve authentication
└── requirements.txt

frontend/
├── app/
│   ├── auth/
│   │   └── page.tsx     # Login/Register sayfası
│   └── dashboard/
│       └── page.tsx     # Randevu yönetim sayfası
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
└── lib/
    └── api.ts           # Backend API entegrasyonu
```

## 🧪 Test Senaryoları

### Senaryo 1: Yeni Hasta Kaydı ve Randevu Alma
1. Frontend'de kayıt ol: http://localhost:3000/auth
2. Otomatik giriş yapılır ve dashboard'a yönlendirilir
3. Doktor seçin, tarih ve saat belirleyin
4. "Randevu Oluştur" butonuna tıklayın

### Senaryo 2: Çifte Rezervasyon Kontrolü
1. Bir hastanın randevusu var: 2025-12-20 14:00
2. Başka bir hasta aynı doktora aynı saatte randevu almaya çalışır
3. Sistem `409 Conflict` hatası döner: "Bu doktorun seçilen saatte başka randevusu var"

### Senaryo 3: Mevcut Hesapla Giriş
1. Email: `hasta@hospital.com`
2. Şifre: `hasta123`
3. Dashboard'da randevularınızı görüntüleyin

## 🐛 Hata Ayıklama

### Backend loglarını görüntüle:
```bash
docker-compose logs -f backend
```

### PostgreSQL'e bağlan:
```bash
docker-compose exec db psql -U postgres -d hospital_db
```

### Tabloları görüntüle:
```sql
\dt
SELECT * FROM users;
SELECT * FROM appointments;
```

## 📌 Notlar

- Kayıt olurken `role` alanı otomatik olarak `patient` yapılır (güvenlik)
- Doktor kullanıcısı sadece manuel olarak veya seed data ile eklenir
- Randevular 1 saatlik dilimler halinde varsayılır
- Geçmiş tarihe randevu alınamaz (validation)

## 🚀 Production Notları

Production'a çıkmadan önce:
1. `.env` dosyasında `SECRET_KEY` değiştirin
2. CORS ayarlarını düzenleyin
3. PostgreSQL şifresini güçlendirin
4. HTTPS kullanın
5. Rate limiting ekleyin
