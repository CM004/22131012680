import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardActions,
  Link,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { createShortUrl } from '../api/shorturl';
import { log } from '../logger';

const initialFormState = {
  url: '',
  validity: '',
  shortcode: ''
};

function ShortenerPage() {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    console.log("Component mounted");
    log('frontend', 'info', 'page', 'ShortenerPage component mounted');
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!formData.url) {
      showAlert('URL is required', 'warning');
      return false;
    }
    
    try {
      new URL(formData.url);
    } catch (err) {
      showAlert('Invalid URL format', 'warning');
      return false;
    }
    
    if (formData.validity) {
      let validityNum = Number(formData.validity);
      if (!Number.isInteger(validityNum) || validityNum <= 0) {
        showAlert('Validity must be a positive integer', 'warning');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      log('frontend', 'info', 'page', 'Submitting URL for shortening');
      console.log("Processing form:", formData);
      
      const result = await createShortUrl(
        formData.url,
        formData.validity || null,
        formData.shortcode || null
      );
      
      if (result.error) {
        showAlert(`Error: ${result.error}`, 'error');
        return;
      }
      
      const resultWithOriginal = {
        originalUrl: formData.url,
        ...result
      };
      
      setShortenedUrl(resultWithOriginal);
      log('frontend', 'info', 'page', `URL shortened successfully: ${result.shortLink}`);
      showAlert('URL shortened successfully!', 'success');
      
      // Reset form
      setFormData({ ...initialFormState });
      
    } catch (error) {
      console.log("Error shortening URL:", error);
      log('frontend', 'error', 'page', `Error shortening URL: ${error.message}`);
      showAlert(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    console.log("Copied URL:", url);
    log('frontend', 'info', 'page', `Copied URL to clipboard: ${url}`);
    showAlert('URL copied to clipboard!', 'success');
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Create a shortened URL. Validity is in minutes and defaults to 30 minutes if not specified.
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL to Shorten"
                variant="outlined"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                required
                placeholder="https://example.com/very-long-url"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                variant="outlined"
                type="number"
                value={formData.validity}
                onChange={(e) => handleInputChange('validity', e.target.value)}
                placeholder="30"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Custom Shortcode (Optional)"
                variant="outlined"
                value={formData.shortcode}
                onChange={(e) => handleInputChange('shortcode', e.target.value)}
                placeholder="my-custom-code"
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
            size="large"
            sx={{ mt: 3 }}
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </Button>
        </form>

        {shortenedUrl && (
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Your Shortened URL
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Original: {shortenedUrl.originalUrl.length > 50 
                    ? shortenedUrl.originalUrl.substring(0, 50) + '...' 
                    : shortenedUrl.originalUrl}
                </Typography>
                <Typography variant="h6" component="div">
                  <Link href={shortenedUrl.shortLink} target="_blank" rel="noopener noreferrer">
                    {shortenedUrl.shortLink}
                  </Link>
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Expires: {new Date(shortenedUrl.expiry).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<ContentCopyIcon />}
                  onClick={() => handleCopy(shortenedUrl.shortLink)}
                  size="small"
                >
                  Copy
                </Button>
              </CardActions>
            </Card>
          </Box>
        )}
      </Paper>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ShortenerPage; 