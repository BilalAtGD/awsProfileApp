const profileService = require('../services/profile.service');

/**
 * GET /api/profile
 * Returns the authenticated user's own profile
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.googleId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/profile
 * Updates the authenticated user's profile (not email/password)
 */
const updateProfile = async (req, res, next) => {
  try {
    const updated = await profileService.updateProfile(req.user.googleId, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
