terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = "us-east-1"
}

locals {
  env_config = {
    dev = {
      instance_class = "db.t3.micro"
    }
    qa = {
      instance_class = "db.t3.micro"
    }
    main = {
      instance_class = "db.t3.micro" 
    }
  }
  
  current_env_config = local.env_config[terraform.workspace]
}

resource "aws_security_group" "rds_sg" {
  name        = "${terraform.workspace}/allow-rds-access"
  description = "Allow PostgreSQL inbound traffic"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Postgres"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_vpc" "default" {
  default = true
}

# Módulo RDS
module "rds" {
  source = "./modules/rds"

  project_name      = var.project_name
  environment       = terraform.workspace
  
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  
  db_username = var.db_username
  db_password = var.db_password
  db_name     = var.db_name
  
  instance_class = local.current_env_config.instance_class
}

resource "aws_ssm_parameter" "rds_endpoint" {
  name  = "/${var.project_name}/${terraform.workspace}/rds_endpoint"
  type  = "String"
  value = split(":", module.rds.rds_endpoint)[0]

  tags = {
    Project     = var.project_name
    Environment = terraform.workspace
  }
}

resource "aws_ssm_parameter" "db_username" {
  name  = "/${var.project_name}/${terraform.workspace}/db_username"
  type  = "String"
  value = var.db_username

  tags = {
    Project     = var.project_name
    Environment = terraform.workspace
  }
}

resource "aws_ssm_parameter" "db_password" {
  name  = "/${var.project_name}/${terraform.workspace}/db_password"
  type  = "SecureString"
  value = var.db_password

  tags = {
    Project     = var.project_name
    Environment = terraform.workspace
  }
}

output "provisioning_status" {
  description = "Status e informações sobre os recursos criados."
  value = <<EOT
  --------------------------------------------------
  ✅ Sucesso! A infraestrutura foi provisionada.
  
  Ambiente: ${terraform.workspace}
  Endpoint: ${module.rds.rds_endpoint}

  Nome dos parametros para acesso com SSM:
  - DB Username: ${aws_ssm_parameter.db_username.name}
  - DB Password: ${aws_ssm_parameter.db_password.name}
  - RDS Endpoint: ${aws_ssm_parameter.rds_endpoint.name}
  EOT
}