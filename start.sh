#!/bin/bash

# Set Gemini API Key (Use environment variables or a secure vault instead)
export GEMINI_API_KEY="your_api_key_here"

# Start Backend
cd /path/to/your/go-backend
osascript -e 'tell application "Terminal" to do script "cd /path/to/your/go-backend && go run cmd/main.go"'

# Wait a moment for backend to start
sleep 3

# Start Frontend
cd /path/to/your/frontend
osascript -e 'tell application "Terminal" to do script "cd /path/to/your/frontend && npm start"'
