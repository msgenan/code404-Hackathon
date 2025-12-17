# 🏥 Hospital Appointment System

Modern hastane randevu yönetim sistemi. Mikroservis mimarisinde geliştirilmiş, production-ready bir uygulama.

## ⚡ Hızlı Başlangıç

```bash
git clone https://github.com/msgenan/code404-Hackathon.git
cd code404-Hackathon
docker-compose up --build
```

**Uygulamaya eriş:** http://localhost

## 🎯 Özellikler

- **Kullanıcı Yönetimi:** Hasta, doktor ve admin rolleri
- **Randevu Sistemi:** Randevu oluşturma, görüntüleme, iptal etme
- **Öncelikli Kuyruk:** Yaş ve sağlık durumuna göre otomatik sıralama
- **Gerçek Zamanlı:** Anlık randevu güncellemeleri
- **Güvenlik:** JWT authentication, role-based access control

## 🛠️ Teknoloji Stack

**Backend:**
- FastAPI (Python 3.12)
- PostgreSQL 16
- SQLModel ORM
- JWT Authentication
- Prometheus metrikleri

**Frontend:**
- Next.js 15 + React 19
- TypeScript
- Tailwind CSS
- Server-side rendering

**Infrastructure:**
- Docker Compose
- Kubernetes (production)
- Nginx reverse proxy
- Redis cache

## 📚 API Endpoints

- `GET /health` - Sistem sağlık kontrolü
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Giriş yapma
- `GET /doctors` - Doktor listesi
- `POST /appointments` - Randevu oluşturma
- `GET /patients/priority` - Öncelikli hasta kuyruğu

**API Dokümantasyonu:** http://localhost/docs

## 👥 Test Kullanıcıları

Uygulamada hazır test hesapları bulunur:

| Role | Email | Şifre |
|------|-------|-------|
| Doktor | sarah.chen@hospital.com | Doctor123! |
| Doktor | michael.roberts@hospital.com | Doctor123! |
| Hasta | john.smith@email.com | Patient123! |

## 🔧 Faydalı Komutlar

```bash
# Logları izle
docker-compose logs -f

# Servisi yeniden başlat
docker-compose restart backend

# Veritabanını yedekle
./scripts/backup_db.sh

# Veritabanını sıfırla
./scripts/reset_database.sh

# Test et
docker-compose exec backend pytest
```

## 📁 Proje Yapısı

```
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   ├── models.py # Database models
│   │   └── auth.py   # Authentication
│   └── tests/        # Backend tests
├── frontend/         # Next.js frontend
│   ├── app/          # Pages
│   └── components/   # React components
├── infrastructure/
│   └── k8s/          # Kubernetes configs
└── nginx/            # Reverse proxy config
```

## 🚀 Production Deploy

Kubernetes ile production deploy:

```bash
kubectl apply -f infrastructure/k8s/
```

Detaylı bilgi: `infrastructure/k8s/README.md`

## 💡 Önemli Notlar

- Tüm servisler Nginx üzerinden çalışır (güvenlik)
- Test hesapları otomatik oluşturulur
- JWT token ile authentication
- Role-based access control (admin, doctor, patient)
- Production'da `.env` dosyasındaki secret'lar güncellenmeli

---

**Geliştirici:** [@msgenan](https://github.com/msgenan) | **Proje:** Code404 Hackathon