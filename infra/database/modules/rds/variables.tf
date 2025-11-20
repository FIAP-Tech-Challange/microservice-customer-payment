variable "project_name" {
  description = "Nome do projeto para as tags."
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, qa, prod)."
  type        = string
}

variable "vpc_security_group_ids" {
  description = "Lista de IDs dos Security Groups para o RDS."
  type        = list(string)
}

variable "db_username" {
  description = "Usuário administrador do banco de dados."
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Senha do administrador do banco de dados."
  type        = string
  sensitive   = true
}

variable "instance_class" {
  description = "A classe da instância RDS (ex: db.t3.micro)."
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Espaço em disco em GB."
  type        = number
  default     = 20
}

variable "engine" {
  description = "Engine do banco de dados"
  type        = string
  default     = "postgres"
}

variable "engine_version" {
  description = "Versão do engine."
  type        = string
  default     = "15.10"
}

variable "db_name" {
  description = "O nome do banco de dados a ser criado."
  type        = string
}