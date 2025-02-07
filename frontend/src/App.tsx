import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Alert, 
  CircularProgress,
  Fade,
  Grow,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import backgroundSvg from './background.svg';
import gravityLogo from './gravity-logo.png';

// Material-UI Icons
import QuoteIcon from '@mui/icons-material/FormatQuote';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import WarningIcon from '@mui/icons-material/Warning';

interface SummaryResponse {
  summary: string;
  emotionalTone: string;
  triggerWarnings?: string[];
}

// Text formatting utility
const formatText = (text: string) => {
  // Split the text into parts
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__)/g);
  
  return parts.map((part, index) => {
    // Check for bold with **
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Typography 
          key={index} 
          component="span" 
          sx={{ fontWeight: 'bold' }}
        >
          {part.slice(2, -2)}
        </Typography>
      );
    }
    
    // Check for italic with *
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <Typography 
          key={index} 
          component="span" 
          sx={{ fontStyle: 'italic' }}
        >
          {part.slice(1, -1)}
        </Typography>
      );
    }
    
    // Check for underline with __
    if (part.startsWith('__') && part.endsWith('__')) {
      return (
        <Typography 
          key={index} 
          component="span" 
          sx={{ textDecoration: 'underline' }}
        >
          {part.slice(2, -2)}
        </Typography>
      );
    }
    
    // Regular text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const EmpathyCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.9) 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[8],
  border: `2px solid ${theme.palette.primary.light}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[12],
  }
}));

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [animatedSummary, setAnimatedSummary] = useState<string>('');

  useEffect(() => {
    if (summary?.summary) {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < summary.summary.length) {
          setAnimatedSummary(prev => prev + summary.summary[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20);

      return () => clearInterval(typingInterval);
    }
  }, [summary]);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);
    setAnimatedSummary('');

    try {
      const response = await axios.post<SummaryResponse>('http://localhost:8081/api/summarize', { text });
      setSummary({
        ...response.data,
        triggerWarnings: response.data.triggerWarnings || [],
        summary: response.data.summary || 
          "I understand that you're reaching out, and I'm here to **listen without judgment**. " +
          "I know it can be *difficult to express your emotions*, but I want you to know that I'm __here for you__."
      });
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      role="main"
      maxWidth={false} 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: `url(${backgroundSvg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: 2
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            background: 'rgba(255,255,255,0.9)', 
            borderRadius: 3 
          }}
        >
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            mb={3}
          >
            <img 
              src={gravityLogo} 
              alt="Gravity Logo" 
              style={{ 
                maxWidth: 150, 
                marginBottom: 16,
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' 
              }} 
            />
            <Typography 
              variant="h4" 
              gutterBottom 
              align="center" 
              color="primary"
              sx={{ 
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)' 
              }}
            >
              Compassionate Story Companion
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            placeholder="Like a gentle conversation, share your story's landscape... I'm here to listen with compassion."
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ 
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.8)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }
            }}
          />

          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          <Box display="flex" justifyContent="center" mb={3}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSummarize}
              disabled={loading}
              startIcon={loading ? null : <SentimentSatisfiedAltIcon />}
              sx={{ 
                minWidth: 200, 
                padding: '10px 20px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 6
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Unveil Your Story'}
            </Button>
          </Box>

          {summary && (
            <Grow in={!!summary}>
              <EmpathyCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <QuoteIcon 
                      color="primary" 
                      sx={{ fontSize: 40, marginRight: 2 }} 
                    />
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      sx={{ fontWeight: 'bold' }}
                    >
                      Your Story's Essence
                    </Typography>
                  </Box>

                  <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                      fontStyle: 'italic',
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      padding: 2,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderRadius: 2
                    }}
                  >
                    {formatText(animatedSummary)}
                    {animatedSummary.length < (summary.summary.length || 0) && 
                      <CircularProgress size={16} sx={{ ml: 1 }} />}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <SentimentSatisfiedAltIcon 
                        color={
                          summary.emotionalTone === 'positive' ? 'success' : 
                          summary.emotionalTone === 'negative' ? 'error' : 'disabled'
                        } 
                        sx={{ marginRight: 1 }} 
                      />
                      <Typography variant="subtitle1">
                        Emotional Landscape: 
                        <Typography 
                          component="span" 
                          color={
                            summary.emotionalTone === 'positive' ? 'green' : 
                            summary.emotionalTone === 'negative' ? 'error.main' : 'text.secondary'
                          }
                          sx={{ ml: 1, fontWeight: 'bold' }}
                        >
                          {summary.emotionalTone || 'Neutral'}
                        </Typography>
                      </Typography>
                    </Box>

                    {summary.triggerWarnings && summary.triggerWarnings.length > 0 && (
                      <Box display="flex" alignItems="center">
                        <WarningIcon color="warning" sx={{ marginRight: 1 }} />
                        <Typography 
                          variant="subtitle1" 
                          color="warning.main" 
                          sx={{ fontWeight: 'bold' }}
                        >
                          Journey Cautions: {summary.triggerWarnings.join(', ')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </EmpathyCard>
            </Grow>
          )}
        </Paper>
      </Container>
    </Container>
  );
};

export default App;
