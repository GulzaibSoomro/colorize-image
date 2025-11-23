@echo off
REM Setup script for DeOldify installation on Windows

echo Setting up DeOldify...

REM Check if DeOldify directory exists
if not exist "DeOldify" (
    echo Cloning DeOldify repository (archived but still functional)...
    git clone https://github.com/jantic/DeOldify.git DeOldify
    cd DeOldify
) else (
    echo DeOldify directory already exists.
    echo Note: Repository is archived (read-only), skipping git pull.
    cd DeOldify
)

REM Install requirements
echo Installing DeOldify requirements...
python -m pip install -r requirements.txt

REM Download models (if not already present)
if not exist "models" (
    echo Creating models directory...
    mkdir models
    echo Please download the models from: https://github.com/jantic/DeOldify/releases
    echo Place them in the DeOldify/models/ directory
)

cd ..
echo DeOldify setup complete!

