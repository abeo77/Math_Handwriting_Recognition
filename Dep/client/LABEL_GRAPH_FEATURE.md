# 📊 Label Graph Visualization Feature

## ✨ Tính năng mới đã thêm

### Streamlit App (app.py)

Khi sử dụng **Label Mode** (Qwen3-VL), app sẽ hiển thị thêm:

#### 1. **Label Graph Visualization Section** 📊

**Extracted Labels (Cột trái):**
- Tự động phân tích và extract các labels từ LaTeX code
- Hiển thị tối đa 10 labels đầu tiên
- Format: Numbered list với syntax highlighting

**Graph Structure (Cột phải):**
- **Total Expression Length**: Độ dài tổng của biểu thức
- **Subscripts**: Số lượng subscripts (_)
- **Superscripts**: Số lượng superscripts (^)
- **Special symbols**: Số lượng ký tự đặc biệt LaTeX (\)

#### 2. **Visual Layout**

```
📊 Label Graph Visualization
┌─────────────────────┬─────────────────────┐
│ Extracted Labels    │ Graph Structure     │
│ 1. F_{p+2}         │ Length: 97 chars    │
│ 2. alpha_{1}       │ Subscripts: 8       │
│ 3. ...             │ Superscripts: 4     │
│                     │ Special symbols: 5  │
└─────────────────────┴─────────────────────┘

LaTeX Code                  Rendered Expression
┌──────────────┐           ┌──────────────┐
│ F_{p+2}^{2}  │           │  F²_{p+2}... │
│ = ...        │           │              │
└──────────────┘           └──────────────┘
```

### Gradio App (app_gradio.py)

**Graph Analysis Output** (chỉ hiển thị khi Type=Label):

```markdown
### 📊 Label Graph Analysis

**Structure:**
- Length: 97 chars
- Subscripts: 8
- Superscripts: 4
- Special symbols: 5

**Extracted Labels:**
1. `F_{p+2}`
2. `alpha_{1}`
3. `ldots`
...
```

---

## 🎯 Ví dụ thực tế

### Input (Label Mode)
```
Type: Label
Prompt: "Extract graph labels and convert to LaTeX"
Image: Graph with mathematical labels
```

### Output

**LaTeX Code:**
```latex
F_{p+2}^{2} = F_{p+2} \alpha_{1} \ldots \alpha_{p+2} F_{p+2}^{\alpha_{1} \ldots \alpha_{p+2}}
```

**Label Graph Visualization:**

| Extracted Labels | Graph Structure |
|------------------|-----------------|
| 1. F_{p+2} | Length: 97 chars |
| 2. alpha_{1} | Subscripts: 8 |
| 3. alpha_{p+2} | Superscripts: 4 |
| 4. ldots | Special symbols: 12 |

**Rendered:**
$$F_{p+2}^{2} = F_{p+2} \alpha_{1} \ldots \alpha_{p+2} F_{p+2}^{\alpha_{1} \ldots \alpha_{p+2}}$$

---

## 🔧 Implementation Details

### Label Extraction Algorithm

```python
import re

# Extract individual labels
labels = re.findall(r'([A-Z]_\{[^}]+\}|\w+)', latex_code)

# Pattern matches:
# - [A-Z]_\{[^}]+\}  → Capital letter with subscript (e.g., F_{p+2})
# - \w+              → Word characters (e.g., alpha, beta)
```

### Structure Analysis

```python
# Count special characters
num_subscripts = latex_code.count('_')
num_superscripts = latex_code.count('^')
num_symbols = latex_code.count('\\')

# Metrics
total_length = len(latex_code)
```

---

## 📱 User Interface

### Streamlit

**When Type = "Latex":**
```
📊 Results
✅ Converted using Pix2Text (Latex OCR)

┌──────────────────────┬──────────────────────┐
│ LaTeX Code           │ Rendered Expression  │
└──────────────────────┴──────────────────────┘
```

**When Type = "Label":**
```
📊 Results
✅ Converted using Qwen3-VL (Label Recognition)

📊 Label Graph Visualization
┌──────────────────────┬──────────────────────┐
│ Extracted Labels     │ Graph Structure      │
└──────────────────────┴──────────────────────┘

┌──────────────────────┬──────────────────────┐
│ LaTeX Code           │ Rendered Expression  │
└──────────────────────┴──────────────────────┘
```

### Gradio

**Output Components:**
1. `latex_output` - Code block with LaTeX
2. `rendered_output` - Markdown with rendered math
3. `graph_info_output` - **NEW!** Graph analysis (visible only for Label mode)

---

## 🎨 Styling

### Custom CSS (Streamlit)

```css
.rendered-latex {
    background-color: #f8fafc;
    padding: 2rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
    font-size: 1.5rem;
    text-align: center;
    min-height: 100px;
}
```

---

## 🧪 Test Cases

### Test 1: Simple Label
```latex
Input: F_{p+2}
Expected Labels: ['F_{p+2}']
Expected Subscripts: 1
```

### Test 2: Complex Expression
```latex
Input: F_{p+2}^{2} = F_{p+2} \alpha_{1} \ldots \alpha_{p+2}
Expected Labels: ['F_{p+2}', 'alpha_{1}', 'ldots', 'alpha_{p+2}']
Expected Subscripts: 4
Expected Superscripts: 1
Expected Symbols: 3 (\alpha, \ldots)
```

### Test 3: No Labels (Latex Mode)
```latex
Input: \frac{x^2}{y}
Expected: Graph visualization HIDDEN (Latex mode)
```

---

## 🚀 Cách sử dụng

### Streamlit

1. Chọn **Label** trong "Conversion Type"
2. Vẽ hoặc upload ảnh graph
3. Click "Convert to LaTeX"
4. Xem **Label Graph Visualization** section tự động hiện

### Gradio

1. Chọn **Label** radio button
2. Upload/vẽ ảnh
3. Click "Convert to LaTeX"
4. Scroll xuống xem **Graph Analysis** output

---

## 📊 Benefits

✅ **Better Understanding**: Nhìn thấy cấu trúc của graph labels  
✅ **Quick Validation**: Kiểm tra nhanh số lượng labels  
✅ **Debugging**: Phát hiện lỗi trong parsing  
✅ **Learning**: Hiểu cách LaTeX biểu diễn graph structures  

---

## 🔮 Future Enhancements

- [ ] Visual graph diagram generation
- [ ] Interactive label editing
- [ ] Export graph structure to JSON/XML
- [ ] Label relationship mapping
- [ ] Color-coded label categories
