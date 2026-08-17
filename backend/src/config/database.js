const { Pool } = require('pg');
require('dotenv').config();

/**
 * PostgreSQL Connection Pool (AWS RDS)
 *
 * Configure the following in your .env:
 *   DB_HOST     — RDS endpoint hostname (from `aws rds describe-db-instances`)
 *   DB_PORT     — 5432 (default PostgreSQL port)
 *   DB_NAME     — database name (e.g. profileapp)
 *   DB_USER     — master username (e.g. profileadmin)
 *   DB_PASSWORD — master password
 *
 * AWS credentials are handled by the named profile (AWS_PROFILE env var).
 */
// ─── Validate required env vars before attempting connection ──
const REQUIRED = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  console.error('   Make sure your backend/.env file exists and contains all DB_* variables.');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // AWS RDS PostgreSQL requires SSL for connections over the internet.
  // rejectUnauthorized: false allows self-signed / RDS CA certificates.
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  max: 10,               // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});


/**
 * Test the DB connection on startup.
 * Exits the process if the connection cannot be established.
 */
const connectDB = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() AS now');
    client.release();
    console.log(`✅ AWS RDS PostgreSQL connected`);
    console.log(`📦 Database: ${process.env.DB_NAME} | Server time: ${res.rows[0].now}`);
  } catch (error) {
    console.error('❌ RDS PostgreSQL connection failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure RDS instance status is "available" in AWS Console or via Terraform');
    console.error('   2. Check that DB_HOST in backend/.env matches `db_host` output from `cd terraform && terraform output`');
    console.error('   3. Confirm Security Group allows inbound TCP on port 5432 from your IP');
    console.error('   4. Confirm DB_USER, DB_PASSWORD, and DB_NAME are correct in backend/.env\n');
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
