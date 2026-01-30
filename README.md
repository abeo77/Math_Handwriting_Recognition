# 🧮 Handwritten Mathematical Expression to LaTeX Converter

A comprehensive AI-powered system for converting handwritten mathematical expressions to LaTeX format, featuring dual conversion modes and multiple deployment options. Built for the CROHME (Competition on Recognition of Online Handwritten Mathematical Expressions) dataset.

## 🎯 Features

### Dual Conversion Modes

1. **Latex Mode** (Pix2Text OCR)
   - Fast OCR-based conversion for standard mathematical formulas
   - No custom prompt required
   - Optimized for common mathematical expressions
   - Example output: `\frac{x^2 + y^2}{z^2} = 1`

2. **Label Mode** (Qwen3-VL Fine-tuned)
   - Advanced vision-language model for complex graph labels
   - Context-aware with customizable prompts
   - Fine-tuned with LoRA on CROHME dataset
   - Example output: `F_{p+2}^{2} = F_{p+2} \alpha_{1} \ldots \alpha_{p+2}`

### Multiple User Interfaces

- **Streamlit App** ⭐ (Recommended)
  - Modern, interactive UI with drawing canvas
  - Adjustable pen size and color
  - Drag & drop file upload
  - Side-by-side LaTeX code and rendered output
  - Built-in settings panel

- **Gradio App**
  - Simpler interface for quick demos
  - Dual-mode comparison view
  - Easy to deploy

- **HTML/JavaScript App**
  - Pure frontend solution
  - No backend dependencies for UI
  - Runs directly in browser
  - MathJax rendering

## 🏗️ Architecture

### Model Components

1. **Vision Transformer (ViT) Encoder**
   - Custom ViT implementation with patch-based processing
   - Hybrid option with ResNet backbone
   - Configurable patch size and dimensions
   - Positional embeddings for spatial awareness

2. **Transformer Decoder**
   - Autoregressive generation
   - Cross-attention with encoder outputs
   - Temperature-based sampling
   - Top-k filtering for better predictions

3. **Qwen3-VL Fine-tuning**
   - Base model: `unsloth/Qwen3-VL-4B-Instruct-unsloth-bnb-4bit`
   - 4-bit quantization for efficiency
   - LoRA adapters (r=16, alpha=16)
   - Fine-tuned on both vision and language layers

### API Server

- **Framework**: FastAPI + LitServe
- **Batch Processing**: Up to 4 concurrent requests
- **CORS Enabled**: Cross-origin support for web apps
- **GPU Acceleration**: CUDA support with automatic memory management

## 📦 Installation

### Prerequisites

- Python 3.8+
- CUDA-capable GPU (recommended)
- Docker (for containerized deployment)

### Quick Setup

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
pip install -r Dep/requirements.txt
pip install -r Dep/client/requirements.txt
```

### Docker Deployment

```bash
cd Dep
docker-compose up -d
```

The API server will be available at `http://localhost:8080`

## 🚀 Usage

### Option 1: Streamlit App (Recommended)

```powershell
cd Dep/client
.\start_streamlit.bat
```

Opens at `http://localhost:8501`

### Option 2: Gradio App

```powershell
cd Dep/client
.\start_gradio.bat
```

Opens at `http://localhost:7860`

### Option 3: HTML/JS App with Test Server

```powershell
cd Dep/client
.\start_test_server.bat
# Then open index.html in your browser
```

### Option 4: Production API Server

```powershell
cd Dep
python main.py
```

API endpoint: `http://localhost:8000/predict`

## 🔧 Configuration

### Model Configuration (`config.py`)

```python
encoder_structure: 'vit'  # or 'hybrid'
decoder_structure: 'transformer'
dim: 512  # Model dimension
num_layers: 6  # Transformer layers
num_heads: 6  # Attention heads
max_seq_len: 256  # Maximum output length
```

### API Request Format

```json
{
  "image_bytes": "hex_encoded_image_data",
  "prompt": "Convert this handwritten mathematical expression to LaTeX",
  "Type": "Label"  // or "Latex"
}
```

## 📊 Training

### Dataset Preparation

The project uses the CROHME dataset with the following structure:
- Training: 1,613 samples (datagen_train.txt)
- Validation: 986 samples (CROHME2019)
- Test: 1,199 samples (CROHME2019)

### Training the ViT Model

```bash
python train.py
```

Features:
- Mixed precision training (FP16)
- Gradient accumulation
- Automatic checkpoint saving
- CUDA out-of-memory handling

### Fine-tuning Qwen3-VL

See `Qwen2_5_VL_7B_Vision_label_graph.ipynb` for the complete fine-tuning pipeline using Unsloth.

Key training parameters:
- Batch size: 2 (per device)
- Gradient accumulation: 4 steps
- Learning rate: 2e-4
- Optimizer: AdamW 8-bit
- LoRA rank: 16
- Training epochs: 1 (full dataset)

## 🧪 Evaluation

### Running Evaluation

```bash
python evaluate.py
```

Metrics:
- **Exact Match Accuracy**: Percentage of perfectly matched predictions
- **Similarity Score**: Character-level similarity using SequenceMatcher
- **Per-sample Analysis**: Detailed comparison of predictions vs ground truth

### Model Performance

The system evaluates on:
- CROHME 2019 test set (1,199 samples)
- Custom validation set
- Real-world handwritten samples

## 📁 Project Structure

```
.
├── config.py                    # Model configuration
├── model.py                     # Main model architecture (Encoder-Decoder)
├── gc_module.py                 # Vision Transformer (ViT) encoder
├── transformer.py               # Transformer decoder with autoregressive wrapper
├── hybrid.py                    # Hybrid encoder (ResNet + ViT)
├── Dataset.py                   # Custom dataset loader for CROHME
├── train.py                     # Training script
├── evaluate.py                  # Evaluation script
├── Dep/
│   ├── main.py                  # FastAPI + LitServe server
│   ├── Dockerfile               # Docker container configuration
│   ├── docker-compose.yml       # Docker Compose orchestration
│   ├── requirements.txt         # Python dependencies for server
│   ├── DEPLOYMENT_GUIDE.md      # Detailed deployment instructions
│   └── client/
│       ├── app.py               # Streamlit application
│       ├── app_gradio.py        # Gradio application
│       ├── app_gradio_dual.py   # Gradio dual-mode comparison
│       ├── index.html           # HTML/JS web interface
│       ├── script.js            # Frontend JavaScript logic
│       ├── styles.css           # CSS styling
│       ├── test_server.py       # Mock server for testing
│       └── requirements.txt     # Client dependencies
├── DataGenerationTool/
│   ├── gen_latex.py             # LaTeX generation utilities
│   └── toolfordatalabel.py      # Data labeling tools
└── Notebooks/
    ├── Qwen2_5_VL_7B_Vision_label_graph.ipynb  # Qwen3-VL fine-tuning
    ├── train_vit_crohme.ipynb                  # ViT training notebook
    └── EDA.ipynb                               # Exploratory data analysis
```

## 🛠️ Technical Details

### Dependencies

**Core ML Libraries:**
- PyTorch 2.1.0+
- Transformers (Hugging Face)
- Unsloth (for efficient fine-tuning)
- PEFT (Parameter-Efficient Fine-Tuning)
- bitsandbytes (quantization)

**Computer Vision:**
- OpenCV (cv2)
- Pillow (PIL)
- Albumentations (data augmentation)
- Pix2Text (OCR)

**API & Web:**
- FastAPI
- LitServe
- Streamlit
- Gradio
- Uvicorn

**Utilities:**
- einops (tensor operations)
- timm (image models)
- x-transformers (transformer utilities)

### GPU Requirements

- **Minimum**: 8GB VRAM (for inference with 4-bit quantization)
- **Recommended**: 16GB+ VRAM (for training)
- **Training**: 24GB+ VRAM (for full precision training)

### Memory Optimization

- 4-bit quantization using bitsandbytes
- Gradient checkpointing
- Mixed precision training (FP16)
- Gradient accumulation
- Automatic CUDA memory management

## 🐳 Docker Deployment

### Building the Image

```powershell
cd Dep
.\build-and-run.ps1
```

Or manually:

```bash
docker build -t qwen-vision-api .
docker run --gpus all -p 8080:8080 -v ./lora_model_qwen3vl.zip:/app/lora_model_qwen3vl.zip:ro qwen-vision-api
```

### Docker Features

- NVIDIA GPU support
- Automatic model loading
- Volume mounting for models and outputs
- Health checks
- Auto-restart on failure
- CORS enabled for web access

## 🧩 API Endpoints

### POST `/predict`

Convert image to LaTeX

**Request:**
```json
{
  "image_bytes": "hex_encoded_png_data",
  "prompt": "Convert this to LaTeX",
  "Type": "Label"
}
```

**Response:**
```json
{
  "prediction": "\\frac{x^2}{y^2}"
}
```

### GET `/`

Health check endpoint

**Response:**
```json
{
  "message": "Image to LaTeX API Server",
  "status": "running"
}
```

## 📝 Examples

### Using the Python Client

```python
import requests
from PIL import Image
import io

# Load image
image = Image.open("math_expression.png")
img_bytes = io.BytesIO()
image.save(img_bytes, format='PNG')
hex_data = img_bytes.getvalue().hex()

# Make request
response = requests.post(
    "http://localhost:8000/predict",
    json={
        "image_bytes": hex_data,
        "prompt": "Convert to LaTeX",
        "Type": "Label"
    }
)

print(response.json())
```

### Using the Streamlit App

1. Launch the app: `.\start_streamlit.bat`
2. Draw or upload a mathematical expression
3. Click "Convert to LaTeX"
4. View both modes (Latex & Label) side-by-side
5. Copy the generated LaTeX code

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional model architectures
- Support for more mathematical notation types
- Performance optimizations
- Extended dataset support
- Multi-language support

## 📄 License

[Add your license information here]

## 🙏 Acknowledgments

- CROHME dataset creators
- Unsloth team for efficient fine-tuning tools
- Qwen team for the vision-language model
- Pix2Text for OCR capabilities

## 📧 Contact

[Add contact information here]

## 🔗 References

- [CROHME Competition](https://www.isical.ac.in/~crohme/)
- [Qwen3-VL Model](https://huggingface.co/Qwen)
- [Unsloth](https://github.com/unslothai/unsloth)
- [Pix2Text](https://github.com/breezedeus/pix2text)


