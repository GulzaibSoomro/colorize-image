#!/bin/bash

# Setup script for DeOldify installation

echo "Setting up DeOldify..."

# Check if DeOldify directory exists
if [ ! -d "DeOldify" ]; then
    echo "Cloning DeOldify repository (archived but still functional)..."
    git clone https://github.com/jantic/DeOldify.git DeOldify
    cd DeOldify
else
    echo "DeOldify directory already exists."
    echo "Note: Repository is archived (read-only), skipping git pull."
    cd DeOldify
fi

# Install requirements
echo "Installing DeOldify requirements..."
python -m pip install -r requirements.txt

# Download models (if not already present)
if [ ! -d "models" ]; then
    echo "Creating models directory..."
    mkdir models
    echo "Please download the models from: https://github.com/jantic/DeOldify/releases"
    echo "Place them in the DeOldify/models/ directory"
fi

cd ..
echo "DeOldify setup complete!"

