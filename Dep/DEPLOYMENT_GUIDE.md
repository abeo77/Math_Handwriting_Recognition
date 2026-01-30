# 🐳 Qwen Vision API - Docker Deployment Package

## ✅ Các file đã tạo

1. **Dockerfile** - Container build configuration
2. **docker-compose.yml** - Docker Compose orchestration
3. **.dockerignore** - Files to exclude from build
4. **README.md** - Hướng dẫn chi tiết
5. **build-and-run.ps1** - PowerShell script tự động build & run
6. **test_client.py** - Python client để test API
7. **main.py** - Đã fix lỗi batch processing

## 🔧 Các lỗi đã fix

### 1. Import Error (lightning.app)
❌ **Lỗi gốc**: `ModuleNotFoundError: No module named 'lightning.app'`
✅ **Fix**: 
- Thêm `lightning` vào requirements.txt
- Dockerfile cài đặt đầy đủ dependencies

### 2. Batch Processing Issue
❌ **Lỗi tiềm ẩn**: Code xử lý batch input không robust
✅ **Fix**: 
```python
def predict(self, inputs):
    # Handle both single input and batch input
    if isinstance(inputs, list):
        batch_inputs = inputs[0] if len(inputs) == 1 else inputs
    else:
        batch_inputs = inputs
    # ...
```

### 3. Docker Build Optimization
✅ Improvements:
- Multi-stage caching với requirements.txt
- Cài PyTorch trước để tận dụng cache
- Thêm health check endpoint
- Proper CUDA/GPU support

## 🚀 Cách sử dụng nhanh

### Bước 1: Chuẩn bị
```powershell
cd D:\projectDAT\image-computer\new_process\Dep
```

Đảm bảo có file `lora_model_qwen3vl.zip` trong thư mục này.

### Bước 2: Build & Run (Tự động)
```powershell
.\build-and-run.ps1
```

Script sẽ:
- ✅ Kiểm tra Docker đang chạy
- ✅ Kiểm tra NVIDIA runtime
- ✅ Build Docker image
- ✅ Start container
- ✅ Show logs

### Bước 3: Test API
```powershell
# Activate venv (nếu có)
& "D:\projectDAT\image-computer\new_process\venv\Scripts\Activate.ps1"

# Install requests nếu chưa có
pip install requests

# Test với ảnh
python test_client.py path/to/your/math_image.png
```

## 📋 Commands Reference

### Docker Compose
```powershell
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build

# View status
docker-compose ps
```

### Docker Direct
```powershell
# Build
docker build -t qwen-vision-api:latest .

# Run
docker run -d --name qwen-vision-server --gpus all -p 8080:8080 qwen-vision-api:latest

# Logs
docker logs -f qwen-vision-server

# Stop
docker stop qwen-vision-server
docker rm qwen-vision-server
```

## 🔍 Monitoring

### Check container status
```powershell
docker ps
docker stats qwen-vision-server
```

### Check GPU usage
```powershell
# Inside container
docker exec qwen-vision-server nvidia-smi

# From host
nvidia-smi
```

### API endpoints
```powershell
# Health check
curl http://localhost:8080/health

# Or in PowerShell
Invoke-WebRequest http://localhost:8080/health
```

## 📦 Image Size Optimization (Optional)

Nếu muốn giảm image size:

1. Sử dụng multi-stage build
2. Xóa cache sau khi install
3. Sử dụng alpine base (cẩn thận với CUDA)

Current image: ~15-20GB (bao gồm CUDA + PyTorch + model)

## 🛠️ Troubleshooting

### Container không start
```powershell
# Xem logs chi tiết
docker-compose logs

# Hoặc
docker logs qwen-vision-server
```

### GPU không được detect
```powershell
# Test NVIDIA runtime
docker run --rm --gpus all nvidia/cuda:12.1.0-base-ubuntu22.04 nvidia-smi

# Nếu lỗi, reinstall nvidia-container-toolkit
```

### Port 8080 đã được sử dụng
Sửa trong `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Dùng port 8081 thay vì 8080
```

### Out of Memory
1. Giảm batch size trong main.py
2. Hoặc thêm memory limit:
```yaml
deploy:
  resources:
    limits:
      memory: 16G
```

## 📚 Next Steps

1. ✅ Test API với nhiều ảnh khác nhau
2. ✅ Monitor GPU memory usage
3. ✅ Setup reverse proxy (nginx) nếu cần
4. ✅ Add authentication nếu deploy production
5. ✅ Setup logging & monitoring (Prometheus/Grafana)

## 📞 Support

Nếu gặp lỗi, check:
1. Docker logs: `docker-compose logs -f`
2. Container status: `docker ps -a`
3. GPU availability: `nvidia-smi`
4. Port conflicts: `netstat -ano | findstr :8080`

---
Created: 2025-11-02
Version: 1.0
