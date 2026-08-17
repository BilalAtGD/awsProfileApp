const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

/**
 * Enterprise Database Migration Runner
 *
 * Runs schema migration scripts in chronological order as `profileapp_migrator`.
 * Tracks executed migrations in a `schema_migrations` table to prevent re-execution.
 */
async function runMigrations() {
  // Use Migrator credentials (profileapp_migrator) for DDL schema changes
  const migratorUser = process.env.DB_MIGRATOR_USER || process.env.DB_USER || 'profileapp_migrator';
  const migratorPassword = process.env.DB_MIGRATOR_PASSWORD || process.env.DB_PASSWORD;

  console.log('🔄 Starting Database Schema Migrations...');
  console.log(`👤 Running as Migration User: ${migratorUser}`);
  console.log(`🌐 Target Host: ${process.env.DB_HOST}`);

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'profileapp',
    user: migratorUser,
    password: migratorPassword,
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  const client = await pool.connect();

  try {
    // 1. Ensure `schema_migrations` tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Get list of already executed migrations
    const { rows: executedRows } = await client.query('SELECT name FROM schema_migrations;');
    const executedMigrations = new Set(executedRows.map((r) => r.name));

    // 3. Read migration files from `backend/migrations/`
    const migrationsDir = path.join(__dirname, '../../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Ensures 001_, 002_, 003_ order

    let appliedCount = 0;

    for (const file of files) {
      if (!executedMigrations.has(file)) {
        console.log(`➡️  Applying migration: ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        // Execute migration inside a single atomic transaction
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1);', [file]);
        await client.query('COMMIT');

        console.log(`✅  Successfully applied migration: ${file}`);
        appliedCount++;
      } else {
        console.log(`⚡  Skipping already applied migration: ${file}`);
      }
    }

    if (appliedCount === 0) {
      console.log('✨  Database schema is up to date! No pending migrations.');
    } else {
      console.log(`🎉  All ${appliedCount} pending migration(s) executed successfully!`);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Execute if run directly via `node src/migrations/run-migrations.js`
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
