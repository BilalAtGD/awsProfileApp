const express = require('express');
const { getUploadUrl, getViewUrl } = require('../controllers/s3.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// All S3 URL routes require authentication
router.use(authenticate);

// POST /api/s3/upload-url  — get a presigned PUT URL to upload image
router.post('/upload-url', getUploadUrl);

// POST /api/s3/view-url   — get a presigned GET URL to view image
router.post('/view-url', getViewUrl);

module.exports = router;
