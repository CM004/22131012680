/**
 * API service for URL shortening operations
 */

import axios from 'axios';
import { log } from '../logger';

const API_BASE_URL = 'http://localhost:5001/shorturls';

/**
 * Create a new short URL
 * @param {string} url - The original URL to shorten
 * @param {number} validity - Optional validity in minutes
 * @param {string} shortcode - Optional custom shortcode
 * @returns {Promise<Object>} - API response
 */
export const createShortUrl = async (url, validity = null, shortcode = null) => {
  try {
    log('frontend', 'info', 'api', `Creating short URL for: ${url}`);
    console.log("Creating URL:", url, validity, shortcode);
    
    let body = {
      url: url,
    };
    
    if (validity) {
      body.validity = parseInt(validity);
    }
    
    if (shortcode) {
      body.shortcode = shortcode;
    }
    
    const response = await axios.post(API_BASE_URL, body);
    
    log('frontend', 'debug', 'api', `Short URL created: ${response.data.shortLink}`);
    console.log("API response:", response.data);
    
    return response.data;
  } catch (error) {
    log('frontend', 'error', 'api', `Error creating short URL: ${error.message}`);
    console.log("API error:", error);
    
    throw error;
  }
};

/**
 * Get all URLs
 * @returns {Promise<Array>} - List of all URLs
 */
export const getAllUrls = async () => {
  try {
    log('frontend', 'info', 'api', 'Fetching all URLs');
    
    const response = await axios.get(API_BASE_URL);
    
    log('frontend', 'debug', 'api', `Retrieved ${response.data.length} URLs`);
    
    return response.data;
  } catch (error) {
    log('frontend', 'error', 'api', `Error fetching URLs: ${error.message}`);
    
    throw error;
  }
};

/**
 * Get statistics for a specific URL
 * @param {string} code - The short code
 * @returns {Promise<Object>} - URL statistics
 */
export const getUrlStats = async (code) => {
  try {
    log('frontend', 'info', 'api', `Fetching stats for code: ${code}`);
    
    let url = API_BASE_URL + '/' + code;
    
    const response = await axios.get(url);
    
    log('frontend', 'debug', 'api', `Retrieved stats for code: ${code}`);
    
    return response.data;
  } catch (error) {
    log('frontend', 'error', 'api', `Error fetching URL stats: ${error.message}`);
    console.log("Error getting stats:", error);
    
    throw error;
  }
};

/**
 * Delete a short URL
 * @param {string} code - The short code
 * @returns {Promise<Object>} - API response
 */
export const deleteShortUrl = async (code) => {
  try {
    log('frontend', 'info', 'api', `Deleting URL with code: ${code}`);
    
    let url = `${API_BASE_URL}/${code}`;
    
    const response = await axios.delete(url);
    
    log('frontend', 'debug', 'api', `Deleted URL with code: ${code}`);
    
    return response.data;
  } catch (error) {
    log('frontend', 'error', 'api', `Error deleting URL: ${error.message}`);
    
    throw error;
  }
}; 