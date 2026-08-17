# ==============================================================================
# RDS POSTGRESQL DATABASE & SECURITY GROUP
# ==============================================================================
# Provisions an AWS RDS PostgreSQL database instance along with a security group
# that opens port 5432 for backend database connections.

# 1. Security Group for RDS Instance
resource "aws_security_group" "rds_sg" {
  name        = "profileapp-rds-sg"
  description = "Security group for ProfileApp RDS PostgreSQL instance"

  # Inbound Rule: Allow PostgreSQL traffic on port 5432 from anywhere (for local dev access)
  ingress {
    description = "PostgreSQL access"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound Rule: Allow all outgoing traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "profileapp-rds-sg"
  }
}

# 2. RDS PostgreSQL Database Instance
resource "aws_db_instance" "postgres" {
  identifier        = "profileapp-db"
  engine            = "postgres"
  engine_version    = "15" # Compatible with standard PostgreSQL 15 drivers
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  storage_type      = "gp2"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  publicly_accessible    = true # Set to true to allow connections from local dev environment
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  skip_final_snapshot = true # Enables fast terraform destroy during testing without creating a snapshot backup

  tags = {
    Name = "profileapp-db"
  }
}
