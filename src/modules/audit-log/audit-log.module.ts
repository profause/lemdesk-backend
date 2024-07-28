import { Global, Module } from '@nestjs/common';
import { AuditLogService } from './services/audit-log.service';
import { AuditLogController } from './controllers/audit-log.controller';
import { AuditLog } from './models/audit-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';
import { AuditLogSubscriber } from './subscribers/audit-log.subscriber';
import { AuthService } from '../user/services/auth.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog]),UserModule],
  controllers: [AuditLogController],
  providers: [AuditLogService,AuditLogInterceptor,AuditLogSubscriber],
  exports: [AuditLogInterceptor,AuditLogService,AuditLogSubscriber],
})
export class AuditLogModule {}
