# Smart Appointment System - Code404

Hackathon project for Case 3: Smart Appointment and Queue Management.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git

### Setup (Automated)

**For macOS/Linux:**
```bash
# Clone the repository
git clone https://github.com/msgenan/Pre-VadiHackathon.git
cd Pre-VadiHackathon

# Run the setup script
./setup.sh
```

**For Windows:**
```cmd
# Clone the repository
git clone https://github.com/msgenan/Pre-VadiHackathon.git
cd Pre-VadiHackathon

# Run the setup script
setup.bat
```

The setup script will:
- Check if Docker is running
- Create `.env` file from template
- Build and start all containers (with BuildKit fallback)
- Verify services are running

### Setup (Manual)

**For macOS/Linux:**
```bash
# 1. Create environment file
cp .env.example .env

# 2. Build and start containers
docker-compose up --build -d

# If you encounter BuildKit DNS issues:
DOCKER_BUILDKIT=0 docker-compose up --build -d
```

**For Windows:**
```cmd
# 1. Create environment file
copy .env.example .env

# 2. Build and start containers
docker-compose up --build -d

# If you encounter BuildKit DNS issues:
set DOCKER_BUILDKIT=0
docker-compose up --build -d
```

### Access the Application

**Production-like (via Nginx):**
- Frontend: http://localhost
- Backend API: http://localhost/api/health
- Backend Docs: http://localhost/docs

**Debug (Direct Access):**
- Frontend: http://localhost:3001
- Backend: http://localhost:8001

## 📦 Architecture

- **Frontend:** Next.js 16 (React 19)
- **Backend:** FastAPI (Python 3.12)
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Proxy:** Nginx (reverse proxy)

## 🛠️ Development

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild specific service
docker-compose up --build backend
```

## 📚 Documentation

- [Kubernetes Deployment](./infrastructure/k8s/README.md)
- [Nginx Configuration](./nginx/README.md)
- [Production Deployment](./PRODUCTION.md)

## 🧪 Testing

```bash
# Backend tests
docker-compose exec backend pytest

# Frontend tests
docker-compose exec frontend npm test
```

## ⚠️ Common Issues

### BuildKit DNS Error
If you see `failed to resolve source metadata`:

**macOS/Linux:**
```bash
DOCKER_BUILDKIT=0 docker-compose up --build
```

**Windows:**
```cmd
set DOCKER_BUILDKIT=0
docker-compose up --build
```

### Port Already in Use
```bash
# Find process using port 80
sudo lsof -i :80

# Or change ports in docker-compose.yml
```

### .env File Missing
```bash
cp .env.example .env
```
