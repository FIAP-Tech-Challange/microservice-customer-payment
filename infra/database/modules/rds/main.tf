resource "aws_db_instance" "default" {
  identifier           = "${var.project_name}-${var.environment}-rds"
  allocated_storage    = var.allocated_storage
  engine               = var.engine
  engine_version       = var.engine_version
  instance_class       = var.instance_class
  username             = var.db_username
  password             = var.db_password
  db_name              = var.db_name

  publicly_accessible    = true
  vpc_security_group_ids = var.vpc_security_group_ids

  skip_final_snapshot = var.environment != "main"
  final_snapshot_identifier = var.environment == "main" ? "${var.project_name}-${var.environment}-final-${formatdate("20060102-150405", timestamp())}" : null
}