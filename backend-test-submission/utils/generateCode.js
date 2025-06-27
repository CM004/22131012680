/**
 * Utility for generating short codes
 */

const { nanoid } = require('nanoid');
const { log } = require('../../logging-middleware');

/**
 * Generate a short code for URLs
 * @param {number} length - Length of the short code (default: 6)
 * @returns {string} - The generated short code
 */
const generateShortCode = (length = 6) => {
  try {
    const code = nanoid(length);
    log('backend', 'debug', 'utils', `Generated short code: ${code}`);
    return code;
  } catch (error) {
    log('backend', 'error', 'utils', `Error generating short code: ${error.message}`);
    // Fallback to a simple random string if nanoid fails
    return Math.random().toString(36).substring(2, 2 + length);
  }
};

module.exports = {
  generateShortCode
}; 