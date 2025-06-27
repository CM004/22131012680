// This is my url shortener controller

const { nanoid } = require('nanoid');
const { log } = require('../../logging-middleware');
const db = require('../db/db');
const { isUrlExpired } = require('../utils/expiryUtils');
const { generateShortCode } = require('../utils/generateCode');

/**
 * Create a new short URL
 * @param {string} url - The original URL to shorten
 * @param {number} validity - Optional validity in minutes (default: 30)
 * @param {string} shortcode - Optional custom code for the short URL
 * @returns {Object} - Result object with short code and full short URL
 */
const createShortUrl = async (url, validity, shortcode) => {
  try {
    let code = shortcode || generateShortCode();
    
    if (db.urlExists(code)) {
      log('backend', 'warn', 'controller', `Custom shortcode already exists: ${code}`);
      return { error: 'Custom shortcode already in use' };
    }
    
    let validityMinutes = validity || 30;
    let now = new Date();
    let expiryDate = new Date(now.getTime() + validityMinutes * 60000).toISOString();
    
    let data = {
      originalUrl: url,
      code,
      createdAt: now.toISOString(),
      expiryDate,
      visits: 0,
      lastVisit: null,
      clicks: []
    };
    
    db.saveUrl(data);
    
    log('backend', 'info', 'controller', `Created short URL with code: ${code}`);
    console.log("Created URL:", code);
    
    return {
      shortLink: `http://localhost:5001/${code}`,
      expiry: expiryDate
    };
  } catch (error) {
    log('backend', 'error', 'controller', `Error creating short URL: ${error.message}`);
    console.log("Error:", error);
    throw error;
  }
};

/**
 * Get a URL by its short code
 * @param {string} code - The short code
 * @returns {Object} - Result object with the original URL
 */
const getUrlByShortCode = async (code) => {
  try {
    let urlData = db.getUrl(code);
    
    if (!urlData) {
      log('backend', 'warn', 'controller', `URL not found for code: ${code}`);
      return { success: false, error: 'URL not found' };
    }
    
    if (urlData.expiryDate && isUrlExpired(urlData.expiryDate)) {
      log('backend', 'info', 'controller', `URL expired for code: ${code}`);
      return { success: false, error: 'URL has expired' };
    }
    
    db.recordVisit(code);
    
    log('backend', 'info', 'controller', `Retrieved URL for code: ${code}`);
    
    return {
      success: true,
      url: urlData.originalUrl
    };
  } catch (error) {
    log('backend', 'error', 'controller', `Error retrieving URL: ${error.message}`);
    console.log("Error getting URL:", error);
    throw error;
  }
};

/**
 * Get all URLs in the database
 * @returns {Array} - List of all URL objects
 */
const getAllUrls = async () => {
  try {
    let urls = db.getAllUrls();
    log('backend', 'info', 'controller', `Retrieved ${urls.length} URLs`);
    
    let result = [];
    for (let i = 0; i < urls.length; i++) {
      result.push(urls[i]);
    }
    
    return result;
  } catch (error) {
    log('backend', 'error', 'controller', `Error retrieving all URLs: ${error.message}`);
    console.log("Error getting all URLs:", error);
    throw error;
  }
};

/**
 * Get statistics for a specific URL
 * @param {string} code - The short code
 * @returns {Object} - Statistics for the URL
 */
const getUrlStats = async (code) => {
  try {
    let urlData = db.getUrl(code);
    
    if (!urlData) {
      log('backend', 'warn', 'controller', `Stats not found for code: ${code}`);
      return null;
    }
    
    let isExpired = false;
    if (urlData.expiryDate) {
      isExpired = isUrlExpired(urlData.expiryDate);
    }
    
    log('backend', 'info', 'controller', `Retrieved stats for code: ${code}`);
    
    return {
      code,
      originalUrl: urlData.originalUrl,
      shortLink: `http://localhost:5001/${code}`,
      createdAt: urlData.createdAt,
      expiryDate: urlData.expiryDate,
      totalClicks: urlData.visits,
      lastVisit: urlData.lastVisit,
      isExpired,
      clicks: urlData.clicks || []
    };
  } catch (error) {
    log('backend', 'error', 'controller', `Error retrieving URL stats: ${error.message}`);
    console.log("Error getting stats:", error);
    throw error;
  }
};

/**
 * Record click data for a URL
 * @param {string} code - The short code
 * @param {Object} clickData - Data about the click
 * @returns {boolean} - True if successful
 */
const recordClick = async (code, clickData) => {
  try {
    let urlData = db.getUrl(code);
    
    if (!urlData) {
      log('backend', 'warn', 'controller', `URL not found for recording click: ${code}`);
      return false;
    }
    
    if (!urlData.clicks) {
      urlData.clicks = [];
    }
    
    let newClick = {
      timestamp: clickData.timestamp,
      referrer: clickData.referrer,
      location: clickData.location,
      userAgent: clickData.userAgent
    };
    
    urlData.clicks.push(newClick);
    
    db.saveUrl(urlData);
    
    log('backend', 'debug', 'controller', `Recorded click for URL with code: ${code}`);
    return true;
  } catch (error) {
    log('backend', 'error', 'controller', `Error recording click: ${error.message}`);
    console.log("Error recording click:", error);
    return false;
  }
};

/**
 * Delete a short URL
 * @param {string} code - The short code
 * @returns {Object} - Result object
 */
const deleteShortUrl = async (code) => {
  try {
    let success = db.deleteUrl(code);
    
    if (!success) {
      log('backend', 'warn', 'controller', `URL not found for deletion: ${code}`);
      return { success: false, error: 'URL not found' };
    }
    
    log('backend', 'info', 'controller', `Deleted URL with code: ${code}`);
    
    return {
      success: true,
      message: 'URL deleted successfully'
    };
  } catch (error) {
    log('backend', 'error', 'controller', `Error deleting URL: ${error.message}`);
    console.log("Error deleting URL:", error);
    throw error;
  }
};

module.exports = {
  createShortUrl,
  getUrlByShortCode,
  getAllUrls,
  getUrlStats,
  deleteShortUrl,
  recordClick
}; 