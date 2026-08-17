# ==============================================================================
# VIRTUAL PRIVATE CLOUD (VPC) & NETWORKING ARCHITECTURE
# ==============================================================================
# Provisions a secure AWS VPC with isolated Public and Private Subnets.
# - Public Subnet: Houses the EC2 Backend server (accessible via Internet Gateway).
# - Private Subnets: House the RDS PostgreSQL Database (isolated from internet access).

# 1. Main VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "profileapp-vpc"
  }
}

# 2. Internet Gateway (for Public Subnet internet access)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "profileapp-igw"
  }
}

# 3. Public Subnet (For EC2 Backend Server)
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "profileapp-public-subnet-1a"
  }
}

# 4. Private Subnets (For RDS Database - Spans 2 Availability Zones for RDS requirements)
resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "profileapp-private-subnet-1a"
  }
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "profileapp-private-subnet-1b"
  }
}

# 5. RDS Subnet Group (Combines Private Subnets for Multi-AZ compliance)
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "profileapp-rds-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name = "profileapp-rds-subnet-group"
  }
}

# 6. Route Table for Public Subnet
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "profileapp-public-rt"
  }
}

# 7. Associate Public Subnet to Public Route Table
resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}
