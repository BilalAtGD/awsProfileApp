# ==============================================================================
# PROVIDERS CONFIGURATION
# ==============================================================================
# This file defines the required Terraform version, cloud providers, and default settings.

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile != "" ? var.aws_profile : null

  # Default tags applied automatically to ALL resources created by this Terraform workspace
  default_tags {
    tags = {
      Project     = "ProfileAppv2"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
