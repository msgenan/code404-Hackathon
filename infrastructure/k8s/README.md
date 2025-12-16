# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the Smart Appointment System to a Kubernetes cluster.

## Architecture

- **Backend:** FastAPI (2 replicas, auto-scaling enabled)
- **Frontend:** Next.js (2 replicas)
- **Database:** PostgreSQL 16 (StatefulSet with persistent storage)
- **Cache:** Redis 7 (Deployment)
- **Ingress:** NGINX Ingress Controller for traffic routing

## Prerequisites

- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- `kubectl` CLI installed and configured
- Docker installed for building images
- NGINX Ingress Controller enabled

## Quick Start

### 1. Enable Ingress Controller

**For Minikube:**
```bash
minikube addons enable ingress
```

**For Docker Desktop:**
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

### 2. Build Docker Images

```bash
# Point your shell to minikube's docker daemon
eval $(minikube docker-env)

# Build images
docker build -t appointment-backend:latest ./backend
docker build -t appointment-frontend:latest ./frontend
```

### 3. Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f infrastructure/k8s/00-namespace.yaml

# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=POSTGRES_USER=appointment_user \
  --from-literal=POSTGRES_PASSWORD=your_secure_password \
  -n appointment-system

# Apply all manifests
kubectl apply -f infrastructure/k8s/
```

### 4. Access the Application

```bash
# Get Minikube IP
minikube ip

# Access
# Frontend: http://<minikube-ip>
# Backend: http://<minikube-ip>/api
```

## Manifest Files

- `00-namespace.yaml` - Namespace definition
- `01-configmap.yaml` - Configuration
- `02-secret.yaml` - Secrets template
- `03-postgres.yaml` - PostgreSQL StatefulSet
- `04-redis.yaml` - Redis Deployment
- `05-backend.yaml` - Backend Deployment
- `06-frontend.yaml` - Frontend Deployment
- `07-hpa.yaml` - Horizontal Pod Autoscaler
- `08-ingress.yaml` - Ingress routing

## Monitoring

```bash
# Check pods
kubectl get pods -n appointment-system

# View logs
kubectl logs -n appointment-system deployment/backend -f

# Check HPA
kubectl get hpa -n appointment-system
```

## Cleanup

```bash
kubectl delete namespace appointment-system
```
