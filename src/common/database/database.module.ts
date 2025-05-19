import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgresConfigService } from './postgres.config.service';
import { ConfigService } from '@nestjs/config';
import { SQLiteConfigService } from './sqlite.config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('ConfigService', configService.get<string>('DB_TYPE'));
        return configService.get<string>('DB_TYPE') === 'sqlite'
          ? new SQLiteConfigService().createTypeOrmOptions()
          : new PostgresConfigService(configService).createTypeOrmOptions();
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private dataSource: DataSource) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('Database initialized successfully.');
    } else {
      this.logger.error(`Error when connecting to database..`);
    }
  }
}
