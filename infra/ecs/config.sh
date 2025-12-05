ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

export BUCKET_NAME="tfstate-tech-challange-${ACCOUNT_ID}"
export REGION="us-east-1"
export DYNAMODB_TABLE_NAME="terraform-state-lock-tech-challange"