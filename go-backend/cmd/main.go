package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
	"github.com/rs/cors"
	"google.golang.org/api/option"
)

type SummarizationRequest struct {
	Text string `json:"text" binding:"required"`
}

type SummarizationResponse struct {
	Summary         string   `json:"summary"`
	EmotionalTone   string   `json:"emotionalTone"`
	TriggerWarnings []string `json:"triggerWarnings"`
}

func main() {
	// Initialize Gin router
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Recovery())

	// CORS configuration
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	})

	// Health check endpoint
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"message": "Gentle Story Summarizer is running!",
			"version": "1.0.0",
		})
	})

	// Summarization endpoint
	router.POST("/api/summarize", func(c *gin.Context) {
		var req SummarizationRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid request",
				"summary": "Could you share a bit more? I'm here to listen.",
			})
			return
		}

		summary, err := generateSummary(req.Text)
		if err != nil {
			log.Printf("Summarization error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Processing failed",
				"summary": "I'm having trouble processing your text right now. Could you try again?",
			})
			return
		}

		c.JSON(http.StatusOK, summary)
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Gentle Story Summarizer on port %s", port)
	handler := corsHandler.Handler(router)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), handler))
}

func generateSummary(text string) (*SummarizationResponse, error) {
	ctx := context.Background()

	// Get API key from environment
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY is not set")
	}

	// Create Gemini client
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("error creating Gemini client: %v", err)
	}
	defer client.Close()

	// Select model
	model := client.GenerativeModel("gemini-2.0-pro-exp-02-05")
	model.SetTemperature(0.7)

	// Compassionate summarization prompt
	prompt := fmt.Sprintf(`Provide a deeply compassionate and empathetic summary of the following text. 
	Your summary should:
	- Capture the core emotional essence of the text
	- Show understanding and support
	- Be gentle and non-judgmental
	- Identify potential emotional triggers

	Text: %s

	Please provide:
	1. A concise, empathetic summary
	2. The primary emotional tone
	3. Any potential trigger warnings`, text)

	// Generate content
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("error generating summary: %v", err)
	}

	// Extract summary text
	var summaryText string
	for _, part := range resp.Candidates[0].Content.Parts {
		summaryText += fmt.Sprintf("%v", part)
	}

	// Determine emotional tone and trigger warnings
	emotionalTone := detectEmotionalTone(summaryText)
	triggerWarnings := detectTriggerWarnings(text)

	return &SummarizationResponse{
		Summary:         strings.TrimSpace(summaryText),
		EmotionalTone:   emotionalTone,
		TriggerWarnings: triggerWarnings,
	}, nil
}

func detectEmotionalTone(text string) string {
	// Simple emotional tone detection
	lowercaseText := strings.ToLower(text)

	positiveKeywords := []string{"hope", "support", "care", "love", "understanding", "compassion"}
	negativeKeywords := []string{"pain", "struggle", "difficult", "sad", "hurt", "trauma"}

	positiveCount := countKeywords(lowercaseText, positiveKeywords)
	negativeCount := countKeywords(lowercaseText, negativeKeywords)

	if positiveCount > negativeCount {
		return "positive"
	} else if negativeCount > positiveCount {
		return "negative"
	}
	return "neutral"
}

func detectTriggerWarnings(text string) []string {
	// Basic trigger warning detection
	triggerTopics := map[string][]string{
		"mental_health": {"depression", "anxiety", "suicide", "trauma"},
		"violence":      {"abuse", "assault", "violence", "harm"},
		"grief":         {"loss", "death", "grief", "mourning"},
	}

	var warnings []string
	lowercaseText := strings.ToLower(text)

	for category, keywords := range triggerTopics {
		for _, keyword := range keywords {
			if strings.Contains(lowercaseText, keyword) {
				warnings = append(warnings, category)
				break
			}
		}
	}

	return warnings
}

func countKeywords(text string, keywords []string) int {
	count := 0
	for _, keyword := range keywords {
		if strings.Contains(text, keyword) {
			count++
		}
	}
	return count
}
