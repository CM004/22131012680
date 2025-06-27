/**
 * Simple in-memory database for URL storage
 */

const { log } = require('../../logging-middleware');

// In-memory storage for URLs
const urlsDb = new Map();

/**
 * Save a URL to the database
 * @param {Object} urlData - The URL data object
 */
const saveUrl = (urlData) => {
  try {
    urlsDb.set(urlData.code, urlData);
    log('backend', 'debug', 'db', `Saved URL with code: ${urlData.code}`);
    return true;
  } catch (error) {
    log('backend', 'error', 'db', `Error saving URL: ${error.message}`);
    return false;
  }
};

/**
 * Get a URL by its code
 * @param {string} code - The short code
 * @returns {Object|null} - The URL data or null if not found
 */
const getUrl = (code) => {
  try {
    const urlData = urlsDb.get(code);
    
    if (!urlData) {
      log('backend', 'debug', 'db', `URL not found for code: ${code}`);
      return null;
    }
    
    log('backend', 'debug', 'db', `Retrieved URL for code: ${code}`);
    return urlData;
  } catch (error) {
    log('backend', 'error', 'db', `Error retrieving URL: ${error.message}`);
    return null;
  }
};

/**
 * Check if a URL code exists
 * @param {string} code - The short code
 * @returns {boolean} - True if the code exists, false otherwise
 */
const urlExists = (code) => {
  try {
    return urlsDb.has(code);
  } catch (error) {
    log('backend', 'error', 'db', `Error checking URL existence: ${error.message}`);
    return false;
  }
};

/**
 * Get all URLs in the database
 * @returns {Array} - Array of URL objects
 */
const getAllUrls = () => {
  try {
    const urls = Array.from(urlsDb.values());
    log('backend', 'debug', 'db', `Retrieved ${urls.length} URLs`);
    return urls;
  } catch (error) {
    log('backend', 'error', 'db', `Error retrieving all URLs: ${error.message}`);
    return [];
  }
};

/**
 * Delete a URL by its code
 * @param {string} code - The short code
 * @returns {boolean} - True if deleted, false if not found
 */
const deleteUrl = (code) => {
  try {
    if (!urlsDb.has(code)) {
      log('backend', 'debug', 'db', `URL not found for deletion: ${code}`);
      return false;
    }
    
    urlsDb.delete(code);
    log('backend', 'debug', 'db', `Deleted URL with code: ${code}`);
    return true;
  } catch (error) {
    log('backend', 'error', 'db', `Error deleting URL: ${error.message}`);
    return false;
  }
};

/**
 * Record a visit to a URL
 * @param {string} code - The short code
 * @returns {boolean} - True if updated, false if not found
 */
const recordVisit = (code) => {
  try {
    const urlData = urlsDb.get(code);
    
    if (!urlData) {
      log('backend', 'warn', 'db', `URL not found for visit recording: ${code}`);
      return false;
    }
    
    // Update visit count and timestamp
    urlData.visits += 1;
    urlData.lastVisit = new Date().toISOString();
    
    // Save updated data
    urlsDb.set(code, urlData);
    
    log('backend', 'debug', 'db', `Recorded visit for URL with code: ${code}`);
    return true;
  } catch (error) {
    log('backend', 'error', 'db', `Error recording visit: ${error.message}`);
    return false;
  }
};

module.exports = {
  saveUrl,
  getUrl,
  urlExists,
  getAllUrls,
  deleteUrl,
  recordVisit
}; 