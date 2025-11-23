# Quick Start Guide

Get up and running with the DeOldify Image Colorizer in minutes!

## Prerequisites Check

- ✅ Node.js installed (check with `node --version`)
- ✅ Python 3.8+ installed (check with `python --version`)
- ✅ pip installed (check with `python -m pip --version`)

## Step 1: Install Frontend Dependencies

```bash
npm install
```

## Step 2: Install Backend Dependencies

```bash
cd backend
python -m pip install -r requirements.txt
cd ..
```

## Step 3: Install DeOldify

**Windows:**
```bash
backend\setup_deoldify.bat
```

**Linux/Mac:**
```bash
bash backend/setup_deoldify.sh
```

## Step 4: Download DeOldify Models

**Important:** Models are available via direct download links (not from GitHub releases).

1. Download one of these model files (~1.4 GB each):
   - **Stable Model** (recommended): [ColorizeStable_gen.pth](https://www.dropbox.com/s/axsd2g85uyixaho/ColorizeStable_gen.pth?dl=0)
   - **Artistic Model**: [ColorizeArtistic_gen.pth](https://data.deepai.org/deoldify/ColorizeArtistic_gen.pth)

2. Place the downloaded `.pth` file in: `backend/DeOldify/models/`

**Note:** You only need one model file. The Stable version is recommended for most use cases.

## Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
# Windows
start-backend.bat

# Linux/Mac
bash start-backend.sh

# Or manually:
python backend/app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Step 6: Use the Application

1. Open your browser to `http://localhost:3000`
2. Drag and drop a black & white image or click to browse
3. Wait for processing (may take 30-60 seconds)
4. View the before/after comparison
5. Download your colorized image!

## Troubleshooting

**Backend won't start:**
- Make sure DeOldify is installed in `backend/DeOldify/`
- Check that models are in `backend/DeOldify/models/`
- Verify Python dependencies: `python -m pip install -r backend/requirements.txt`

**Frontend can't connect:**
- Ensure backend is running on port 5000
- Check browser console for errors

**Processing fails:**
- Verify DeOldify models are downloaded
- Check backend console for error messages
- Ensure image is a valid format (JPG, PNG, WEBP)
- If you see NumPy compatibility errors, run: `python -m pip install "numpy<2.0" "opencv-python<4.9"`

## Need Help?

See the full [README.md](README.md) for detailed documentation.

