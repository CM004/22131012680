/**
 * Utility for handling URL expiry dates
 */

const { log } = require('../../logging-middleware');

/**
 * Check if a URL has expired
 * @param {string} expiryDate - ISO date string for expiry
 * @returns {boolean} - True if the URL has expired, false otherwise
 */
const isUrlExpired = (expiryDate) => {
  try {
    if (!expiryDate) {
      return false;
    }
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    
    const isExpired = now > expiry;
    
    if (isExpired) {
      log('backend', 'debug', 'utils', `URL with expiry ${expiryDate} has expired`);
    }
    
    return isExpired;
  } catch (error) {
    log('backend', 'error', 'utils', `Error checking URL expiry: ${error.message}`);
    return false;
  }
};

/**
 * Calculate default expiry date (7 days from now)
 * @returns {string} - ISO date string for expiry
 */
const getDefaultExpiryDate = () => {
  try {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString();
  } catch (error) {
    log('backend', 'error', 'utils', `Error generating default expiry date: ${error.message}`);
    return null;
  }
};

module.exports = {
  isUrlExpired,
  getDefaultExpiryDate
}; 