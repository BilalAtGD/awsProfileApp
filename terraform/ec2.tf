# ==============================================================================
# EC2 BACKEND INSTANCE & IAM ROLE FOR S3 ACCESS
# ==============================================================================
# Provisions an AWS EC2 instance in the Public Subnet attached to an IAM Role.
# This gives the EC2 server automatic permission to manage S3 profile images
# without keeping any static AWS Access Keys in .env files!

# 1. Look up the latest Ubuntu 22.04 LTS AMI in the active region
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical official AWS account ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 2. Security Group for EC2 Backend Server
resource "aws_security_group" "ec2_sg" {
  name        = "profileapp-ec2-sg"
  description = "Security Group for ProfileApp EC2 Node.js Backend Server"
  vpc_id      = aws_vpc.main.id

  # HTTP (Web traffic / Caddy Let's Encrypt challenge)
  ingress {
    description = "HTTP Web Traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS (Secure Web & API Traffic)
  ingress {
    description = "HTTPS Web Traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH Access
  ingress {
    description = "SSH Access for Server Administration"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound Rule: Allow all outgoing traffic (e.g., pulling Docker images, AWS APIs)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "profileapp-ec2-sg"
  }
}

# 3. IAM Role for EC2 Instance
resource "aws_iam_role" "ec2_s3_role" {
  name = "profileapp-ec2-s3-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# 4. IAM Policy granting S3 Access to the Profile Pictures Bucket ONLY
resource "aws_iam_policy" "s3_access_policy" {
  name        = "profileapp-ec2-s3-policy"
  description = "Allows EC2 instance to read and write profile images in S3 bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.profile_pics.arn,
          "${aws_s3_bucket.profile_pics.arn}/*"
        ]
      }
    ]
  })
}

# 5. Attach IAM Policy to IAM Role
resource "aws_iam_role_policy_attachment" "attach_s3_policy" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}

# 6. IAM Instance Profile (Required to assign Role to EC2 instance)
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "profileapp-ec2-instance-profile"
  role = aws_iam_role.ec2_s3_role.name
}

# 7. EC2 Instance Definition
resource "aws_instance" "backend_server" {
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = var.ec2_instance_type
  subnet_id            = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  # Initial Boot Script: Configures 2GB Swap space & installs official Docker & Docker Compose
  user_data = <<-EOF
              #!/bin/bash
              set -e

              # 1. Create 2GB swap space to prevent memory issues during builds on t3.micro
              fallocate -l 2G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile none swap sw 0 0' >> /etc/fstab

              # 2. Update packages and install prerequisites
              apt-get update -y
              apt-get install -y ca-certificates curl gnupg lsb-release git

              # 3. Add official Docker GPG key and APT repository
              install -m 0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              chmod a+r /etc/apt/keyrings/docker.gpg

              echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

              # 4. Install Docker Engine, CLI, and Docker Compose Plugin
              apt-get update -y
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

              # 5. Start and enable Docker, add ubuntu user to docker group
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "profileapp-backend-server"
  }
}
