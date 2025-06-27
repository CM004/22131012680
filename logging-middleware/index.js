/**
 * Logging middleware for backend and frontend applications
 * Makes API calls to the Test Server for logging
 */

const axios = require('axios');

// Authentication credentials
const AUTH_INFO = {
  email: "chandramohan.22scse1012898@galgotiasuniversity.edu.in",
  name: "chandramohan",
  rollNo: "22131012680",
  accessCode: "Muagvq",
  clientID: "cd720df3-b79b-489f-afb6-03bdc9f72996",
  clientSecret: "reJXhVsquJGrfTBq"
};

// Authentication token
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaGFuZHJhbW9oYW4uMjJzY3NlMTAxMjg5OEBnYWxnb3RpYXN1bml2ZXJzaXR5LmVkdS5pbiIsImV4cCI6MTc1MTAxNzA2NCwiaWF0IjoxNzUxMDE2MTY0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMTQ4ZjJlOTAtZmM4OS00YWMwLTk5NWQtMWU3YWJhZTYwMjcyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiY2hhbmRyYW1vaGFuIiwic3ViIjoiY2Q3MjBkZjMtYjc5Yi00ODlmLWFmYjYtMDNiZGM5ZjcyOTk2In0sImVtYWlsIjoiY2hhbmRyYW1vaGFuLjIyc2NzZTEwMTI4OThAZ2FsZ290aWFzdW5pdmVyc2l0eS5lZHUuaW4iLCJuYW1lIjoiY2hhbmRyYW1vaGFuIiwicm9sbE5vIjoiMjIxMzEwMTI2ODAiLCJhY2Nlc3NDb2RlIjoiTXVhZ3ZxIiwiY2xpZW50SUQiOiJjZDcyMGRmMy1iNzliLTQ4OWYtYWZiNi0wM2JkYzlmNzI5OTYiLCJjbGllbnRTZWNyZXQiOiJyZUpYaFZzcXVKR3JmVEJxIn0.exA2IAxFR0vzZou6fO0ZpWfJ6l8btja0JMhuOZLNldI";

// Get a fresh authentication token if needed
const getAuthToken = async () => {
  try {
    let response = await axios.post('http://20.244.56.144/evaluation-service/auth', AUTH_INFO);
    return response.data.access_token;
  } catch (error) {
    console.error('Authentication error:', error.message);
    return null;
  }
};

// Validate input parameters
function validateParams(stack, level, pkg, message) {
  // Valid values
  const validStacks = ['backend', 'frontend'];
  const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const validBackendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
  const validFrontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'];
  const validCommonPackages = ['auth', 'config', 'middleware', 'utils'];
  
  // Combine packages
  let validPackages = [];
  for (let i = 0; i < validBackendPackages.length; i++) {
    validPackages.push(validBackendPackages[i]);
  }
  for (let i = 0; i < validFrontendPackages.length; i++) {
    validPackages.push(validFrontendPackages[i]);
  }
  for (let i = 0; i < validCommonPackages.length; i++) {
    validPackages.push(validCommonPackages[i]);
  }
  
  // Check stack
  if (validStacks.indexOf(stack) === -1) {
    throw new Error(`Invalid stack: ${stack}. Must be one of: ${validStacks.join(', ')}`);
  }
  
  // Check level
  if (validLevels.indexOf(level) === -1) {
    throw new Error(`Invalid level: ${level}. Must be one of: ${validLevels.join(', ')}`);
  }
  
  // Check package
  if (validPackages.indexOf(pkg) === -1) {
    throw new Error(`Invalid package: ${pkg}. Must be one of: ${validPackages.join(', ')}`);
  }
  
  // Check message
  if (!message || typeof message !== 'string') {
    throw new Error('Message is required and must be a string');
  }
  
  // Check stack-package combinations
  let isBackendPkg = validBackendPackages.indexOf(pkg) !== -1;
  let isFrontendPkg = validFrontendPackages.indexOf(pkg) !== -1;
  let isCommonPkg = validCommonPackages.indexOf(pkg) !== -1;
  
  if (stack === 'backend' && isFrontendPkg && !isCommonPkg) {
    throw new Error(`Package '${pkg}' cannot be used with stack 'backend'`);
  }
  
  if (stack === 'frontend' && isBackendPkg && !isCommonPkg) {
    throw new Error(`Package '${pkg}' cannot be used with stack 'frontend'`);
  }
}

/**
 * Log function that makes API calls to the Test Server
 * @param {string} stack - 'backend' or 'frontend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', or 'fatal'
 * @param {string} pkg - The package name (see constraints in documentation)
 * @param {string} message - The log message
 * @returns {Promise<Object>} - The response from the logging API
 */
const log = async (stack, level, pkg, message) => {
  try {
    // Validate parameters
    validateParams(stack, level, pkg, message);
    
    // Get a fresh token for each request
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Failed to get auth token');
    }
    
    // Prepare headers with Authorization
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    // Prepare data for API call
    let data = {
      stack: stack,
      level: level,
      package: pkg,
      message: message
    };
    
    // Make API call to the Test Server
    let response = await axios.post('http://20.244.56.144/evaluation-service/logs', data, { headers });
    
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

module.exports = { log }; 