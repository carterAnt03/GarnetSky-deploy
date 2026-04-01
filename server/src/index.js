/**
 * Express Application Entry Point
 *
 * Binds the configured Express app to a port.
 * (App configuration lives in src/app.js so it can be tested without listen()).
 */
const { createApp } = require('./app');

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

const app = createApp();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API server listening on http://localhost:${PORT}`);
});
