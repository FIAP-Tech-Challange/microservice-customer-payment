import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './models/entities/notification.entity';
import { NOTIFICATION_REPOSITORY_PORT_KEY } from './ports/output/notification.repository.port';
import { NotificationRepositoryTypeORM } from './adapters/secondary/notification.repository.typeorm';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [],
  providers: [
    NotificationService,
    {
      provide: NOTIFICATION_REPOSITORY_PORT_KEY,
      useClass: NotificationRepositoryTypeORM,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
