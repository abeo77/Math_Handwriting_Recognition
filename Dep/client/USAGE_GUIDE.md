# Hướng dẫn sử dụng 2 chế độ chuyển đổi

## 🎯 Tổng quan

Server giờ hỗ trợ **2 chế độ** chuyển đổi ảnh sang LaTeX:

### 1. **Latex Mode** (Pix2Text OCR)
- ✅ Dùng cho công thức toán học thông thường
- ✅ Nhanh, chính xác với các ký hiệu toán học cơ bản
- ✅ Không cần prompt

**Ví dụ output:**
```latex
\frac{x^2 + y^2}{z^2} = 1
```

### 2. **Label Mode** (Qwen3-VL)
- ✅ Dùng cho graph label, relation recognition
- ✅ Hiểu ngữ cảnh phức tạp hơn
- ✅ Sử dụng prompt để hướng dẫn model

**Ví dụ output:**
```latex
F_{p+2}^{2} = F_{p+2} \alpha_{1} \ldots \alpha_{p+2} F_{p+2}^{\alpha_{1} \ldots \alpha_{p+2}}
```

## 🚀 Cách sử dụng

### Streamlit App

1. **Khởi động:**
```powershell
cd D:\projectDAT\image-computer\new_process\Dep\client
streamlit run app.py
```

2. **Chọn chế độ:**
- Mở sidebar (Settings)
- Chọn **Conversion Type**:
  - `Latex` → Pix2Text OCR
  - `Label` → Qwen3-VL graph recognition

3. **Vẽ hoặc Upload ảnh**

4. **Convert** → Xem kết quả

### Gradio App

1. **Khởi động:**
```powershell
cd D:\projectDAT\image-computer\new_process\Dep\client
python app_gradio.py
```

2. **Chọn chế độ:**
- Mở "Settings" accordion
- Chọn **Conversion Type** radio button
- Điều chỉnh prompt nếu dùng Label mode

### Test Server (Mock)

```powershell
python test_server.py
```

**Test với curl:**
```powershell
# Latex mode
curl -X POST http://localhost:8080/predict -H "Content-Type: application/json" -d '{\"image_bytes\":\"...\",\"prompt\":\"\",\"Type\":\"Latex\"}'

# Label mode
curl -X POST http://localhost:8080/predict -H "Content-Type: application/json" -d '{\"image_bytes\":\"...\",\"prompt\":\"Extract graph labels\",\"Type\":\"Label\"}'
```

## 📋 Request Format

```json
{
  "image_bytes": "hex_encoded_image",
  "prompt": "Your instruction (optional for Latex mode)",
  "Type": "Latex" // or "Label"
}
```

## 🔄 So sánh 2 chế độ

| Feature | Latex Mode | Label Mode |
|---------|------------|------------|
| **Model** | Pix2Text | Qwen3-VL |
| **Tốc độ** | ⚡ Nhanh | 🐢 Chậm hơn |
| **Độ chính xác** | ✅ Tốt với công thức đơn giản | ✅ Tốt với ngữ cảnh phức tạp |
| **Prompt** | ❌ Không cần | ✅ Có thể tùy chỉnh |
| **Trường hợp dùng** | Math formulas, equations | Graph labels, relations, complex structures |

## 🎨 Ví dụ thực tế

### Latex Mode - Phù hợp với:
- ✅ `x^2 + y^2 = r^2`
- ✅ `\int_0^1 x dx`
- ✅ `\frac{a}{b} + c`
- ✅ `\sum_{i=1}^n i`

### Label Mode - Phù hợp với:
- ✅ Graph node labels với nhiều subscript/superscript
- ✅ Complex mathematical relations
- ✅ Structural formulas
- ✅ Expressions với nhiều ký hiệu đặc biệt

## 🐛 Troubleshooting

### Server trả về lỗi "Type not found"
→ Đảm bảo request có field `"Type": "Latex"` hoặc `"Type": "Label"`

### Kết quả không chính xác
→ Thử đổi mode:
- Nếu dùng Latex → Thử Label
- Nếu dùng Label → Thử Latex hoặc điều chỉnh prompt

### Prompt không có hiệu lực
→ Prompt chỉ hoạt động với `Type: "Label"`, không ảnh hưởng đến Latex mode

## 📝 Code Examples

### Python
```python
import requests

def convert_image(image_path, conversion_type="Latex"):
    # Read and convert to hex
    with open(image_path, "rb") as f:
        hex_data = f.read().hex()
    
    payload = {
        "image_bytes": hex_data,
        "prompt": "Extract labels" if conversion_type == "Label" else "",
        "Type": conversion_type
    }
    
    response = requests.post("http://localhost:8000/predict", json=payload)
    return response.text

# Usage
latex_result = convert_image("math.png", "Latex")
label_result = convert_image("graph.png", "Label")
```

## 🎯 Khuyến nghị

1. **Công thức toán học đơn giản** → Dùng **Latex mode**
2. **Graph labels, complex structures** → Dùng **Label mode**
3. **Không chắc chắn** → Thử cả 2 modes và so sánh kết quả
