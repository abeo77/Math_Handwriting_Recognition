# Image to LaTeX Web App

A modern web application for converting handwritten mathematical expressions to LaTeX format using the Qwen3-VL model.

## 🎯 Available Versions

### 1. **Python Streamlit App** (Recommended) ⭐
Modern, interactive Python UI with drawing canvas and file upload.

```powershell
.\start_streamlit.bat
# Opens at http://localhost:8501
```

**Features:**
- ✏️ Canvas drawing with adjustable pen size/color
- 📁 File upload with drag & drop
- 🎨 Beautiful, responsive interface
- 📊 Side-by-side LaTeX code and rendered output
- ⚙️ Built-in settings panel

### 2. **Python Gradio App** (Alternative)
Simpler interface, good for quick demos.

```powershell
.\start_gradio.bat
# Opens at http://localhost:7860
```

**Features:**
- ✏️ Drawing pad
- 📁 File upload
- 📚 Example gallery support
- 🚀 Fast and lightweight

### 3. **HTML/JavaScript App** (Original)
Pure frontend, no Python server needed for the UI.

```powershell
start index.html
```

**Features:**
- 🌐 Runs directly in browser
- 📱 Mobile-friendly
- 🎨 Custom animations
- ⚡ No dependencies

## 🌟 Features

- **✏️ Draw Mode**: Draw mathematical expressions directly on canvas
  - Adjustable pen size and color
  - Clear canvas functionality
  - Touch support for mobile devices

- **📁 Upload Mode**: Upload images of mathematical expressions
  - Drag & drop support
  - Image preview
  - Support for PNG, JPG, JPEG formats

- **🎨 Modern UI**: Clean, responsive design with smooth animations

- **⚙️ Configurable**: 
  - Custom API endpoint
  - Adjustable prompt for the model
  - Settings saved in localStorage

- **📋 Easy Copy**: One-click copy of generated LaTeX code

- **👁️ Live Preview**: MathJax rendering of LaTeX expressions

## 🚀 Quick Start

### Option 1: Test with Mock Server (Recommended for first-time setup)

1. **Start the test server** (no Docker needed):
   ```powershell
   cd D:\projectDAT\image-computer\new_process\Dep\client
   .\start_test_server.bat
   ```
   
   Or manually:
   ```powershell
   pip install fastapi uvicorn
   python test_server.py
   ```

2. **Open the web app**:
   ```powershell
   start index.html
   ```

3. **Try it out**:
   - The test server returns mock LaTeX: `x^2 + y^2 = z^2`
   - Use this to verify the web interface works correctly

### Option 2: Use Real Model with Docker

1. **Start the API Server**:
   ```powershell
   cd D:\projectDAT\image-computer\new_process\Dep
   docker-compose up -d
   ```

2. **Open the Web App**:
   ```powershell
   start D:\projectDAT\image-computer\new_process\Dep\client\index.html
   ```

3. **Configure API Settings**:
   - Server URL: `http://localhost:8080/predict`
   - Click "Test Connection" to verify

4. **Convert Expressions** - Now with real AI predictions!

## 📁 File Structure

```
client/
├── index.html              # Main HTML file
├── styles.css              # Styling and animations
├── script.js               # Application logic
├── test_server.py          # Mock server for testing (no model required)
├── start_test_server.bat   # Quick start script for test server
└── README.md               # This file
```

## 🛠️ Technical Details

### Dependencies

- **MathJax 3**: For rendering LaTeX expressions
- No build tools required - pure HTML/CSS/JavaScript

### API Integration

The app sends POST requests to your Qwen3-VL API server with the following payload:

```json
{
  "image_bytes": "hex_encoded_image_data",
  "prompt": "Your custom prompt"
}
```

### Image Processing

1. Canvas drawings are converted to PNG using `canvas.toDataURL()`
2. Uploaded images are read as base64 Data URLs
3. Base64 data is converted to hexadecimal format
4. Hex data is sent to the API server

### Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Requires modern browser with ES6+ support

## 🎨 Customization

### Changing Colors

Edit `styles.css` CSS variables in `:root`:

```css
:root {
    --primary-color: #4f46e5;
    --primary-hover: #4338ca;
    /* ... more colors */
}
```

### Changing Canvas Size

Edit `index.html` canvas dimensions:

```html
<canvas id="drawCanvas" width="800" height="300"></canvas>
```

### Default Prompt

Edit the default prompt in `index.html`:

```html
<textarea id="promptText">Your custom default prompt here</textarea>
```

## 🐛 Troubleshooting

### Server Connection Failed

1. Check if Docker container is running:
   ```powershell
   docker ps
   ```

2. Check server logs:
   ```powershell
   docker-compose logs -f
   ```

3. Verify API URL in settings (default: `http://localhost:8080/predict`)

### CORS Errors

**Fixed!** The `main.py` now includes CORS middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

server.app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

If you still see CORS errors:
1. Rebuild the Docker image: `docker-compose build`
2. Restart: `docker-compose up -d`
3. Or use the test server which has CORS enabled by default

### LaTeX Rendering Issues

1. Check browser console for MathJax errors
2. Verify the LaTeX code is valid
3. Try wrapping in math delimiters: `\[ ... \]` or `$ ... $`

## 📝 Example Usage

### Drawing Example

1. Draw "x²" on canvas
2. Convert → Get LaTeX: `x^{2}`
3. Copy to clipboard → Paste in LaTeX editor

### Upload Example

1. Upload image of equation "∫₀¹ x dx"
2. Convert → Get LaTeX: `\int_{0}^{1} x \, dx`
3. See rendered preview below

## 🔒 Security Notes

- Images are processed locally in the browser
- Only hex-encoded image data is sent to the server
- No data is stored permanently
- API settings saved in browser localStorage only

## 📄 License

This project is part of the CROHME handwritten math recognition system.

## 🤝 Contributing

Feel free to modify and extend this web app for your needs!

## 📧 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Docker container is running
3. Test API endpoint directly using curl or Postman
