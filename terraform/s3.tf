# ==============================================================================
# S3 BUCKET FOR PROFILE IMAGES
# ==============================================================================
# Provisions an S3 bucket configured for image storage, with public read access
# for image display and CORS support for frontend interactions.

# 1. Primary S3 Bucket Resource
resource "aws_s3_bucket" "profile_pics" {
  bucket        = var.s3_bucket_name
  force_destroy = true # Allows terraform destroy to remove non-empty bucket during development

  tags = {
    Name = "ProfileApp Profile Pictures"
  }
}

# 2. Ownership Controls (BucketOwnerPreferred)
resource "aws_s3_bucket_ownership_controls" "profile_pics_ownership" {
  bucket = aws_s3_bucket.profile_pics.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# 3. Public Access Block Configuration
# Allows public reading of images while blocking unauthorized bucket settings changes
resource "aws_s3_bucket_public_access_block" "profile_pics_public_access" {
  bucket = aws_s3_bucket.profile_pics.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# 4. CORS (Cross-Origin Resource Sharing) Configuration
# Allows web browsers and backend clients to upload/fetch profile images cleanly
resource "aws_s3_bucket_cors_configuration" "profile_pics_cors" {
  bucket = aws_s3_bucket.profile_pics.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "HEAD"]
    allowed_origins = ["*"] # In production, restrict to your frontend domain
    max_age_seconds = 3000
  }
}

# 5. Bucket Policy for Public Read Access to Uploaded Profile Images
resource "aws_s3_bucket_policy" "public_read_policy" {
  bucket = aws_s3_bucket.profile_pics.id

  depends_on = [aws_s3_bucket_public_access_block.profile_pics_public_access]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.profile_pics.arn}/*"
      }
    ]
  })
}
