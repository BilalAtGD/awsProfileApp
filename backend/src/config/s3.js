const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

/**
 * AWS S3 Client
 *
 * Credentials are resolved automatically via the AWS SDK default
 * credential provider chain in this order:
 *   1. AWS_PROFILE env var → reads ~/.aws/credentials named profile
 *   2. AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars (fallback)
 *   3. EC2/ECS instance IAM role (when deployed on AWS compute)
 *
 * For local development, set AWS_PROFILE=profileapp in your .env
 * and ensure you have run: aws configure --profile profileapp
 */
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
});

module.exports = { s3Client };
