import os
import io
import sys
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

# Add DeOldify to Python path if it exists locally
# Get the directory where this script is located
backend_dir = os.path.dirname(os.path.abspath(__file__))
deoldify_path = os.path.join(backend_dir, 'DeOldify')
if os.path.exists(deoldify_path):
    sys.path.insert(0, deoldify_path)
    print(f"Added DeOldify to path: {deoldify_path}")
else:
    print(f"Warning: DeOldify path not found: {deoldify_path}")

# Try to import DeOldify
try:
    import torch
    import functools
    
    # Monkey-patch torch.load to use weights_only=False for DeOldify checkpoints
    # This is safe because DeOldify checkpoints are from a trusted source
    _original_torch_load = torch.load
    def _patched_torch_load(*args, **kwargs):
        # If weights_only is not explicitly set, default to False for DeOldify compatibility
        if 'weights_only' not in kwargs:
            kwargs['weights_only'] = False
        return _original_torch_load(*args, **kwargs)
    torch.load = _patched_torch_load
    print("Patched torch.load to use weights_only=False for DeOldify compatibility")
    
    from pathlib import Path
    from deoldify import device
    from deoldify.device_id import DeviceId
    from deoldify.visualize import get_image_colorizer
    DEOLDIFY_AVAILABLE = True
    
    # Configure device
    if torch.cuda.is_available():
        device.set(device=DeviceId.GPU0)
        print("Using GPU for processing")
    else:
        device.set(device=DeviceId.CPU)
        print("Using CPU for processing (slower)")
    
    # Set the root folder to DeOldify directory so it can find the models
    deoldify_root = Path(deoldify_path)
    print(f"DeOldify root folder set to: {deoldify_root}")
    
    # Initialize DeOldify colorizer
    colorizer = None
    
    def get_colorizer():
        global colorizer
        if colorizer is None:
            print("Initializing DeOldify colorizer...")
            # Pass root_folder so DeOldify can find models/models/ColorizeStable_gen.pth
            colorizer = get_image_colorizer(artistic=False, root_folder=deoldify_root)
            print("DeOldify colorizer ready!")
        return colorizer
        
except Exception as e:
    DEOLDIFY_AVAILABLE = False
    import traceback
    print(f"Warning: DeOldify not available: {e}")
    print(f"Error type: {type(e).__name__}")
    traceback.print_exc()
    print("Please install DeOldify following the instructions in README.md")

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/colorize', methods=['POST'])
def colorize_image():
    if not DEOLDIFY_AVAILABLE:
        return jsonify({
            'error': 'DeOldify is not installed. Please follow the installation instructions in README.md'
        }), 503
    
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read and validate image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Save to temporary file
        import tempfile
        import uuid
        temp_dir = tempfile.gettempdir()
        temp_filename = f'temp_input_{uuid.uuid4().hex}.jpg'
        temp_input_path = os.path.join(temp_dir, temp_filename)
        image.save(temp_input_path, 'JPEG')
        
        try:
            # Colorize image
            colorizer = get_colorizer()
            result = colorizer.get_transformed_image(
                path=temp_input_path,
                render_factor=35,
                watermarked=False
            )
            
            # Convert result to bytes
            output_buffer = io.BytesIO()
            result.save(output_buffer, format='JPEG', quality=95)
            output_buffer.seek(0)
            
            return send_file(
                output_buffer,
                mimetype='image/jpeg',
                as_attachment=False
            )
        finally:
            # Clean up temporary file
            if os.path.exists(temp_input_path):
                try:
                    os.remove(temp_input_path)
                except:
                    pass
        
    except Exception as e:
        
        import traceback
        print(f"Error processing image: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Failed to process image: {str(e)}'}), 500

if __name__ == '__main__':
    # Create uploads directory if it doesn't exist
    os.makedirs('uploads', exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)

