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

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

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
app.get('/', (req, res) => {
  res.json({ message: 'GarnetSky API - see /api/v1/health' });
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes
app.use('/api/v1/auth', authRoutes);

// Recipe routes
app.use('/api/v1/recipes', recipeRoutes);

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