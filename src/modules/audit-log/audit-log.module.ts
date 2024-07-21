import { Global, Module } from '@nestjs/common';
import { AuditLogService } from './services/audit-log.service';
import { AuditLogController } from './controllers/audit-log.controller';
import { AuditLog } from './models/audit-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogController],
  providers: [AuditLogService,AuditLogInterceptor],
  exports: [AuditLogInterceptor,AuditLogService],
})
export class AuditLogModule {}
