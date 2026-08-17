const { pool } = require('../config/database');

/**
 * Helper — maps a snake_case PostgreSQL row to the camelCase
 * shape that services / controllers expect (matching the old Mongoose toJSON).
 *
 * @param {object|null} row
 * @returns {object|null}
 */
const toUser = (row) => {
  if (!row) return null;
  return {
    email: row.email,
    name: row.name,
    googleId: row.google_id,
    picture: row.picture ?? null,
    phone: row.phone ?? null,
    gender: row.gender ?? null,
    age: row.age ?? null,
    profilePicKey: row.profile_pic_key ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Find a user by googleId.
 * @param {string} googleId
 * @returns {Promise<object|null>}
 */
const findByGoogleId = async (googleId) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE google_id = $1 LIMIT 1',
    [googleId]
  );
  return toUser(rows[0] ?? null);
};

/**
 * Create a new user record.
 * @param {{ email: string, name: string, googleId: string, picture?: string }} data
 * @returns {Promise<object>}
 */
const createUser = async (data) => {
  const { email, name, googleId, picture } = data;
  const { rows } = await pool.query(
    `INSERT INTO users (email, name, google_id, picture)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email.toLowerCase(), name, googleId, picture ?? null]
  );
  return toUser(rows[0]);
};

/**
 * Update allowed profile fields by googleId.
 * @param {string} googleId
 * @param {{ name?, phone?, gender?, age?, profilePicKey?, picture? }} updates
 * @returns {Promise<object|null>}
 */
const updateUserByGoogleId = async (googleId, updates) => {
  // Map camelCase update keys to their DB column names
  const columnMap = {
    name: 'name',
    phone: 'phone',
    gender: 'gender',
    age: 'age',
    profilePicKey: 'profile_pic_key',
    picture: 'picture',
  };

  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  for (const [key, column] of Object.entries(columnMap)) {
    if (updates[key] !== undefined) {
      setClauses.push(`${column} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) {
    // Nothing to update — return the current user
    return findByGoogleId(googleId);
  }

  values.push(googleId); // last param: the WHERE clause
  const { rows } = await pool.query(
    `UPDATE users
     SET ${setClauses.join(', ')}
     WHERE google_id = $${paramIndex}
     RETURNING *`,
    values
  );
  return toUser(rows[0] ?? null);
};

module.exports = { findByGoogleId, createUser, updateUserByGoogleId };
