const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT for a given payload (googleId, email)
 * @param {{ googleId: string, email: string }} payload
 * @returns {string} token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Verify a JWT and return the decoded payload
 * @param {string} token
 * @returns {{ googleId: string, email: string }}
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
