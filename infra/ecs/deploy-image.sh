#!/bin/bash

set -e

# --- Configurações ---
REGION="us-east-1"
ECR_REPO_NAME="microservices-snack-bar"
DEFAULT_TAG="latest"


# --- 1. Identificação da Conta AWS ---
echo -e "--- Verificando credenciais AWS ---"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$ACCOUNT_ID" ]; then
    echo "Erro: Não foi possível obter o ID da conta AWS. Verifique 'aws configure'."
    exit 1
fi

ECR_URL="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
TAG=${1:-$DEFAULT_TAG}

echo "Conta: $ACCOUNT_ID"
echo "Região: $REGION"
echo "Tag do Build: $TAG"

# --- 2. Login no ECR ---
echo -e "--- Realizando Login no Amazon ECR ---"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URL

# --- 3. Build da Imagem ---
echo -e "--- Construindo Imagem Docker ---"
docker build --platform linux/amd64 -t $ECR_REPO_NAME ../../app

# --- 4. Tag e Push ---
echo -e "--- Enviando para o ECR ($ECR_URL) ---"
FULL_IMAGE_NAME="$ECR_URL/$ECR_REPO_NAME:$TAG"

docker tag $ECR_REPO_NAME:latest $FULL_IMAGE_NAME
docker push $FULL_IMAGE_NAME

echo -e "--- Sucesso! Imagem disponível em: ---"
echo "$FULL_IMAGE_NAME"