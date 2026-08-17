# ==============================================================================
# OUTPUT VALUES
# ==============================================================================
# Outputs display essential connection parameters after `terraform apply`.
# These values can be copied directly into backend/.env file.

output "s3_bucket_name" {
  description = "Name of the created S3 Bucket for Profile Images"
  value       = aws_s3_bucket.profile_pics.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 Bucket"
  value       = aws_s3_bucket.profile_pics.arn
}

output "rds_endpoint" {
  description = "Full RDS connection endpoint (Host:Port)"
  value       = aws_db_instance.postgres.endpoint
}

output "db_host" {
  description = "Database Host Address (to be used as DB_HOST in .env)"
  value       = aws_db_instance.postgres.address
}

output "db_port" {
  description = "Database Port (to be used as DB_PORT in .env)"
  value       = aws_db_instance.postgres.port
}

output "db_name" {
  description = "Database Name (DB_NAME)"
  value       = aws_db_instance.postgres.db_name
}
