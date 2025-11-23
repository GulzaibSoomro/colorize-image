# DeOldify Image Colorizer

A web application that colorizes black and white images using the DeOldify deep learning model, built with React.js + Vite frontend and Python Flask backend.

## Features

- 🎨 Upload black and white images through a web interface
- 🤖 Process images using the DeOldify model to add realistic colors
- 📊 Display before/after comparison of original and colorized images
- 💾 Download the colorized results
- 🔄 Automatic API proxying from frontend to backend
- 🛡️ PyTorch 2.6+ compatibility fixes

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- CUDA-capable GPU (optional, but recommended for faster processing)
- ~2GB free disk space for model files

## Installation

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. **Vite Configuration** (`vite.config.js`):
   - Frontend runs on port **3001** (configurable)
   - API proxy configured to forward `/api/*` requests to backend on port 5000
   - Proxy settings:
     ```javascript
     proxy: {
       '/api': {
         target: 'http://127.0.0.1:5000',
         changeOrigin: true,
         secure: false
       }
     }
     ```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3001` (or the port specified in `vite.config.js`)

**Note:** The proxy automatically forwards all `/api/*` requests from the frontend to the backend. No need to configure CORS for API calls.

### Backend Setup

1. Install backend dependencies:
```bash
cd backend
python -m pip install -r requirements.txt
```

**Key Dependencies:**
- Flask 3.0.0 (web server)
- Flask-CORS 4.0.0 (cross-origin requests)
- PyTorch >=2.0.0 (deep learning framework)
- FastAI >=2.7.0 (DeOldify dependency)
- NumPy <2.0,>=1.24.0 (compatibility requirement)
- OpenCV <4.9 (image processing)

2. Install DeOldify:

**Note:** The DeOldify repository was archived in October 2024, but it's still fully functional and can be cloned and used.

**Option A: Using the setup script (recommended)**
- On Windows: Run `backend\setup_deoldify.bat`
- On Linux/Mac: Run `bash backend/setup_deoldify.sh`

**Option B: Manual installation**
```bash
cd backend
git clone https://github.com/jantic/DeOldify.git DeOldify
cd DeOldify
python -m pip install -r requirements.txt
cd ..
```

3. Download the pre-trained models:
   - **Note:** Models are available via direct download links (not from GitHub releases)
   - Download one of these model files (~1.4 GB each):
     - **Stable Model** (recommended - more realistic colors): 
       [ColorizeStable_gen.pth](https://www.dropbox.com/s/axsd2g85uyixaho/ColorizeStable_gen.pth?dl=0)
     - **Artistic Model** (more vibrant/artistic colors): 
       [ColorizeArtistic_gen.pth](https://data.deepai.org/deoldify/ColorizeArtistic_gen.pth)
   - Place the downloaded `.pth` file in `backend/DeOldify/models/` directory
   - **Important:** The file must be named exactly `ColorizeStable_gen.pth` (for stable model) or `ColorizeArtistic_gen.pth` (for artistic model)
   - You only need one model file

4. **Backend Configuration** (`backend/app.py`):

   **Automatic Path Setup:**
   - The backend automatically adds `backend/DeOldify/` to Python path
   - Model path is automatically configured to `backend/DeOldify/models/`

   **PyTorch 2.6+ Compatibility:**
   - The backend includes a monkey-patch for `torch.load()` to use `weights_only=False`
   - This is required for PyTorch 2.6+ to load DeOldify checkpoints
   - Safe because DeOldify checkpoints are from a trusted source

   **Model Loading:**
   - Uses `root_folder` parameter pointing to `backend/DeOldify/`
   - Automatically finds models in `backend/DeOldify/models/ColorizeStable_gen.pth`
   - Supports both GPU and CPU processing (auto-detected)

   **CORS Configuration:**
   - Flask-CORS enabled for all origins
   - Allows frontend on different port to access backend

5. Start the Flask server:
```bash
# From project root
python backend/app.py

# Or use the startup script:
# Windows: start-backend.bat
# Linux/Mac: bash start-backend.sh
```

The backend will be available at `http://localhost:5000`

**Backend Endpoints:**
- `GET /api/health` - Health check endpoint
- `POST /api/colorize` - Colorize image (expects multipart/form-data with 'image' field)

## Usage

1. **Start the backend server first:**
   ```bash
   python backend/app.py
   ```
   Wait for the message "DeOldify colorizer ready!" before proceeding.

2. **Start the frontend server:**
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3001` (or the port shown in the terminal)

4. **Upload a black and white image** using drag-and-drop or file selection

5. **Wait for processing** - The first request may take longer as the model loads

6. **View the before/after comparison** side by side

7. **Download the colorized image** using the download button

**Important Notes:**
- The backend must be running before making requests from the frontend
- First image processing may take 30-60 seconds (model loading + processing)
- Subsequent requests are faster (model stays in memory)
- GPU processing is significantly faster than CPU

## Project Structure

```
.
├── backend/
│   ├── app.py                    # Flask backend server with DeOldify integration
│   ├── requirements.txt           # Python dependencies
│   ├── DeOldify/                  # DeOldify library (cloned repository)
│   │   ├── models/                # Model files directory
│   │   │   └── ColorizeStable_gen.pth  # Pre-trained model (download separately)
│   │   ├── deoldify/              # DeOldify source code
│   │   └── requirements.txt       # DeOldify dependencies
│   ├── setup_deoldify.bat         # Windows setup script
│   └── setup_deoldify.sh          # Linux/Mac setup script
├── src/
│   ├── components/                # React components
│   │   ├── ImageUploader.jsx      # Image upload component
│   │   └── ImageComparison.jsx    # Before/after comparison component
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # React entry point
├── package.json                   # Node.js dependencies
├── vite.config.js                 # Vite configuration with API proxy
└── README.md                      # This file
```

## Design System

- **Colors**: Primary #6366F1 (indigo), Secondary #EC4899 (pink), Background #F8FAFC (light grey), Text #1E293B (slate), Accent #10B981 (emerald)
- **Fonts**: Inter/system fonts
- **Layout**: Card-based design with 16px spacing, responsive grid system

## Configuration Details

### Frontend Configuration (`vite.config.js`)

- **Port:** 3001 (changeable in `server.port`)
- **API Proxy:** All `/api/*` requests are automatically proxied to `http://127.0.0.1:5000`
- **Proxy Settings:**
  - `changeOrigin: true` - Changes the origin of the host header
  - `secure: false` - Allows proxying to HTTP (localhost)

### Backend Configuration (`backend/app.py`)

- **Port:** 5000 (hardcoded in `app.run()`)
- **CORS:** Enabled for all origins via `CORS(app)`
- **DeOldify Path:** Automatically set to `backend/DeOldify/`
- **Model Path:** Automatically configured to `backend/DeOldify/models/`
- **PyTorch Compatibility:** 
  - Monkey-patches `torch.load()` to use `weights_only=False`
  - Required for PyTorch 2.6+ compatibility
  - Applied before DeOldify imports

### Model Configuration

- **Model Type:** Stable (more realistic) or Artistic (more vibrant)
- **Model File Location:** `backend/DeOldify/models/ColorizeStable_gen.pth`
- **Model Size:** ~1.4 GB
- **Initialization:** Lazy-loaded on first request
- **Memory:** Model stays in memory after first load

## Troubleshooting

### DeOldify Installation Issues

If you encounter issues installing DeOldify:

1. **NumPy Compatibility**: DeOldify requires NumPy 1.x (not 2.x). If you get NumPy compatibility errors:
```bash
python -m pip install "numpy<2.0"
python -m pip install "opencv-python<4.9"
```

2. Make sure you have PyTorch installed with CUDA support (if using GPU):
```bash
python -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

3. Install fastai:
```bash
python -m pip install fastai
```

4. Follow the official DeOldify installation guide: https://github.com/jantic/DeOldify

### PyTorch 2.6+ Compatibility Issues

If you see errors about `weights_only` or `WeightsUnpickler`:

- **Solution:** The backend automatically patches `torch.load()` to use `weights_only=False`
- **Why:** PyTorch 2.6 changed the default to `weights_only=True` for security
- **Safety:** DeOldify checkpoints are from trusted sources, so this is safe
- **If issues persist:** Ensure the patch is applied before DeOldify imports (check backend logs)

### Model File Not Found

If you see `[Errno 2] No such file or directory: 'models\\ColorizeStable_gen.pth'`:

1. **Verify model file exists:**
   ```bash
   ls backend/DeOldify/models/ColorizeStable_gen.pth
   ```

2. **Check file name:** Must be exactly `ColorizeStable_gen.pth` (case-sensitive)

3. **Verify backend path:** Check backend logs for "DeOldify root folder set to: ..."

4. **Model location:** Should be in `backend/DeOldify/models/` directory

### Backend Connection Issues

- **Ensure the backend is running on port 5000**
- **Check that CORS is properly configured** (should see CORS enabled in logs)
- **Verify the proxy settings in `vite.config.js`** match your backend port
- **Restart Vite dev server** after changing `vite.config.js`
- **Check browser console** for CORS or network errors

### Frontend Not Connecting to Backend

- **Verify proxy configuration:** Check `vite.config.js` has correct target URL
- **Restart Vite dev server** after configuration changes
- **Check network tab:** Requests to `/api/*` should show status 200 (not 404)
- **Backend must be running** before frontend makes requests

### Performance Issues

- **First request slow:** Normal - model loads into memory (~30-60 seconds)
- **CPU processing:** Very slow (5-10 minutes per image), consider using GPU
- **GPU not detected:** Check CUDA installation and PyTorch CUDA support
- **Memory issues:** Ensure you have at least 4GB RAM free for model loading

## Development Notes

### Key Implementation Details

1. **API Proxy:** Vite dev server proxies `/api/*` requests to Flask backend, eliminating CORS issues during development
2. **Model Path Resolution:** Backend automatically configures DeOldify to find models in the correct directory
3. **PyTorch Compatibility:** Automatic patching ensures compatibility with PyTorch 2.6+
4. **Lazy Loading:** Model is loaded only when first request is made, not at server startup
5. **Error Handling:** Comprehensive error handling with user-friendly messages

### Port Configuration

- **Frontend:** Port 3001 (configurable in `vite.config.js`)
- **Backend:** Port 5000 (hardcoded in `backend/app.py`)
- **To change ports:**
  - Frontend: Edit `vite.config.js` → `server.port`
  - Backend: Edit `backend/app.py` → `app.run(port=YOUR_PORT)`
  - Update proxy target in `vite.config.js` if backend port changes

## License

This project uses DeOldify, which is licensed under the MIT License.
