# URL Shortener Project

A full-stack URL shortener application with a logging middleware that makes API calls to the Test Server.

## Project Structure

The project consists of three main components:

- `logging-middleware/`: Reusable logging module (shared across backend & frontend)
- `backend-test-submission/`: Node.js (Express) app for URL shortening
- `frontend-test-submission/`: React app for UI with Material UI

## Screenshot
<img width="1470" alt="Screenshot 2025-06-27 at 4 43 03 PM" src="https://github.com/user-attachments/assets/ba9e4f47-fb39-43d7-88c1-b8a24c165227" />


## Architecture
### Logging Middleware

The logging middleware provides a reusable `log()` function that makes API calls to the Test Server's logging endpoint. It validates the input parameters and ensures they adhere to the constraints specified in the requirements.

### Backend

The backend is built with Express.js and uses an in-memory database to store URL data. It provides RESTful APIs for creating, retrieving, and deleting shortened URLs.

- **Controller**: Handles business logic for URL operations
- **Routes**: Defines API endpoints for URL operations
- **Utils**: Utility functions for generating short codes and handling expiry dates
- **DB**: In-memory database implementation for storing URL data

### Frontend

The frontend is built with React and Material UI, providing a responsive user interface for URL shortening and statistics.

- **Pages**: Main pages for shortening URLs and viewing statistics
- **Components**: Reusable UI components
- **API**: Services for making API calls to the backend
- **Logger**: Implementation of the logging middleware for frontend

## Setup Instructions

### Logging Middleware

```bash
cd logging-middleware
npm install
```

### Backend

```bash
cd backend-test-submission
npm install
npm start
```

The backend server will run on http://localhost:5000.

### Frontend

```bash
cd frontend-test-submission
npm install
npm start
```

The frontend development server will run on http://localhost:3000.

## Features

- Create shortened URLs with optional custom codes
- Set expiry dates for shortened URLs
- Track URL visit statistics
- Copy shortened URLs to clipboard
- View detailed statistics for each URL
- Responsive design for both desktop and mobile devices

## API Endpoints

### Create a Short URL
```
POST /api/shorturl
```

### Get All URLs
```
GET /api/shorturl
```

### Get URL Statistics
```
GET /api/shorturl/:code/stats
```

### Delete a Short URL
```
DELETE /api/shorturl/:code
```

### Redirect to Original URL
```
GET /:code
``` # 22131012680
