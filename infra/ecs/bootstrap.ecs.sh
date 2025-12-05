set -e

source ./config.sh

WORKSPACE=${1:-dev}

echo "🚀  Iniciando Bootstrap ECS para o ambiente Terraform..."
echo "--------------------------------------------------"

echo "Bucket S3:        $BUCKET_NAME"
echo "Tabela DynamoDB:  $DYNAMODB_TABLE_NAME"
echo "Região AWS:         $REGION"
echo "Workspace Inicial:  $WORKSPACE"
echo "--------------------------------------------------"

setup_s3_bucket() {
  echo -n "Verificando bucket S3... "
  if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "✔️ Encontrado."
  else
    echo "❌ Não encontrado. Criando..."
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"
    echo "✔️ Bucket S3 '$BUCKET_NAME' criado."
  fi
}

setup_dynamodb_table() {
  echo -n "Verificando tabela DynamoDB... "
  if aws dynamodb describe-table --table-name "$DYNAMODB_TABLE_NAME" --region "$REGION" >/dev/null 2>&1; then
    echo "✔️ Encontrada."
  else
    echo "❌ Não encontrada. Criando..."
    aws dynamodb create-table \
      --table-name "$DYNAMODB_TABLE_NAME" \
      --billing-mode PAY_PER_REQUEST \
      --attribute-definitions AttributeName=LockID,AttributeType=S \
      --key-schema AttributeName=LockID,KeyType=HASH \
      --region "$REGION" > /dev/null
    echo "✔️ Tabela DynamoDB '$DYNAMODB_TABLE_NAME' criada."
  fi
}

# --- 🚀 EXECUÇÃO ---
setup_s3_bucket
setup_dynamodb_table

echo "--------------------------------------------------"
echo "✅ Ambiente de backend pronto."
echo "Inicializando Terraform com configuração dinâmica de backend..."

state_key="infra/ecs-customer/terraform.tfstate"

# A mágica acontece aqui: apontamos para o mesmo bucket, mas uma KEY diferente
terraform init \
    -reconfigure \
    -backend-config="bucket=${BUCKET_NAME}" \
    -backend-config="key=${STATE_KEY}" \
    -backend-config="region=${REGION}" \
    -backend-config="dynamodb_table=${DYNAMODB_TABLE_NAME}" \
    -backend-config="encrypt=true"

# Cria ou seleciona o workspace desejado
terraform workspace select "$WORKSPACE" || terraform workspace new "$WORKSPACE"

# --- TERRAFORM APPLY ---
echo "--------------------------------------------------"
echo "🔎 Validando e Planejando..."
terraform validate
terraform plan -out=tfplan

# Cria ou seleciona o workspace desejado
terraform workspace select "$WORKSPACE" || terraform workspace new "$WORKSPACE"

echo "--------------------------------------------------"
echo "🚀 Bootstrap concluído!"