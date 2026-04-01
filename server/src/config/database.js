/**
 * Database Configuration
 * 
 * Creates a PostgreSQL connection pool that will be reused
 * throughout the application for database queries.
 */

const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
// A pool manages multiple database connections efficiently
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

module.exports = pool;
