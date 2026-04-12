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
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

function createApp() {
  const app = express();

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


  // Serve uploaded images
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  // Routes
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/recipes", recipeRoutes);
  app.use("/api/v1/favorites", favoritesRoutes);
  app.use("/api/v1/admin", adminRoutes);
  app.use("/api/v1/upload", uploadRoutes);

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
