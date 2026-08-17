const { verifyToken } = require('../utils/jwt.utils');

/**
 * JWT Authentication Middleware
 * Reads token from HTTP-only Cookie (`req.cookies.token`) or Authorization header (`Bearer <token>`),
 * verifies it, and attaches req.user = { email }
 */
const authenticate = (req, res, next) => {
  try {
    let token = null;

    // 1. Try reading from cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // 2. Fall back to Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const decoded = verifyToken(token);
    req.user = { googleId: decoded.googleId, email: decoded.email };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }
};

module.exports = { authenticate };
