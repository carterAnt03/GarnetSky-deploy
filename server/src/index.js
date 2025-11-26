/**
 * Express Application Entry Point
 *
 * Sets up the REST API under /api/v1 with auth and user routes.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { signup, login, logout, getCurrentUser } = require('./controllers/authController');
const { validate } = require('./utils/validation');
const { signupSchema, loginSchema } = require('./utils/validation');
const { requireAuth } = require('./middleware/auth');

const app = express();

// Basic security & parsing middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS so the Vite React frontend can call the API and send cookies
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes
app.post('/api/v1/auth/signup', validate(signupSchema), signup);
app.post('/api/v1/auth/login', validate(loginSchema), login);
app.post('/api/v1/auth/logout', logout);

// Current user route
app.get('/api/v1/users/me', requireAuth, getCurrentUser);

// Generic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API server listening on http://localhost:${PORT}`);
});