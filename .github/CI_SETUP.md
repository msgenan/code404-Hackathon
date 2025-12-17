# CI/CD Secrets ve Environment Variables

Bu dosya, GitHub Actions workflow'larının düzgün çalışması için gerekli olan secrets ve environment variables'ları açıklar.

## GitHub Repository Secrets

GitHub repository Settings > Secrets and variables > Actions kısmından aşağıdaki secrets'ları ekleyin:

### Zorunlu Secrets

Aşağıdaki secrets otomatik olarak GitHub tarafından sağlanır:
- `GITHUB_TOKEN` - Otomatik olarak her workflow run'ında sağlanır

### Opsiyonel Secrets (Advanced Features için)

#### Codecov (Code Coverage Reporting)
```
CODECOV_TOKEN
```
**Nasıl alınır:**
1. https://codecov.io adresine gidin
2. GitHub hesabınızla giriş yapın
3. Repository'nizi ekleyin
4. Token'ı kopyalayıp GitHub secrets'a ekleyin

#### Kubernetes Deployment (Production)
```
KUBE_CONFIG
```
**Açıklama:** Base64 encoded kubeconfig dosyası
**Nasıl oluşturulur:**
```bash
cat ~/.kube/config | base64
```

#### Container Registry (GitHub Container Registry dışında kullanmak isterseniz)
```
DOCKER_USERNAME
DOCKER_PASSWORD
```

## Environment Variables

Workflow dosyasında tanımlı environment variables:

```yaml
env:
  REGISTRY: ghcr.io  # GitHub Container Registry
  IMAGE_NAME_BACKEND: ${{ github.repository }}/backend
  IMAGE_NAME_FRONTEND: ${{ github.repository }}/frontend
```

## GitHub Environments

Repository Settings > Environments kısmından aşağıdaki environment'ı oluşturun:

### production
- **Protection rules:**
  - Required reviewers: Ekip lideri veya senior developer
  - Wait timer: 5 dakika (opsiyonel)
  - Deployment branches: Sadece `main` branch
  
- **Environment secrets:**
  - Production-specific secrets buraya eklenebilir

## Workflow Permissions

`.github/workflows/ci.yml` dosyasında tanımlı permissions:

```yaml
permissions:
  contents: read          # Repository okuma
  security-events: write  # Trivy güvenlik tarama sonuçları
  actions: read          # Workflow artifacts okuma
  packages: write        # GitHub Container Registry'ye push
```

## Local Testing

CI/CD pipeline'ını local'de test etmek için:

### Act kullanarak (GitHub Actions local runner)
```bash
# Act'i yükle
brew install act

# Workflow'u local'de çalıştır
act -j backend  # Sadece backend job'ını çalıştır
act -j frontend # Sadece frontend job'ını çalıştır
act             # Tüm workflow'u çalıştır
```

### Docker Compose ile integration test
```bash
# .env dosyası oluştur
cp .env.example .env

# Servisleri başlat
docker-compose up --build

# Testleri çalıştır
docker-compose exec backend pytest
```

## Troubleshooting

### Common Issues

#### 1. "Resource not accessible by integration" hatası
**Çözüm:** Repository Settings > Actions > General > Workflow permissions kısmından "Read and write permissions" seçin.

#### 2. Docker build fails with "no space left on device"
**Çözüm:** GitHub Actions runner'da disk alanı temizleme:
```yaml
- name: Free disk space
  run: |
    docker system prune -af
    df -h
```

#### 3. Tests fail in CI but pass locally
**Çözüm:** 
- Environment variables'ları kontrol edin
- Test database connection string'ini kontrol edin
- CI'da kullanılan Python/Node version'unu kontrol edin

#### 4. Coverage upload fails
**Çözüm:** `continue-on-error: true` zaten ekli, ancak Codecov token'ını kontrol edin.

## Monitoring

### Workflow Status
- Repository ana sayfasında Actions tab
- README'deki CI badge'e tıklayarak

### Coverage Reports
- Codecov dashboard: https://codecov.io/gh/msgenan/code404-Hackathon
- PR'larda otomatik coverage comment'leri

### Security Scans
- Security tab > Code scanning alerts
- Dependabot alerts tab

## Best Practices

1. **Branch Protection Rules:** 
   - Main branch'e direct push'u engelleyin
   - PR'lar için CI check'lerini zorunlu yapın
   
2. **Semantic Commit Messages:**
   ```
   feat(backend): yeni özellik
   fix(frontend): bug düzeltmesi
   chore(ci): CI yapılandırması
   docs: dokümantasyon güncellemesi
   ```

3. **Pull Request Review:**
   - En az 1 approve gerekli
   - CI checks başarılı olmadan merge yapılmasın

4. **Regular Updates:**
   - Dependabot otomatik PR'ları haftalık review edin
   - Security alerts'leri hemen değerlendirin
