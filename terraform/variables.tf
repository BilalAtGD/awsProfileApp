# ==============================================================================
# VARIABLES DEFINITION
# ==============================================================================
# Input variables act like parameters in a function. They allow us to customize
# infrastructure settings without modifying the resource logic.

variable "aws_region" {
  description = "The AWS region to deploy infrastructure into"
  type        = string
  default     = "ap-southeast-1"
}

variable "aws_profile" {
  description = "The AWS CLI named profile to use for credentials (leave empty to use default AWS SDK chain)"
  type        = string
  default     = ""
}

variable "environment" {
  description = "Deployment environment name (e.g., development, staging, production)"
  type        = string
  default     = "development"
}

# ------------------------------------------------------------------------------
# S3 Variables
# ------------------------------------------------------------------------------
variable "s3_bucket_name" {
  description = "Unique name for the S3 bucket to store profile pictures"
  type        = string
  default     = "profileapp-pics-southeast1-v2"
}

# ------------------------------------------------------------------------------
# RDS PostgreSQL Variables
# ------------------------------------------------------------------------------
variable "db_name" {
  description = "Database name created inside PostgreSQL upon initialization"
  type        = string
  default     = "profileapp"
}

variable "db_username" {
  description = "Master username for PostgreSQL RDS instance"
  type        = string
  default     = "profileadmin"
}

variable "db_password" {
  description = "Master password for PostgreSQL RDS instance (kept secret!)"
  type        = string
  sensitive   = true
}

variable "db_allocated_storage" {
  description = "Storage allocated for RDS in Gigabytes (Free Tier allows up to 20 GB)"
  type        = number
  default     = 20
}

variable "db_instance_class" {
  description = "RDS instance type (db.t3.micro is widely supported)"
  type        = string
  default     = "db.t3.micro"
}

# ------------------------------------------------------------------------------
# EC2 Variables
# ------------------------------------------------------------------------------
variable "ec2_instance_type" {
  description = "AWS EC2 Instance Type for Backend Server"
  type        = string
  default     = "t3.micro"
}

variable "frontend_url" {
  description = "Vercel Frontend URL allowed in S3 CORS"
  type        = string
  default     = "*"
}

