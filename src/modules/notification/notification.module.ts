import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './models/entities/notification.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
