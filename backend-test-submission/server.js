/**
 * URL Shortener Backend Server
 */

const express = require('express');
const cors = require('cors');
const { log } = require('../logging-middleware');

// Import routes
const shorturlRoutes = require('./routes/shorturl');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use(async (req, res, next) => {
  const start = Date.now();
  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  // Log the request
  try {
    log('backend', 'info', 'middleware', 
      `[${requestId}] Incoming request: ${req.method} ${req.originalUrl}`);
  } catch (err) {
    console.error('Error logging request:', err.message);
  }
  
  // This is for logging response time
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - start;
    
    // Log response
    try {
      log('backend', 'info', 'middleware', 
        `[${requestId}] Response: ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`)
        .catch(err => console.error('Error logging response:', err.message));
    } catch (err) {
      console.error('Error setting up response logging:', err.message);
    }
    
    return originalSend.call(this, body);
  };
  
  next();
});

// Routes
app.use('/shorturls', shorturlRoutes);

// Redirect route for shortened URLs
app.get('/:code', async (req, res) => {
  try {
    // Get controller
    const controller = require('./controllers/shorturlController');
    const result = await controller.getUrlByShortCode(req.params.code);
    
    if (result.success) {
      // Record click data
      let clickData = {
        timestamp: new Date().toISOString(),
        referrer: req.get('Referrer') || 'Direct',
        location: req.ip || 'Unknown',
        userAgent: req.get('User-Agent') || 'Unknown'
      };
      
      // Record the click
      // This could be done more efficiently but keeping it simple
      const recordResult = await controller.recordClick(req.params.code, clickData);
      
      // Redirect to original URL
      return res.redirect(result.url);
    } else {
      log('backend', 'warn', 'route', `Invalid or expired short URL: ${req.params.code}`);
      return res.status(404).json({ error: 'Short URL not found or expired' });
    }
  } catch (error) {
    log('backend', 'error', 'route', `Error redirecting: ${error.message}`);
    console.log("Error in redirect:", error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Handle 404
app.use((req, res) => {
  log('backend', 'warn', 'middleware', `404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

// Handle errors
app.use((err, req, res, next) => {
  log('backend', 'error', 'middleware', `Unhandled error: ${err.message}`);
  console.log("Server error:", err);
  res.status(500).json({ error: 'Server error' });
});

// Start the server
app.listen(PORT, () => {
  log('backend', 'info', 'config', `Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the API`);
  
  // TODO: Add database initialization
}); 