import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('dbHost'),
      port: this.configService.get<number>('dbPort'),
      username: this.configService.get<string>('dbUser'),
      password: this.configService.get<string>('dbPassword'),
      database: this.configService.get<string>('dbName'),
      entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../../db/migrations/*{.ts,.js}'],
    };
  }
}
