variable "repository_ecr_name" {
  description = "O nome do repositório ECR existente."
  type        = string
}

variable "project_name" {
  description = "O nome do projeto."
  type        = string
  default     = "microservice-customer-payment"
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

variable "api_key_name_order" {
  description = "Nome do segredo da API Key do serviço de pedidos."
  type        = string
}

variable "order_service_base_url_param" {
  description = "Local da url do serviço de pedidos."
  type        = string
}

variable "jwt_access_token_expiration_time" {
  description = "Tempo de expiração do token de acesso JWT."
  type        = string
  default     = "1d"
}

variable "jwt_secret_name" {
  description = "Local do segredo JWT."
  type        = string
}

variable "external_payment_consumer_key" {
  description = "Chave do consumidor de pagamento externo."
  type        = string
}
