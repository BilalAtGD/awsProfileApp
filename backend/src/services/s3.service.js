const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client } = require('../config/s3');

const BUCKET = process.env.S3_BUCKET_NAME;
const UPLOAD_EXPIRY = 300;    // 5 minutes — time to upload
const VIEW_EXPIRY = 900;      // 15 minutes — time to view

/**
 * Generate a presigned PUT URL so the browser can upload
 * directly to S3 without exposing AWS credentials.
 *
 * The key is scoped to the user's googleId folder so each user
 * can only overwrite their own file.
 *
 * @param {string} googleId — authenticated user's googleId
 * @param {string} fileType — MIME type e.g. "image/jpeg"
 * @returns {{ uploadUrl: string, key: string }}
 */
const generateUploadPresignedUrl = async (googleId, fileType) => {
  // Always use fixed key name avatar.jpg per user so new uploads overwrite the previous image on S3
  const key = `users/${googleId}/avatar.jpg`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: UPLOAD_EXPIRY,
  });

  return { uploadUrl, key };
};

/**
 * Generate a presigned GET URL so the browser can view
 * the user's profile image temporarily.
 *
 * Only the authenticated user can get a view URL for their own key.
 *
 * @param {string} googleId — authenticated user's googleId
 * @param {string} key      — the S3 object key stored in DB
 * @returns {string} viewUrl
 */
const generateViewPresignedUrl = async (googleId, key) => {
  // Security: ensure the key belongs to this user's folder
  if (!key.startsWith(`users/${googleId}/`)) {
    const error = new Error('Access denied — this image does not belong to you');
    error.statusCode = 403;
    throw error;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: VIEW_EXPIRY });
};

module.exports = { generateUploadPresignedUrl, generateViewPresignedUrl };
