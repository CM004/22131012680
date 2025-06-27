/**
 * Routes for URL shortening operations
 */

const express = require('express');
const router = express.Router();
const { log } = require('../../logging-middleware');
const shorturlController = require('../controllers/shorturlController');

// Create a new short URL
router.post('/', async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;
    
    if (!url) {
      log('backend', 'warn', 'route', 'Missing URL in request');
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch (err) {
      log('backend', 'warn', 'route', `Invalid URL format: ${url}`);
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Validate validity if provided
    if (validity !== undefined && (!Number.isInteger(validity) || validity <= 0)) {
      log('backend', 'warn', 'route', `Invalid validity value: ${validity}`);
      return res.status(400).json({ error: 'Validity must be a positive integer' });
    }
    
    const result = await shorturlController.createShortUrl(url, validity, shortcode);
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    
    return res.status(201).json(result);
  } catch (error) {
    log('backend', 'error', 'route', `Error creating short URL: ${error.message}`);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get all URLs
router.get('/', async (req, res) => {
  try {
    const urls = await shorturlController.getAllUrls();
    return res.json(urls);
  } catch (error) {
    log('backend', 'error', 'route', `Error fetching all URLs: ${error.message}`);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get URL statistics
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const stats = await shorturlController.getUrlStats(code);
    
    if (!stats) {
      log('backend', 'warn', 'route', `Stats not found for code: ${code}`);
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    return res.json(stats);
  } catch (error) {
    log('backend', 'error', 'route', `Error fetching URL stats: ${error.message}`);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete a short URL
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const result = await shorturlController.deleteShortUrl(code);
    
    if (!result.success) {
      log('backend', 'warn', 'route', `Short URL not found for deletion: ${code}`);
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    return res.json(result);
  } catch (error) {
    log('backend', 'error', 'route', `Error deleting short URL: ${error.message}`);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 