import { PostgresGeneralDataSource } from './postgresGeneralDataSource';
import { PostgresDataSourceConfig } from './postgresDataSourceConfig';
import { Logger } from '@nestjs/common';

let instance: PostgresGeneralDataSource | null = null;

export async function createPostgresGeneralDataSource(): Promise<PostgresGeneralDataSource> {
  const logger = new Logger(createPostgresGeneralDataSource.name);

  if (instance && instance['dataSource'].isInitialized) {
    return instance;
  }
  const dataSource = PostgresDataSourceConfig.create({
    host: process.env.DB_PG_HOST || 'localhost',
    port: parseInt(process.env.DB_PG_PORT || '5432'),
    username: process.env.DB_PG_USER || '',
    password: process.env.DB_PG_PASSWORD || '',
    database: process.env.DB_PG_NAME || '',
  });

  await dataSource
    .initialize()
    .then(() => {
      logger.log('Postgres data source initialized.');
    })
    .catch((error) => {
      logger.error('Error initializing Postgres data source:', error);
    });

  instance = new PostgresGeneralDataSource(dataSource);
  return instance;
}
