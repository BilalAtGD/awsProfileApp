const authService = require('../services/auth.service');
const userRepository = require('../repositories/user.repository');

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

/**
 * POST /api/auth/google
 */
const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const { user, token } = await authService.googleSignIn(credential);

    res.cookie('token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Sign-in with Google successful',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const cookieOptions = getCookieOptions();
    delete cookieOptions.maxAge;

    res.clearCookie('token', cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * The repository returns a plain JS object — no .toJSON() needed.
 */
const getMe = async (req, res, next) => {
  try {
    const user = await userRepository.findByGoogleId(req.user.googleId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { googleAuth, logout, getMe };
