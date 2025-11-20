output "db_instance_endpoint" {
  description = "O endpoint de conexão do banco de dados."
  value       = aws_db_instance.default.endpoint
}

output "db_instance_port" {
  description = "A porta de conexão do banco de dados."
  value       = aws_db_instance.default.port
}

output "db_instance_name" {
  description = "O nome (identifier) da instância RDS."
  value       = aws_db_instance.default.identifier
}

output "db_instance_username" {
  description = "O nome do usuário master do banco de dados."
  value       = aws_db_instance.default.username
}

output "rds_endpoint" {
  value = aws_db_instance.default.endpoint
}