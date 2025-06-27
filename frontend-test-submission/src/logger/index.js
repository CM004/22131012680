/**
 * Frontend logger using the shared logging middleware functionality
 */

import axios from 'axios';

// Authentication credentials
const AUTH_INFO = {
  email: "chandramohan.22scse1012898@galgotiasuniversity.edu.in",
  name: "chandramohan",
  rollNo: "22131012680",
  accessCode: "Muagvq",
  clientID: "cd720df3-b79b-489f-afb6-03bdc9f72996",
  clientSecret: "reJXhVsquJGrfTBq"
};

// Get a fresh authentication token
const getAuthToken = async () => {
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', AUTH_INFO);
    return response.data.access_token;
  } catch (error) {
    console.error('Authentication error:', error.message);
    return null;
  }
};

// Generate a unique request ID
const generateRequestId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate input parameters
const validateParams = (stack, level, pkg, message) => {
  const validStacks = ['backend', 'frontend'];
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const validBackendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
  const validFrontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'];
  const validCommonPackages = ['auth', 'config', 'middleware', 'utils'];
  
  // All valid packages combined
  const validPackages = [...validBackendPackages, ...validFrontendPackages, ...validCommonPackages];
  
  if (!validStacks.includes(stack)) {
    throw new Error(`Invalid stack: ${stack}. Must be one of: ${validStacks.join(', ')}`);
  }
  
  if (!validLevels.includes(level)) {
    throw new Error(`Invalid level: ${level}. Must be one of: ${validLevels.join(', ')}`);
  }
  
  if (!validPackages.includes(pkg)) {
    throw new Error(`Invalid package: ${pkg}. Must be one of: ${validPackages.join(', ')}`);
  }
  
  if (!message || typeof message !== 'string') {
    throw new Error('Message is required and must be a string');
  }
  
  // Additional validation for stack-package combinations
  if (stack === 'backend' && validFrontendPackages.includes(pkg) && !validCommonPackages.includes(pkg)) {
    throw new Error(`Package '${pkg}' cannot be used with stack 'backend'`);
  }
  
  if (stack === 'frontend' && validBackendPackages.includes(pkg) && !validCommonPackages.includes(pkg)) {
    throw new Error(`Package '${pkg}' cannot be used with stack 'frontend'`);
  }
};

/**
 * Log function that makes API calls to the Test Server
 * @param {string} stack - 'backend' or 'frontend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', or 'fatal'
 * @param {string} pkg - The package name (see constraints in documentation)
 * @param {string} message - The log message
 * @returns {Promise<Object>} - The response from the logging API
 */
export const log = async (stack, level, pkg, message) => {
  try {
    // Validate parameters
    validateParams(stack, level, pkg, message);
    
    // Generate a request ID to correlate logs
    const requestId = generateRequestId();
    
    // Add request ID to message if not already a complex message
    const enhancedMessage = !message.includes('[') 
      ? `[${requestId}] ${message}` 
      : message;
    
    // Get a fresh token for each request
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Failed to obtain authentication token');
    }
    
    // Prepare headers with Authorization
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    // Make API call to the Test Server
    const response = await axios.post('http://20.244.56.144/evaluation-service/logs', {
      stack,
      level,
      package: pkg,
      message: enhancedMessage
    }, { headers });
    
    return response.data;
  } catch (error) {
    // Handle errors but don't throw - logging should not break application flow
    console.error('Logging error:', error.message);
    return {
      error: true,
      message: error.message
    };
  }
}; 