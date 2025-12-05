variable "repository_ecr_name" {
  description = "O nome do repositório ECR existente."
  type        = string
}

variable "project_name" {
  description = "O nome do projeto."
  type        = string
}

variable "image_tag" {
  description = "Tag da imagem Docker para deploy"
  type        = string
  default     = "latest"
}

variable "db_pg_host" {
  description = "Endereço do host do banco de dados PostgreSQL."
  type        = string
}

variable "db_pg_port" {
  description = "Porta do banco de dados PostgreSQL."
  type        = string
  default     = "5432"
}

variable "db_pg_username" {
  description = "Nome de usuário do banco de dados PostgreSQL."
  type        = string
}

variable "db_pg_password" {
  description = "Senha do banco de dados PostgreSQL."
  type        = string
}

variable "db_pg_name" {
  description = "Nome do banco de dados PostgreSQL."
  type        = string
}

variable "api_key" {
  description = "Chave de API para o serviço externo."
  type        = string
}