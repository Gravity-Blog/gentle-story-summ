#!/bin/bash

# Get the current script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Path to .env file
ENV_FILE="$SCRIPT_DIR/go-backend/.env"
ENV_EXAMPLE="$SCRIPT_DIR/go-backend/.env.example"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ ERROR: .env file not found!"
    echo ""
    echo "🔒 To secure your Gemini API key, please follow these steps:"
    echo "1. Copy the .env.example file to .env:"
    echo "   cp $ENV_EXAMPLE $ENV_FILE"
    echo ""
    echo "2. Open $ENV_FILE and replace 'your_gemini_api_key_here' with your actual Gemini API key"
    echo "   Example: GEMINI_API_KEY=your_actual_api_key"
    echo ""
    echo "3. Save the file and run this script again"
    exit 1
fi

# Load environment variables from .env file
export $(grep -v '^#' "$ENV_FILE" | xargs)

# Verify API Key is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ ERROR: GEMINI_API_KEY is not set in .env file"
    echo "Please add your Gemini API key to $ENV_FILE"
    exit 1
fi

# Start Backend
cd "$SCRIPT_DIR/go-backend"
osascript -e 'tell application "Terminal" to do script "cd '"$SCRIPT_DIR/go-backend"' && echo \"Starting backend with API key: ${GEMINI_API_KEY:0:5}...\" && GEMINI_API_KEY='"$GEMINI_API_KEY"' PORT=8081 go run cmd/main.go 2>&1 | tee backend.log"'

# Wait a moment for backend to start
sleep 3

# Start Frontend
cd "$SCRIPT_DIR/frontend"
osascript -e 'tell application "Terminal" to do script "cd '"$SCRIPT_DIR/frontend"' && npm start"'
