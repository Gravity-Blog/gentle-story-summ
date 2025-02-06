#!/bin/bash

# Set Gemini API Key
export GEMINI_API_KEY=AIzaSyAVh_mT18e9zri2VhJXPR9MX6vZnfA4tcU

# Start Backend
cd /Users/niladridas/Documents/plot/summarize-app/go-backend
osascript -e 'tell application "Terminal" to do script "cd /Users/niladridas/Documents/plot/summarize-app/go-backend && go run cmd/main.go"'

# Wait a moment for backend to start
sleep 3

# Start Frontend
cd /Users/niladridas/Documents/plot/summarize-app/frontend
osascript -e 'tell application "Terminal" to do script "cd /Users/niladridas/Documents/plot/summarize-app/frontend && npm start"'
