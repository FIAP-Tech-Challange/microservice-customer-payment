variable "project_name" {
  description = "O nome do projeto, usado para nomear recursos."
  type        = string
  default     = "db-customer-payment"
}

variable "db_username" {
  description = "O nome do usuário root do banco."
  type        = string
}

variable "db_password" {
  description = "Senha do usuário do banco"
  type        = string
}

variable "db_name" {
  description = "O nome do banco de dados a ser criado."
  type        = string
}

