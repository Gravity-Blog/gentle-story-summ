# Gentle Story Summarizer - Go Backend

## Overview
A compassionate, high-performance text summarization service using Go and Google's Generative AI.

## Features
- High-performance Go backend
- AI-powered text summarization
- Emotional tone detection
- Trigger warning identification
- Secure and configurable

## Prerequisites
- Go 1.21+
- Google Generative AI API Key

## Setup
1. Clone the repository
2. Set your Gemini API key:
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```
3. Install dependencies:
   ```bash
   go mod tidy
   ```

## Running the Application
```bash
go run cmd/main.go
```

## Endpoints
- `GET /`: Health check
- `POST /api/summarize`: Summarize text with empathetic processing

### Summarization Request
```json
{
  "text": "Your text to be summarized"
}
```

### Summarization Response
```json
{
  "summary": "Compassionate summary of the text",
  "emotionalTone": "positive|negative|neutral",
  "triggerWarnings": ["mental_health", "violence", ...]
}
```

## Performance Characteristics
- Written in Go for high performance
- Low memory footprint
- Built-in concurrency
- Fast startup and request handling

## Security and Sensitivity
The application is designed to handle text with emotional intelligence and care.

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
