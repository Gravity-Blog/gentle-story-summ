# Gentle Story Summarizer

## Overview
Gentle Story Summarizer is an empathetic AI-powered application that provides compassionate summaries of user-submitted text.

## Prerequisites
- Go (1.16+)
- Node.js (14+)
- npm
- Gemini API Key from Google AI Studio

## Setup

### 1. Obtain Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key

### 2. Configure Environment
1. Navigate to `go-backend` directory
2. Copy `.env.example` to `.env`
3. Replace `your_gemini_api_key_here` with your actual Gemini API key

### 3. Install Dependencies
```bash
# Install Go dependencies
cd go-backend
go get github.com/joho/godotenv

# Install Frontend dependencies
cd ../frontend
npm install
```

## Running the Application
Use the provided start script:
```bash
./start.sh
```

This will:
- Start the Go backend on port 8081
- Launch the React frontend
- Open the application in your default browser

## Stopping the Application

### Method 1: Terminal Keyboard Shortcut
In each terminal running the application:
- Press `Ctrl + C`

### Method 2: Terminal Commands
```bash
# Stop Go Backend
pkill -f "go run cmd/main.go"

# Stop React Frontend
pkill -f "npm start"
```

### Method 3: Activity Monitor
1. Open Activity Monitor:
   - Spotlight Search: `Cmd + Space`, type "Activity Monitor"
   - Finder: Applications > Utilities > Activity Monitor
   - Terminal Method:
     ```bash
     open -a "Activity Monitor"
     ```
2. Find and quit:
   - Go processes
   - Node/npm processes

## Troubleshooting
- Ensure all dependencies are installed
- Verify Gemini API key is valid
- Check console for specific error messages

## Security Notes
- Never commit `.env` file to version control
- Rotate your Gemini API key periodically

## Contributing
Please read our contribution guidelines before submitting pull requests.

## License
[Your License Here]

## Related Links
- [Gemini App Experimental Models Blog Post](https://blog.google/feed/gemini-app-experimental-models/)

![App Screenshot](https://github.com/Gravity-Blog/gentle-story-summ/blob/main/frontend/public/Screenshot.png)
