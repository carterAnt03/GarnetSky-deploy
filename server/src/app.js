/**
 * Express Application Factory
 *
 * Exporting the configured app makes it easy to unit/behavior-test routes
 * without binding to a network port.
 */
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

function createApp() {
  const app = express();

  // Log every incoming request before any middleware
  app.use((req, res, next) => {
    console.log(`INCOMING: ${req.method} ${req.path} origin=${req.headers.origin}`);
    next();
  });

  // Basic security & parsing middleware
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());

  // CORS so the Vite React frontend can call the API and send cookies
  // Allow one or many origins:
  // - FRONTEND_URLS="http://localhost:5173,https://your-frontend.com"
  // - or FRONTEND_URL="http://localhost:5173"
  const raw =
    process.env.FRONTEND_URLS ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  const allowedOrigins = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, cb) {
        // allow same-origin / server-to-server / curl (no Origin header)
        if (!origin) return cb(null, true);

        if (allowedOrigins.includes(origin)) return cb(null, true);

        // Allow all Vercel preview deployments
        if (/https:\/\/garnet-sky-deploy.*\.vercel\.app$/.test(origin)) return cb(null, true);

        return cb(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    })
  );

  app.get("/", (req, res) => {
    res.json({ message: "GarnetSky API - see /api/v1/health" });
  });

  // Health check
  app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Alias for older clients / frontend test buttons
  app.get('/api/v1/status', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Add this so the frontend's GET /api/v1/status works
  app.get("/api/v1/status", (req, res) => {
    res.json({ status: "ok" });
  });

  // Request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} | origin: ${req.headers.origin} | body: ${JSON.stringify(req.body)}`);
    next();
  });

  // Routes
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/recipes", recipeRoutes);

  // Generic error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: {
        code: "SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    });
  });

  return app;
}

module.exports = { createApp };
