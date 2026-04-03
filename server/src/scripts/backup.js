/**
 * Database Backup Script
 * Exports all tables to a timestamped JSON file in server/backups/
 * Usage: npm run backup (from the server directory)
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const TABLES = ['users', 'recipes', 'favorites'];

async function backup() {
  const backupDir = path.join(__dirname, '../../backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(backupDir, `backup-${timestamp}.json`);

  console.log('Starting backup...');

  const data = {};

  for (const table of TABLES) {
    try {
      const result = await pool.query(`SELECT * FROM ${table}`);
      data[table] = result.rows;
      console.log(`  ✓ ${table}: ${result.rows.length} rows`);
    } catch (err) {
      console.error(`  ✗ ${table}: ${err.message}`);
      data[table] = [];
    }
  }

  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`\nBackup saved to: ${filename}`);

  await pool.end();
}

backup().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
