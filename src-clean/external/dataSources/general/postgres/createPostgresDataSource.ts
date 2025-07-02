import { PostgresGeneralDataSource } from './postgresGeneralDataSource';
import { PostgresDataSourceConfig } from './postgresDataSourceConfig';

export async function createPostgresGeneralDataSource(): Promise<PostgresGeneralDataSource> {
  const dataSource = PostgresDataSourceConfig.create({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'tech_challenge',
  });

  await dataSource.initialize();

  return new PostgresGeneralDataSource(dataSource);
}
