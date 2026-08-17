const s3Service = require('../services/s3.service');

/**
 * POST /api/s3/upload-url
 * Body: { fileType: "image/jpeg" }
 * Returns a short-lived presigned PUT URL + the S3 key
 */
const getUploadUrl = async (req, res, next) => {
  try {
    const { fileType } = req.body;

    if (!fileType || !fileType.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed',
      });
    }

    const { uploadUrl, key } = await s3Service.generateUploadPresignedUrl(
      req.user.googleId,
      fileType
    );

    res.status(200).json({
      success: true,
      data: { uploadUrl, key },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/s3/view-url
 * Body: { key: "users/xxx/avatar.jpg" }
 * Returns a short-lived presigned GET URL for the user's image
 */
const getViewUrl = async (req, res, next) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'S3 key is required',
      });
    }

    const viewUrl = await s3Service.generateViewPresignedUrl(req.user.googleId, key);

    res.status(200).json({
      success: true,
      data: { viewUrl },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUploadUrl, getViewUrl };
