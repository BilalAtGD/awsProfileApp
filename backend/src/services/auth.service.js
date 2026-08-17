const { OAuth2Client } = require('google-auth-library');
const userRepository = require('../repositories/user.repository');
const { generateToken } = require('../utils/jwt.utils');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Sign in or Sign up with Google OAuth ID Token.
 * The user.repository returns plain JS objects (no Mongoose .toJSON() needed).
 *
 * @param {string} idToken - The Google ID Token from client
 * @returns {Promise<{ user: object, token: string }>}
 */
const googleSignIn = async (idToken) => {
  if (!idToken) {
    const error = new Error('Google credential token is required');
    error.statusCode = 400;
    throw error;
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    const error = new Error('Invalid Google credential token');
    error.statusCode = 401;
    throw error;
  }

  const { sub: googleId, email, name, picture } = payload;

  if (!email) {
    const error = new Error('Google account must have an email address');
    error.statusCode = 400;
    throw error;
  }

  // 1. Check by googleId
  let user = await userRepository.findByGoogleId(googleId);

  // 2. If user does not exist, create new user
  if (!user) {
    user = await userRepository.createUser({
      email,
      name: name || email.split('@')[0],
      googleId,
      picture,
    });
  }

  const token = generateToken({ googleId: user.googleId, email: user.email });

  // user is already a plain object from the repository (no .toJSON() needed)
  return { user, token };
};

module.exports = { googleSignIn };
