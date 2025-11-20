#!/bin/sh

set -e

CERTS_DIR="/app/certs"
CERT_FILE="$CERTS_DIR/rds-combined-ca-bundle.pem"

# 🔽 Baixar certificado RDS
echo "📥 Baixando certificado RDS CA bundle..."
mkdir -p "$CERTS_DIR"
curl -s https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -o "$CERT_FILE"

if [ ! -s "$CERT_FILE" ]; then
  echo "❌ Falha ao baixar certificado RDS."
  exit 1
fi
echo "✅ Certificado RDS salvo em $CERT_FILE"

echo "🔄 Aguardando o PostgreSQL iniciar..."
until PGPASSWORD=$DB_PG_PASSWORD psql -h "$DB_PG_HOST" -U "$DB_PG_USER" -d "$DB_PG_NAME" -c '\q'; do
  echo "🔄 PostgreSQL indisponível - esperando..."
  sleep 2
done
echo "✅ PostgreSQL está disponível!"

echo "➡️ Executando migrations do TypeORM..."
npm run typeorm:migration:run-js || {
  echo "❌ Falha ao executar as migrações. Logs detalhados:"
  set -x
  NODE_ENV=development DEBUG=typeorm:* npm run typeorm:migration:run-js
  exit 1
}

echo "✅ Migrations aplicadas com sucesso."
echo "🚀 Iniciando a aplicação NestJS..."
exec node dist/external/consumers/NestAPI/main.js
