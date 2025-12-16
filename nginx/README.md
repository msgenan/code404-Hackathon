# Nginx Reverse Proxy Configuration

This directory contains the Nginx configuration for the local Docker Compose setup, simulating production Ingress behavior.

## Architecture

```
Client (Browser)
    ↓
Nginx (Port 80)
    ├── /api/* → Backend (Port 8000)
    ├── /docs → Backend Swagger UI
    └── /* → Frontend (Port 3000)
```

## Configuration Details

### Upstream Servers

- **Backend:** `appointment_backend:8000`
- **Frontend:** `appointment_frontend:3000`

### Routing Rules

| Path | Destination | Notes |
|------|-------------|-------|
| `/api/*` | Backend | `/api` prefix stripped |
| `/docs` | Backend | FastAPI Swagger UI |
| `/openapi.json` | Backend | OpenAPI spec |
| `/*` | Frontend | Next.js app |
| `/nginx-health` | Nginx | Health check endpoint |

### Features

✅ **Path Rewriting:** `/api/health` → Backend `/health`  
✅ **WebSocket Support:** Next.js HMR works through Nginx  
✅ **Proxy Headers:** Real IP, Forwarded headers  
✅ **Health Checks:** `/nginx-health` endpoint  
✅ **Large Uploads:** 10MB client max body size  

## Usage

### Start Services

```bash
docker-compose up -d
```

### Access Points

**Through Nginx (Production-like):**
- Frontend: http://localhost
- Backend API: http://localhost/api/health
- Backend Docs: http://localhost/docs

**Direct Access (Debugging):**
- Frontend: http://localhost:3001
- Backend: http://localhost:8001

### Test Nginx

```bash
# Health check
curl http://localhost/nginx-health

# Backend API through Nginx
curl http://localhost/api/health

# Frontend through Nginx
curl http://localhost

# Compare with direct access
curl http://localhost:8001/health  # Direct backend
curl http://localhost:3001  # Direct frontend
```

### View Nginx Logs

```bash
docker-compose logs -f nginx
```

## Configuration Files

- `default.conf` - Main Nginx configuration
  - Upstream definitions
  - Server block on port 80
  - Location blocks for routing
  - WebSocket support for HMR
  - Proxy headers and timeouts

## Troubleshooting

### Nginx not starting?

```bash
# Check configuration syntax
docker-compose exec nginx nginx -t

# View logs
docker-compose logs nginx
```

### WebSocket/HMR not working?

Ensure these headers are present in the configuration:
```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

### 502 Bad Gateway?

1. Check if backend/frontend are running:
```bash
docker-compose ps
```

2. Check network connectivity:
```bash
docker-compose exec nginx ping appointment_backend
docker-compose exec nginx ping appointment_frontend
```

### Path rewriting not working?

Test the rewrite rule:
```bash
# Should forward to /health (not /api/health)
curl -v http://localhost/api/health
```

## Production Parity

This Nginx setup mirrors the Kubernetes Ingress configuration:
- Same path routing rules
- Same `/api` prefix stripping
- WebSocket support
- Proper proxy headers

Use this for local development to ensure consistency with production behavior.
