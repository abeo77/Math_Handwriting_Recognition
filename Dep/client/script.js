// ==========================================
// Global Variables
// ==========================================
let canvas, ctx;
let isDrawing = false;
let currentTab = 'draw';
let uploadedImage = null;

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initTabs();
    initUpload();
    initButtons();
    initSettings();
});

// ==========================================
// Canvas Drawing
// ==========================================
function initCanvas() {
    canvas = document.getElementById('drawCanvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Drawing state
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Pen controls
    document.getElementById('penSize').addEventListener('input', (e) => {
        ctx.lineWidth = e.target.value;
        document.getElementById('penSizeValue').textContent = e.target.value;
    });
    
    document.getElementById('penColor').addEventListener('input', (e) => {
        ctx.strokeStyle = e.target.value;
    });
    
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ==========================================
// Tab Navigation
// ==========================================
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            currentTab = targetTab;
            hideResults();
        });
    });
}

// ==========================================
// Image Upload
// ==========================================
function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    // Click to upload
    uploadArea.addEventListener('click', () => imageUpload.click());
    
    // File input change
    imageUpload.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // Remove image
    removeImageBtn.addEventListener('click', () => {
        uploadedImage = null;
        imageUpload.value = '';
        uploadArea.classList.remove('hidden');
        previewContainer.classList.add('hidden');
        hideResults();
    });
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    if (!file.type.match('image/(png|jpeg|jpg)')) {
        showError('Please upload a PNG or JPEG image.');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('Image size must be less than 10MB.');
        return;
    }
    
    // Read and preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImage = e.target.result;
        document.getElementById('imagePreview').src = uploadedImage;
        document.getElementById('uploadArea').classList.add('hidden');
        document.getElementById('previewContainer').classList.remove('hidden');
        hideResults();
    };
    reader.readAsDataURL(file);
}

// ==========================================
// Conversion Functions
// ==========================================
function initButtons() {
    document.getElementById('convertDrawBtn').addEventListener('click', () => {
        convertToLatex('draw');
    });
    
    document.getElementById('convertUploadBtn').addEventListener('click', () => {
        convertToLatex('upload');
    });
    
    document.getElementById('copyBtn').addEventListener('click', copyLatexCode);
}

async function convertToLatex(source) {
    hideResults();
    showLoading();
    
    try {
        // Get image data
        let imageData;
        if (source === 'draw') {
            imageData = canvas.toDataURL('image/png');
        } else if (source === 'upload') {
            if (!uploadedImage) {
                throw new Error('Please upload an image first.');
            }
            imageData = uploadedImage;
        }
        
        // Convert base64 to hex
        const base64Data = imageData.split(',')[1];
        const binaryData = atob(base64Data);
        const hexData = Array.from(binaryData)
            .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
        
        // Get API settings
        const apiUrl = document.getElementById('apiUrl').value;
        const prompt = document.getElementById('promptText').value || 
            'Convert this handwritten mathematical expression to LaTeX format. Only output the LaTeX code without any explanation.';
        
        // Send request
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image_bytes: hexData,
                prompt: prompt
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.text();
        result = result.replace('"', '');
        // Display result
        hideLoading();
        displayLatexResult(result.trim());
        
    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Conversion error:', error);
    }
}

function displayLatexResult(latex) {
    // Clean up LaTeX code (remove markdown code blocks if present)
    let cleanLatex = latex
        .replace(/```latex\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^\$+|\$+$/g, '')
        .trim();
    
    // Display code
    document.getElementById('latexCode').textContent = cleanLatex;
    
    // Render LaTeX using MathJax
    const renderedDiv = document.getElementById('renderedLatex');
    renderedDiv.innerHTML = `\\[${cleanLatex}\\]`;
    
    // Trigger MathJax rendering
    if (window.MathJax) {
        MathJax.typesetPromise([renderedDiv]).catch((err) => {
            console.error('MathJax rendering error:', err);
            renderedDiv.innerHTML = '<p style="color: var(--error-color);">Failed to render LaTeX. The code may be invalid.</p>';
        });
    }
    
    // Show results
    document.getElementById('latexOutput').classList.remove('hidden');
}

function copyLatexCode() {
    const latexCode = document.getElementById('latexCode').textContent;
    const copyBtn = document.getElementById('copyBtn');
    
    navigator.clipboard.writeText(latexCode).then(() => {
        copyBtn.textContent = '✅';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = '📋';
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showError('Failed to copy to clipboard.');
    });
}

// ==========================================
// UI Helpers
// ==========================================
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

function showError(message) {
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorMessage').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('errorMessage').classList.add('hidden');
    }, 5000);
}

function hideResults() {
    document.getElementById('resultsSection').querySelectorAll('.hidden').forEach(el => {
        el.classList.add('hidden');
    });
    document.getElementById('latexOutput').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
}

// ==========================================
// Settings
// ==========================================
function initSettings() {
    // Load saved settings from localStorage
    const savedApiUrl = localStorage.getItem('apiUrl');
    const savedPrompt = localStorage.getItem('promptText');
    
    if (savedApiUrl) {
        document.getElementById('apiUrl').value = savedApiUrl;
    }
    if (savedPrompt) {
        document.getElementById('promptText').value = savedPrompt;
    }
    
    // Save settings on change
    document.getElementById('apiUrl').addEventListener('change', (e) => {
        localStorage.setItem('apiUrl', e.target.value);
    });
    
    document.getElementById('promptText').addEventListener('change', (e) => {
        localStorage.setItem('promptText', e.target.value);
    });
    
    // Test connection button
    document.getElementById('testConnectionBtn').addEventListener('click', testConnection);
}

async function testConnection() {
    const btn = document.getElementById('testConnectionBtn');
    const apiUrl = document.getElementById('apiUrl').value;
    
    btn.textContent = '⏳ Testing...';
    btn.disabled = true;
    
    try {
        // Try to connect to the health endpoint (if available) or base URL
        const healthUrl = apiUrl.replace('/predict', '/health');
        const response = await fetch(healthUrl, { method: 'GET' });
        
        if (response.ok) {
            btn.textContent = '✅ Connected!';
            btn.style.background = 'var(--success-color)';
        } else {
            btn.textContent = '⚠️ Server found, status: ' + response.status;
            btn.style.background = 'var(--error-color)';
        }
    } catch (error) {
        btn.textContent = '❌ Connection failed';
        btn.style.background = 'var(--error-color)';
        console.error('Connection test error:', error);
    }
    
    setTimeout(() => {
        btn.textContent = '🔗 Test Connection';
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
}
