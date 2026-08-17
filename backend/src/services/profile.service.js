const userRepository = require('../repositories/user.repository');

/**
 * Get a user's profile by googleId.
 * The repository returns a plain JS object — no .toJSON() needed.
 *
 * @param {string} googleId
 * @returns {Promise<object>} user
 */
const getProfile = async (googleId) => {
  const user = await userRepository.findByGoogleId(googleId);
  if (!user) {
    const error = new Error('Profile not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Update allowed profile fields (not email).
 * @param {string} googleId
 * @param {{ name?, phone?, gender?, age?, profilePicKey? }} updates
 * @returns {Promise<object>} updated user
 */
const updateProfile = async (googleId, updates) => {
  // Whitelist — cannot change email here
  const allowed = ['name', 'phone', 'gender', 'age', 'profilePicKey'];
  const filteredUpdates = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }

  const updated = await userRepository.updateUserByGoogleId(googleId, filteredUpdates);
  if (!updated) {
    const error = new Error('Profile not found');
    error.statusCode = 404;
    throw error;
  }
  return updated;
};

module.exports = { getProfile, updateProfile };
