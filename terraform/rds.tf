# ==============================================================================
# RDS POSTGRESQL DATABASE & PRIVATE SECURITY GROUP
# ==============================================================================
# Provisions a private AWS RDS PostgreSQL instance isolated inside the Private Subnet.
# Network access is restricted ONLY to the EC2 Backend Server Security Group.

# 1. Security Group for RDS Instance (Private Ingress Chained to EC2 SG)
resource "aws_security_group" "rds_sg" {
  name        = "profileapp-rds-sg"
  description = "Private Security group for ProfileApp RDS PostgreSQL instance"
  vpc_id      = aws_vpc.main.id

  # Inbound Rule: Allow PostgreSQL traffic on port 5432 ONLY from the EC2 Security Group
  ingress {
    description     = "PostgreSQL access from EC2 server ONLY"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  # Outbound Rule: Allow outgoing response traffic
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

# 2. RDS PostgreSQL Database Instance (Private Subnet)
resource "aws_db_instance" "postgres" {
  identifier        = "profileapp-db"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  storage_type      = "gp2"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  publicly_accessible    = false # Zero Public IP — Isolated in Private Subnet!

  skip_final_snapshot = true

  tags = {
    Name = "profileapp-db"
  }
}
