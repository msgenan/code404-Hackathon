# Smart Appointment System - Code404

[![CI Pipeline](https://github.com/msgenan/code404-Hackathon/actions/workflows/ci.yml/badge.svg)](https://github.com/msgenan/code404-Hackathon/actions/workflows/ci.yml)

Akıllı randevu ve kuyruk yönetim sistemi. Docker containerları ile microservice mimarisinde geliştirilmiş, Nginx reverse proxy ile güvenli erişim sağlanan modern bir web uygulaması.

## 🏗️ Sistem Mimarisi

```
Client → Nginx (Port 80) → Backend API (FastAPI) → PostgreSQL
                         ↘ Frontend (Next.js)    → Redis (Cache)
```

**Teknolojiler:**
- **Frontend:** Next.js 15 (React 19) - Modern UI framework
- **Backend:** FastAPI (Python 3.12) - High-performance API
- **Database:** PostgreSQL 16 - İlişkisel veritabanı
- **Cache:** Redis 7 - Önbellekleme ve oturum yönetimi
- **Proxy:** Nginx - Reverse proxy ve load balancing
- **Infrastructure:** Docker Compose + Kubernetes

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Docker Desktop (çalışır durumda)
- Git

### Kurulum

```bash
# 1. Projeyi klonlayın
git clone https://github.com/msgenan/code404-Hackathon.git
cd code404-Hackathon

# 2. Ortam değişkenlerini ayarlayın
cp .env.example .env

# 3. Tüm servisleri başlatın
docker-compose up --build
```

### Uygulamaya Erişim

Tüm servisler Nginx reverse proxy üzerinden erişilebilir:

- **Frontend:** http://localhost
- **Backend API:** http://localhost/api/health
- **API Docs:** http://localhost/docs

> **Güvenlik:** Servisler sadece Nginx üzerinden expose edilmiştir. Direkt port erişimi kapalıdır.

## 👥 Kullanıcı Yönetimi

### Varsayılan Kullanıcılar

Sistem ilk başlatıldığında otomatik olarak oluşturulur:

**Doktor:**
- Email: `doktor@hospital.com`
- Şifre: `doktor123`

**Hasta:**
- Email: `hasta@hospital.com`
- Şifre: `hasta123`

### Yeni Doktor Ekleme

```bash
docker-compose exec backend python add_doctor.py
```

### Yeni Hasta Kaydı

Hastalar web arayüzünden kayıt olabilir:
1. http://localhost adresine gidin
2. "Register" sekmesine tıklayın
3. Formu doldurun ve "Create account" butonuna tıklayın

## 🛠️ Geliştirme

```bash
# Logları görüntüle
docker-compose logs -f

# Tüm servisleri durdur
docker-compose down

# Servisleri yeniden başlat
docker-compose restart

# Tek bir servisi rebuild et
docker-compose up --build backend
```

## 🧪 Test

```bash
# Backend testleri
docker-compose exec backend pytest

# Frontend testleri
docker-compose exec frontend npm test
```

## 📦 Veritabanı Yedekleme

```bash
# Manuel yedekleme
./scripts/backup_db.sh

# Yedekler backups/ klasörüne kaydedilir
```

## ☸️ Kubernetes Deployment

Kubernetes ortamına deploy etmek için:

```bash
# Namespace oluştur
kubectl apply -f infrastructure/k8s/00-namespace.yaml

# Secret'ları yapılandır
kubectl create secret generic app-secrets \
  --from-literal=POSTGRES_USER=your_user \
  --from-literal=POSTGRES_PASSWORD=your_password \
  -n appointment-system

# Tüm kaynakları deploy et
kubectl apply -f infrastructure/k8s/
```

Detaylı bilgi için: [Kubernetes Deployment Guide](./infrastructure/k8s/README.md)

## 🔧 Sorun Giderme

### Port Kullanımda Hatası

```bash
# Port 80'i kullanan işlemi bul
sudo lsof -i :80

# Docker servisleri durdur
docker-compose down
```

### BuildKit DNS Hatası

```bash
# BuildKit'i devre dışı bırak
DOCKER_BUILDKIT=0 docker-compose up --build
```

### .env Dosyası Eksik

```bash
cp .env.example .env
```

## 📝 Notlar

- Production ortamında `.env` dosyasındaki `SECRET_KEY` mutlaka değiştirilmelidir
- PostgreSQL ve Redis şifreleri güçlü şifreler ile değiştirilmelidir
- Nginx üzerinden erişim zorunludur, direkt servis erişimi güvenlik nedeniyle kapatılmıştır

## 📄 Lisans

Bu proje hackathon için geliştirilmiştir.
