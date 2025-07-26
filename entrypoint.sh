#!/bin/sh

set -e

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
